import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Package, 
  DollarSign, 
  Palette, 
  Ruler, 
  Tag,
  Eye,
  Star,
  AlertTriangle,
  Save,
  X
} from 'lucide-react';

// Mock ProductContext for demonstration
const useProducts = () => {
  const [products, setProducts] = useState([
    {
      _id: '1',
      name: 'Classic Cotton T-Shirt',
      brand: 'StyleHub',
      category: 't-shirts',
      mainCategory: 'mens-wear',
      gender: 'men',
      price: 29.99,
      originalPrice: 39.99,
      description: 'Comfortable cotton t-shirt perfect for everyday wear',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Navy'],
      stock: 50,
      images: [],
      rating: 4.5,
      reviews: 120,
      isActive: true,
      isOnSale: false,
      isFinalSale: false
    }
  ]);

  const addProduct = (product) => {
    const newProduct = { ...product, _id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(prev => prev.map(p => p._id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  return { products, addProduct, updateProduct, deleteProduct, loading: false, error: null };
};

const CMSProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct, loading, error } = useProducts();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showViewProduct, setShowViewProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Inline row editing state
  const [editingProductId, setEditingProductId] = useState(null);
  const [rowEditData, setRowEditData] = useState(null);

  const brands = ['StyleHub', 'LuxeBrand', 'ComfortWalk', 'TrendyFashion'];
  const statuses = ['All', 'Active', 'Low Stock', 'Out of Stock', 'Draft'];
  const categories = ['All Categories', 'T-Shirts', 'Shirts', 'Jeans', 'Pants', 'Jackets', 'Sweaters', 'Dresses', 'Blouses', 'Skirts', 'Tops', 'Bottoms', 'Shorts'];

  // Function to determine product status based on stock
  const getProductStatus = (product) => {
    if (product.stock === 0) return 'Out of Stock';
    if (product.stock <= 10) return 'Low Stock';
    return 'Active';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    const productStatus = getProductStatus(product);
    const matchesStatus = selectedStatus === 'all' || productStatus.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Image utilities: generate stable image per product name
  const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const keywordFromName = (name, category) => {
    const n = name.toLowerCase();
    if (n.includes('dress')) return 'dress';
    if (n.includes('t-shirt') || n.includes('tee')) return 'tshirt';
    if (n.includes('shirt')) return 'shirt';
    if (n.includes('jeans')) return 'jeans';
    if (n.includes('pants') || n.includes('trouser')) return 'pants';
    if (n.includes('jacket')) return 'jacket';
    if (n.includes('sweater') || n.includes('hoodie')) return 'sweater';
    if (n.includes('skirt')) return 'skirt';
    if (n.includes('shorts')) return 'shorts';
    if (n.includes('blouse') || n.includes('top')) return 'top';
    if (category) {
      const c = category.toLowerCase();
      if (c.includes('dress')) return 'dress';
      if (c.includes('t-shirt') || c.includes('tee')) return 'tshirt';
      if (c.includes('shirt')) return 'shirt';
      if (c.includes('jeans')) return 'jeans';
      if (c.includes('pants') || c.includes('trouser')) return 'pants';
      if (c.includes('jacket')) return 'jacket';
      if (c.includes('sweater') || c.includes('hoodie')) return 'sweater';
      if (c.includes('skirt')) return 'skirt';
      if (c.includes('shorts')) return 'shorts';
      if (c.includes('blouse') || c.includes('top')) return 'top';
    }
    return 'fashion';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const AddProductModal = () => {
    const [productData, setProductData] = useState({
      name: '',
      brand: '',
      category: '',
      price: '',
      originalPrice: '',
      description: '',
      sizes: [],
      colors: [],
      stock: '',
      images: []
    });

    const [newSize, setNewSize] = useState('');
    const [newColor, setNewColor] = useState('');

    const addSize = () => {
      if (newSize && !productData.sizes.includes(newSize)) {
        setProductData(prev => ({
          ...prev,
          sizes: [...prev.sizes, newSize]
        }));
        setNewSize('');
      }
    };

    const removeSize = (size) => {
      setProductData(prev => ({
        ...prev,
        sizes: prev.sizes.filter(s => s !== size)
      }));
    };

    const addColor = () => {
      if (newColor && !productData.colors.includes(newColor)) {
        setProductData(prev => ({
          ...prev,
          colors: [...prev.colors, newColor]
        }));
        setNewColor('');
      }
    };

    const removeColor = (color) => {
      setProductData(prev => ({
        ...prev,
        colors: prev.colors.filter(c => c !== color)
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Validate required fields
      if (!productData.name || !productData.brand || !productData.category || !productData.price) {
        alert('Please fill in all required fields');
        return;
      }

      // Map subcategory to main category for catalog visibility
      const categoryToMainCategory = {
        't-shirts': 'mens-wear',
        'shirts': 'mens-wear',
        'jeans': 'mens-wear',
        'pants': 'mens-wear',
        'jackets': 'mens-wear',
        'sweaters': 'mens-wear',
        'dresses': 'womens-wear',
        'blouses': 'womens-wear',
        'skirts': 'womens-wear',
        'tops': 'womens-wear',
        'bottoms': 'womens-wear',
        'shorts': 'kids-wear'
      };
      const normalizedCategory = (productData.category || '').toLowerCase();
      const mainCategory = categoryToMainCategory[normalizedCategory] || 'womens-wear';

      const ensureArray = (arr) => Array.isArray(arr) ? arr : [];
      const commonSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      const defaultColors = ['Black', 'White', 'Navy'];

      // Create new product object
      const newProduct = {
        name: productData.name,
        brand: productData.brand,
        category: productData.category,
        mainCategory,
        gender: mainCategory === 'mens-wear' ? 'men' : (mainCategory === 'womens-wear' ? 'women' : ''),
        price: parseFloat(productData.price),
        originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : parseFloat(productData.price),
        description: productData.description,
        sizes: ensureArray(productData.sizes).length > 0 ? productData.sizes : commonSizes,
        colors: ensureArray(productData.colors).length > 0 ? productData.colors : defaultColors,
        stock: productData.stock ? parseInt(productData.stock) : 0,
        images: productData.images.length > 0 ? productData.images : [],
        rating: 0,
        reviews: 0,
        isActive: true,
        isOnSale: false,
        isFinalSale: false
      };

      addProduct(newProduct);
      
      // Reset form and close modal
      setProductData({
        name: '',
        brand: '',
        category: '',
        price: '',
        originalPrice: '',
        description: '',
        sizes: [],
        colors: [],
        stock: '',
        images: []
      });
      setShowAddProduct(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
              <button 
                onClick={() => setShowAddProduct(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <select
                  value={productData.brand}
                  onChange={(e) => setProductData(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={productData.category}
                  onChange={(e) => setProductData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  value={productData.stock}
                  onChange={(e) => setProductData(prev => ({ ...prev, stock: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter stock quantity"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={productData.price}
                    onChange={(e) => setProductData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={productData.originalPrice}
                    onChange={(e) => setProductData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Sizes
              </label>
              <div className="flex items-center space-x-2 mb-3">
                <div className="relative flex-1">
                  <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add size (e.g., S, M, L, XL)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                  />
                </div>
                <button
                  type="button"
                  onClick={addSize}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {productData.sizes.map(size => (
                  <span
                    key={size}
                    className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => removeSize(size)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Colors
              </label>
              <div className="flex items-center space-x-2 mb-3">
                <div className="relative flex-1">
                  <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add color (e.g., Red, Blue, Black)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                  />
                </div>
                <button
                  type="button"
                  onClick={addColor}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {productData.colors.map(color => (
                  <span
                    key={color}
                    className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {color}
                    <button
                      type="button"
                      onClick={() => removeColor(color)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Description
              </label>
              <textarea
                value={productData.description}
                onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product description..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Upload Images
                  </button>
                  <p className="mt-2 text-sm text-gray-500">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowAddProduct(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Product</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Inline editing helpers
  const startRowEdit = (product) => {
    setEditingProductId(product._id);
    setRowEditData({
      name: product.name || '',
      brand: product.brand || '',
      category: product.category || product.mainCategory || '',
      price: product.price || 0,
      originalPrice: product.originalPrice ?? product.price ?? 0,
      stock: product.stock ?? 0,
      images: product.images && product.images.length > 0 ? [...product.images] : [],
    });
  };

  const cancelRowEdit = () => {
    setEditingProductId(null);
    setRowEditData(null);
  };

  const saveRowEdit = () => {
    if (!editingProductId || !rowEditData) return;
    const existing = products.find(p => p._id === editingProductId) || {};
    const updatedProduct = {
      ...existing,
      name: rowEditData.name,
      brand: rowEditData.brand,
      category: rowEditData.category,
      price: parseFloat(rowEditData.price),
      originalPrice: parseFloat(rowEditData.originalPrice),
      stock: parseInt(rowEditData.stock),
      images: rowEditData.images && rowEditData.images.length > 0 ? rowEditData.images : [],
    };
    updateProduct(editingProductId, updatedProduct);
    cancelRowEdit();
  };

  const handleImageUrlChange = (url) => {
    setRowEditData((prev) => {
      const imgs = prev?.images ? [...prev.images] : [];
      if (imgs.length === 0) imgs.push(url);
      else imgs[0] = url;
      return { ...prev, images: imgs };
    });
  };

  const handleImageFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setRowEditData((prev) => {
        const imgs = prev?.images ? [...prev.images] : [];
        if (imgs.length === 0) imgs.push(dataUrl);
        else imgs[0] = dataUrl;
        return { ...prev, images: imgs };
      });
    };
    reader.readAsDataURL(file);
  };

  // View Product Modal
  const ViewProductModal = () => {
    if (!showViewProduct || !selectedProduct) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
              <button 
                onClick={() => setShowViewProduct(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Product Image */}
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <img 
                    src={selectedProduct.images[0]} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <ImageIcon className="h-16 w-16 text-gray-400" />
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <p className="text-gray-900 font-semibold">{selectedProduct.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <p className="text-gray-900">{selectedProduct.brand || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <p className="text-gray-900">{selectedProduct.category || selectedProduct.mainCategory || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <p className="text-gray-900 font-semibold">${selectedProduct.price}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                <p className="text-gray-900">${selectedProduct.originalPrice || selectedProduct.price}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                <p className="text-gray-900">{selectedProduct.stock}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <p className="text-gray-900">{selectedProduct.description || 'No description available'}</p>
            </div>

            {/* Sizes and Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes && selectedProduct.sizes.length > 0 ? (
                    selectedProduct.sizes.map((size, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {size}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No sizes specified</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors && selectedProduct.colors.length > 0 ? (
                    selectedProduct.colors.map((color, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {color}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No colors specified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-gray-900">{selectedProduct.rating || 0}/5</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reviews</label>
                <p className="text-gray-900">{selectedProduct.reviews || 0} reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog, inventory, and pricing.</p>
        </div>
        <button
          onClick={() => setShowAddProduct(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">
                {products.filter(p => (p.stock || 0) <= 10 && (p.stock || 0) > 0).length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {products.filter(p => (p.stock || 0) === 0).length}
              </p>
            </div>
            <Package className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
              <p className="text-2xl font-bold text-yellow-600">
                {products.length > 0 
                  ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status} value={status.toLowerCase()}>{status}</option>
            ))}
          </select>

          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 justify-center">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reviews
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const isEditing = editingProductId === product._id;
                return (
                  <tr key={product._id} className={isEditing ? "bg-blue-50" : "hover:bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {rowEditData?.images?.[0] ? (
                              <img 
                                src={rowEditData.images[0]} 
                                alt={rowEditData.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4 space-y-2">
                            <input
                              type="text"
                              value={rowEditData?.name || ''}
                              onChange={(e)=> setRowEditData((prev)=> ({...prev, name: e.target.value}))}
                              className="text-sm px-2 py-1 border border-gray-300 rounded-md w-56"
                              placeholder="Product name"
                            />
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={rowEditData?.images?.[0] || ''}
                                onChange={(e)=> handleImageUrlChange(e.target.value)}
                                className="text-xs px-2 py-1 border border-gray-300 rounded-md w-40"
                                placeholder="Image URL"
                              />
                              <label className="text-xs text-blue-600 cursor-pointer">
                                <input type="file" accept="image/*" className="hidden" onChange={(e)=> e.target.files && handleImageFile(e.target.files[0])} />
                                Upload
                              </label>
                              <button
                                type="button"
                                className="text-xs text-red-600"
                                onClick={() => setRowEditData((prev)=> ({...prev, images: []}))}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {product.images && product.images.length > 0 ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">
                              {product.sizes?.length || 0} sizes, {product.colors?.length || 0} colors
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={rowEditData?.brand || ''}
                          onChange={(e)=> setRowEditData((prev)=> ({...prev, brand: e.target.value}))}
                          className="px-2 py-1 border border-gray-300 rounded-md w-36"
                          placeholder="Brand"
                        />
                      ) : (
                        product.brand || 'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={rowEditData?.category || ''}
                          onChange={(e)=> setRowEditData((prev)=> ({...prev, category: e.target.value}))}
                          className="px-2 py-1 border border-gray-300 rounded-md w-40"
                          placeholder="Category"
                        />
                      ) : (
                        product.category || product.mainCategory || 'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isEditing ? (
                        <div className="flex flex-col space-y-1">
                          <input
                            type="number"
                            step="0.01"
                            value={rowEditData?.price ?? 0}
                            onChange={(e)=> setRowEditData((prev)=> ({...prev, price: e.target.value}))}
                            className="px-2 py-1 border border-gray-300 rounded-md w-28"
                            placeholder="Price"
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={rowEditData?.originalPrice ?? 0}
                            onChange={(e)=> setRowEditData((prev)=> ({...prev, originalPrice: e.target.value}))}
                            className="px-2 py-1 border border-gray-300 rounded-md w-28"
                            placeholder="Original"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-medium">${product.price}</span>
                          {product.originalPrice && product.originalPrice !== product.price && (
                            <span className="text-xs text-gray-500 line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isEditing ? (
                        <input
                          type="number"
                          value={rowEditData?.stock ?? 0}
                          onChange={(e)=> setRowEditData((prev)=> ({...prev, stock: e.target.value}))}
                          className="px-2 py-1 border border-gray-300 rounded-md w-20"
                          placeholder="Stock"
                        />
                      ) : (
                        product.stock || 0
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(getProductStatus(product))}`}>
                        {getProductStatus(product)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.reviews || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {isEditing ? (
                          <>
                            <button onClick={saveRowEdit} className="text-green-600 hover:text-green-900" title="Save">
                              <Save className="h-4 w-4" />
                            </button>
                            <button onClick={cancelRowEdit} className="text-gray-600 hover:text-gray-900" title="Cancel">
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowViewProduct(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => startRowEdit(product)}
                              className="text-green-600 hover:text-green-900"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this product?')) {
                                  deleteProduct(product._id);
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && <AddProductModal />}
      
      {/* View Product Modal */}
      {showViewProduct && <ViewProductModal />}
    </div>
  );
};

export default CMSProducts;