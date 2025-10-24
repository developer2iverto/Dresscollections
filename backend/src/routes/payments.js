import express from 'express';
import { body } from 'express-validator';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createPayUOrder,
  verifyPayUPayment,
  getPaymentMethods,
  refundPayment
} from '../controllers/payments.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

router.get('/methods', getPaymentMethods);

// Razorpay routes
router.post('/razorpay/create-order', [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('currency').optional().isIn(['INR', 'USD']).withMessage('Invalid currency'),
  body('orderId').isMongoId().withMessage('Invalid order ID')
], createRazorpayOrder);

router.post('/razorpay/verify', [
  body('razorpay_payment_id').notEmpty().withMessage('Razorpay payment ID is required'),
  body('razorpay_order_id').notEmpty().withMessage('Razorpay order ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Razorpay signature is required'),
  body('orderId').isMongoId().withMessage('Invalid order ID')
], verifyRazorpayPayment);

// PayU routes
router.post('/payu/create-order', [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('orderId').isMongoId().withMessage('Invalid order ID'),
  body('productInfo').notEmpty().withMessage('Product info is required'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required')
], createPayUOrder);

router.post('/payu/verify', [
  body('mihpayid').notEmpty().withMessage('PayU payment ID is required'),
  body('status').notEmpty().withMessage('Payment status is required'),
  body('hash').notEmpty().withMessage('Payment hash is required'),
  body('orderId').isMongoId().withMessage('Invalid order ID')
], verifyPayUPayment);

// Super Admin only routes
router.use(authorize('super_admin'));

router.post('/refund', [
  body('paymentId').notEmpty().withMessage('Payment ID is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Refund amount must be greater than 0'),
  body('reason').optional().isString().withMessage('Reason must be a string')
], refundPayment);

export default router;