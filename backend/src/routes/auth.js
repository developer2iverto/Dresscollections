import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail
} from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name must be at least 1 character'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  // Phone: in dev/offline mode, be lenient; otherwise require digits pattern
  body('phone')
    .custom((value) => {
      const forceOffline = String(process.env.DEV_OFFLINE_AUTH || 'true').toLowerCase() === 'true';
      if (forceOffline) {
        // Accept any non-empty string in dev to avoid UX friction
        return typeof value === 'string' && value.trim().length > 0;
      }
      return /^\+?[\d\s-()]+$/.test(String(value || ''));
    })
    .withMessage('Please provide a valid phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], login);

router.post('/logout', logout);
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], forgotPassword);

router.put('/reset-password/:resetToken', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], resetPassword);

router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.use(protect);

router.get('/me', getMe);
router.put('/update-profile', [
  body('firstName').optional().trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').optional().trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
], updateProfile);

router.put('/update-password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], updatePassword);

export default router;