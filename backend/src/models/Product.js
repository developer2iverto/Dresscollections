import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please add a review comment'],
    maxlength: [500, 'Review cannot be more than 500 characters']
  },
  helpful: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot be more than 100%'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['mens-wear', 'womens-fashion', 'kids-collection', 'accessories', 'footwear', 'activewear', 'formal-wear', 'casual-wear']
  },
  subcategory: {
    type: String,
    required: [true, 'Please add a subcategory'],
    enum: ['shirts', 'pants', 'dresses', 'tops', 'jeans', 'jackets', 'sweaters', 'skirts', 'shorts', 'suits', 'blazers', 'coats', 'hoodies', 't-shirts', 'blouses', 'leggings', 'bags', 'belts', 'jewelry', 'hats', 'scarves', 'shoes', 'sneakers', 'boots', 'sandals']
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand']
  },
  sku: {
    type: String,
    required: [true, 'Please add a SKU'],
    unique: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  // Garment-specific attributes
  sizes: [{
    size: {
      type: String,
      required: true,
      enum: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50']
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    price: Number // Optional price variation for different sizes
  }],
  colors: [{
    name: {
      type: String,
      required: true
    },
    hexCode: String, // Color hex code for display
    images: [String], // Specific images for this color
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  }],
  material: {
    primary: {
      type: String,
      required: [true, 'Please specify primary material'],
      enum: ['cotton', 'polyester', 'wool', 'silk', 'linen', 'denim', 'leather', 'synthetic', 'blend', 'cashmere', 'viscose', 'modal', 'bamboo', 'hemp']
    },
    composition: String, // e.g., "60% Cotton, 40% Polyester"
    blend: [String] // Array of materials in blend
  },
  fit: {
    type: String,
    enum: ['slim', 'regular', 'relaxed', 'oversized', 'tailored', 'loose', 'tight', 'athletic'],
    default: 'regular'
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex', 'kids-boys', 'kids-girls'],
    required: [true, 'Please specify gender category']
  },
  ageGroup: {
    type: String,
    enum: ['adult', 'teen', 'kids', 'toddler', 'infant'],
    default: 'adult'
  },
  season: {
    type: String,
    enum: ['spring', 'summer', 'fall', 'winter', 'all-season'],
    default: 'all-season'
  },
  occasion: [{
    type: String,
    enum: ['casual', 'formal', 'business', 'party', 'wedding', 'sports', 'beach', 'travel', 'everyday']
  }],
  careInstructions: {
    washing: {
      type: String,
      enum: ['machine-wash-cold', 'machine-wash-warm', 'hand-wash', 'dry-clean-only', 'do-not-wash']
    },
    drying: {
      type: String,
      enum: ['tumble-dry-low', 'tumble-dry-medium', 'air-dry', 'lay-flat', 'do-not-dry']
    },
    ironing: {
      type: String,
      enum: ['iron-low', 'iron-medium', 'iron-high', 'do-not-iron', 'steam-only']
    },
    bleaching: {
      type: String,
      enum: ['bleach-safe', 'non-chlorine-bleach', 'do-not-bleach']
    }
  },
  sizeChart: {
    type: String, // URL to size chart image or reference
  },
  modelInfo: {
    height: String, // e.g., "5'8\""
    chest: String,  // e.g., "34\""
    waist: String,  // e.g., "28\""
    hips: String,   // e.g., "36\""
    wearingSize: String // e.g., "M"
  },
  variants: [{
    name: String, // e.g., "Color", "Size"
    value: String, // e.g., "Red", "Large"
    price: Number,
    stock: Number,
    sku: String
  }],
  specifications: [{
    name: String,
    value: String
  }],
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'inch'],
      default: 'cm'
    }
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must can not be more than 5'],
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create product slug from name
productSchema.virtual('slug').get(function() {
  return this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
});

// Calculate discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Check if product is in stock
productSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Check if product is low stock
productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.lowStockThreshold && this.stock > 0;
});

// Get available sizes with stock
productSchema.virtual('availableSizes').get(function() {
  return this.sizes.filter(size => size.stock > 0).map(size => size.size);
});

// Get available colors with stock
productSchema.virtual('availableColors').get(function() {
  return this.colors.filter(color => color.stock > 0).map(color => ({
    name: color.name,
    hexCode: color.hexCode
  }));
});

// Get total stock across all sizes and colors
productSchema.virtual('totalStock').get(function() {
  const sizeStock = this.sizes.reduce((total, size) => total + size.stock, 0);
  const colorStock = this.colors.reduce((total, color) => total + color.stock, 0);
  return Math.max(sizeStock, colorStock, this.stock);
});

// Check if specific size is available
productSchema.methods.isSizeAvailable = function(size) {
  const sizeItem = this.sizes.find(s => s.size === size);
  return sizeItem && sizeItem.stock > 0;
};

// Check if specific color is available
productSchema.methods.isColorAvailable = function(colorName) {
  const colorItem = this.colors.find(c => c.name === colorName);
  return colorItem && colorItem.stock > 0;
};

// Get stock for specific size
productSchema.methods.getSizeStock = function(size) {
  const sizeItem = this.sizes.find(s => s.size === size);
  return sizeItem ? sizeItem.stock : 0;
};

// Get stock for specific color
productSchema.methods.getColorStock = function(colorName) {
  const colorItem = this.colors.find(c => c.name === colorName);
  return colorItem ? colorItem.stock : 0;
};

// Calculate average rating when reviews are added
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
  } else {
    const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.numReviews = this.reviews.length;
  }
};

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1 });

// Garment-specific indexes
productSchema.index({ gender: 1 });
productSchema.index({ 'material.primary': 1 });
productSchema.index({ fit: 1 });
productSchema.index({ season: 1 });
productSchema.index({ ageGroup: 1 });
productSchema.index({ 'sizes.size': 1 });
productSchema.index({ 'colors.name': 1 });
productSchema.index({ occasion: 1 });
productSchema.index({ category: 1, gender: 1 });
productSchema.index({ subcategory: 1, gender: 1 });
productSchema.index({ price: 1, gender: 1 });
productSchema.index({ 'material.primary': 1, category: 1 });

export default mongoose.model('Product', productSchema);