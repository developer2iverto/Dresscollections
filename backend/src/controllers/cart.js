import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Product from '../models/Product.js';

// Note: This is a simple cart implementation using user document
// For production, consider using a separate Cart model or Redis for better performance

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    // For this implementation, we'll store cart in user session or return mock data
    // In production, you'd have a separate Cart model
    
    res.status(200).json({
      success: true,
      cart: {
        items: [],
        totalItems: 0,
        totalPrice: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { productId, quantity, variant } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient stock'
      });
    }

    // In a real implementation, you would add to cart here
    // For now, just return success
    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      item: {
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0]?.url
        },
        quantity,
        variant
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { quantity } = req.body;
    const { itemId } = req.params;

    // In a real implementation, you would update the cart item here
    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      itemId,
      quantity
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    // In a real implementation, you would remove the cart item here
    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      itemId
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    // In a real implementation, you would clear the cart here
    res.status(200).json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    next(error);
  }
};