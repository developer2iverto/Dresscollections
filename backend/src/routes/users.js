import express from 'express';
import { body, query } from 'express-validator';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress
} from '../controllers/users.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// User address management
router.post('/addresses', [
  body('type').optional().isIn(['home', 'work', 'other']).withMessage('Invalid address type'),
  body('street').trim().notEmpty().withMessage('Street address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('country').optional().trim().notEmpty().withMessage('Country cannot be empty')
], addUserAddress);

router.put('/addresses/:addressId', [
  body('street').optional().trim().notEmpty().withMessage('Street address cannot be empty'),
  body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
  body('state').optional().trim().notEmpty().withMessage('State cannot be empty'),
  body('zipCode').optional().trim().notEmpty().withMessage('Zip code cannot be empty')
], updateUserAddress);

router.delete('/addresses/:addressId', deleteUserAddress);
router.put('/addresses/:addressId/default', setDefaultAddress);

// Super Admin only routes
router.use(authorize('super_admin'));

router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
], getUsers);

router.get('/:id', getUserById);

router.put('/:id', [
  body('firstName').optional().trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').optional().trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], updateUser);

router.delete('/:id', deleteUser);

export default router;