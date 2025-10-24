import express from 'express';
import { body } from 'express-validator';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cart.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

router.get('/', getCart);

router.post('/add', [
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('variant.color').optional().isString().withMessage('Color must be a string'),
  body('variant.size').optional().isString().withMessage('Size must be a string')
], addToCart);

router.put('/update/:itemId', [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], updateCartItem);

router.delete('/remove/:itemId', removeFromCart);
router.delete('/clear', clearCart);

export default router;