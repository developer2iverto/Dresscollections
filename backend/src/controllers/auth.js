import { validationResult } from 'express-validator';
import User from '../models/User.js';
import crypto from 'crypto';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Demo admin support: allow multiple demo admin aliases to sign in easily
const DEMO_ADMIN_EMAILS = new Set(['admin@cms.com', 'admin@garments.com']);
const isDemoAdmin = (email) => DEMO_ADMIN_EMAILS.has(String(email || '').toLowerCase());
// Simple offline user store for development when DB is unavailable
const OFFLINE_USERS = new Map(); // key: email, value: { id, firstName, lastName, email, phone, role, passwordHash }

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { firstName, lastName, email, phone, password } = req.body;

    const dbReady = Boolean(
      mongoose.connection &&
      mongoose.connection.readyState === 1 &&
      mongoose.connection.db
    );
    const forceOffline = String(process.env.DEV_OFFLINE_AUTH || 'true').toLowerCase() === 'true';
    if (forceOffline || !dbReady) {
      // Offline dev fallback: register in-memory
      const existingOffline = OFFLINE_USERS.get(email);
      if (existingOffline) {
        return res.status(400).json({ success: false, error: 'User already exists with this email' });
      }
      const role = isDemoAdmin(email) ? 'admin' : 'user';
      const id = `offline-${Date.now()}`;
      const passwordHash = await bcrypt.hash(password, 10);
      const offlineUser = { id, firstName, lastName, email, phone, role, passwordHash };
      OFFLINE_USERS.set(email, offlineUser);
      const token = jwt.sign({ id, email, role }, process.env.JWT_SECRET || 'dev_secret_key_change_me', { expiresIn: process.env.JWT_EXPIRE || '30d' });
      return res.status(201).json({
        success: true,
        token,
        user: {
          id,
          firstName,
          lastName,
          email,
          phone,
          role
        }
      });
    }

    // If DB is ready, proceed with persistent registration
    if (dbReady) {
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
      }

      // Determine role: demo admin always gets admin role; otherwise first user is admin
      const totalUsers = await User.countDocuments();
      const role = isDemoAdmin(email) ? 'admin' : (totalUsers === 0 ? 'admin' : 'user');

      // Create user
      const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        role
      });

      // Generate token
      const token = user.getSignedJwtToken();

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    }

    // Fallback: if DB not actually ready (connecting/buffering), perform offline registration
    const role = isDemoAdmin(email) ? 'admin' : 'user';
    const id = `offline-${Date.now()}`;
    const passwordHash = await bcrypt.hash(password, 10);
    const offlineUser = { id, firstName, lastName, email, phone, role, passwordHash };
    OFFLINE_USERS.set(email, offlineUser);
    const token = jwt.sign({ id, email, role }, process.env.JWT_SECRET || 'dev_secret_key_change_me', { expiresIn: process.env.JWT_EXPIRE || '30d' });
    return res.status(201).json({
      success: true,
      token,
      user: {
        id,
        firstName,
        lastName,
        email,
        phone,
        role
      }
    });
  } catch (error) {
    // If a mongoose buffering error occurs, transparently fallback to offline registration
    const isBufferingTimeout =
      error &&
      error.name === 'MongooseError' &&
      /buffering timed out/i.test(error.message || '');
    if (isBufferingTimeout) {
      try {
        const { firstName, lastName, email, phone, password } = req.body;
        if (OFFLINE_USERS.has(email)) {
          return res.status(400).json({ success: false, error: 'User already exists with this email' });
        }
        const role = isDemoAdmin(email) ? 'admin' : 'user';
        const id = `offline-${Date.now()}`;
        const passwordHash = await bcrypt.hash(password, 10);
        const offlineUser = { id, firstName, lastName, email, phone, role, passwordHash };
        OFFLINE_USERS.set(email, offlineUser);
        const token = jwt.sign({ id, email, role }, process.env.JWT_SECRET || 'dev_secret_key_change_me', { expiresIn: process.env.JWT_EXPIRE || '30d' });
        return res.status(201).json({
          success: true,
          token,
          user: {
            id,
            firstName,
            lastName,
            email,
            phone,
            role
          }
        });
      } catch (fallbackErr) {
        // If fallback also fails, bubble original error
        return next(error);
      }
    }
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // If DB is offline, allow demo admin to login with a signed JWT
    const dbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (!dbConnected && isDemoAdmin(email)) {
      const token = jwt.sign(
        {
          id: 'demo-admin',
          email,
          role: 'admin'
        },
        process.env.JWT_SECRET || 'dev_secret_key_change_me',
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: 'demo-admin',
          firstName: 'Admin',
          lastName: 'Demo',
          email,
          phone: '+1000000000',
          role: 'admin',
          lastLogin: new Date()
        }
      });
    }

    // Check for user; if not found and demo email, bootstrap admin regardless of existing users
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      if (isDemoAdmin(email)) {
        const demo = await User.create({
          firstName: 'Admin',
          lastName: 'Demo',
          email,
          phone: '+1000000000',
          password: password,
          role: 'admin'
        });
        const token = demo.getSignedJwtToken();
        demo.lastLogin = new Date();
        await demo.save();
        return res.status(200).json({
          success: true,
          token,
          user: {
            id: demo._id,
            firstName: demo.firstName,
            lastName: demo.lastName,
            email: demo.email,
            phone: demo.phone,
            role: demo.role,
            lastLogin: demo.lastLogin
          }
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // Demo fallback: if trying demo admin, reset password to provided and proceed
      if (isDemoAdmin(email)) {
        user.password = password;
        user.lastLogin = new Date();
        await user.save();
        const token = user.getSignedJwtToken();
        return res.status(200).json({
          success: true,
          token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            lastLogin: user.lastLogin
          }
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const dbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (!dbConnected) {
      // In offline mode, return the decoded token payload as the user
      return res.status(200).json({ success: true, user: {
        _id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        firstName: req.user.firstName || 'User',
        lastName: req.user.lastName || 'Offline',
        phone: req.user.phone || '+1000000000'
      }});
    }
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'There is no user with that email'
      });
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // TODO: Send email with reset token
    // For now, just return success message
    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
      resetToken // Remove this in production
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      emailVerificationToken: req.params.token
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification token'
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};