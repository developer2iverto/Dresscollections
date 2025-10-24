import React, { useMemo, useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Plus, 
  Minus,
  Edit,
  Eye,
  Download,
  Upload,
  BarChart3,
  RefreshCw,
  Archive,
  ShoppingCart,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Trash
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const CMSInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showStockUpdate, setShowStockUpdate] = useState(false);
  const [showViewProduct, setShowViewProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { products, loading, error, refreshProducts, getProduct, updateProduct, deleteProduct, addProduct } = useProducts();

  const FALLBACK_IMAGE = '';
  const DEFAULT_LOW_STOCK = 10;
  const isPlaceholderUrl = (u?: string) => /picsum\.photos|placehold\.co|via\.placeholder\.com|\/api\/placeholder\//i.test((u || '').trim())

  // Build inventory rows from real products
  const inventory = useMemo(() => {
    return (products || []).map(p => {
      const stock = p.stock ?? 0;
      const minStock = p.lowStockThreshold ?? DEFAULT_LOW_STOCK;
      const status = stock === 0 ? 'Out of Stock' : stock <= minStock ? 'Low Stock' : 'In Stock';
      const image = (p.images && p.images.length > 0 ? p.images[0] : FALLBACK_IMAGE);
      const costPrice = (p.originalPrice ?? Math.round(p.price * 0.6 * 100) / 100);
      return {
        id: p._id,
        name: p.name,
        sku: p.sku || '',
        category: p.category || p.mainCategory || 'General',
        brand: p.brand || '',
        price: p.price,
        costPrice,
        currentStock: stock,
        minStock,
        maxStock: Math.max(minStock * 6, stock + minStock),
        reserved: 0,
        available: stock,
        status,
        lastRestocked: p.updatedAt || p.createdAt || '',
        supplier: '',
        location: '',
        sizes: p.sizes || [],
        colors: p.colors || [],
        image
      } as any;
    });
  }, [products]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    (products || []).forEach(p => {
      if (p.category) set.add(p.category);
      if (p.mainCategory) set.add(p.mainCategory);
    });
    return ['All', ...Array.from(set)];
  }, [products]);
  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock', 'Discontinued'];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || item.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      case 'Discontinued': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Stock': return <CheckCircle className="h-4 w-4" />;
      case 'Low Stock': return <AlertTriangle className="h-4 w-4" />;
      case 'Out of Stock': return <XCircle className="h-4 w-4" />;
      case 'Discontinued': return <Archive className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const calculateInventoryValue = () => {
    return inventory.reduce((total, item) => total + (item.currentStock * (item.costPrice || 0)), 0);
  };

  const getLowStockCount = () => {
    return inventory.filter(item => item.currentStock <= item.minStock && item.currentStock > 0).length;
  };

  const getOutOfStockCount = () => {
    return inventory.filter(item => item.currentStock === 0).length;
  };

  const AddInventoryModal = () => {
    const categoryOptions: Record<string, string[]> = {
      'mens-wear': ['t-shirts','shirts','jeans','pants','jackets','sweaters'],
      'womens-wear': ['dresses','tops','skirts','jeans','outerwear','sweaters'],
      'kids-wear': ['t-shirts','shirts','shorts','jeans','outerwear','sweaters']
    };

    const [form, setForm] = useState({
      name: '',
      brand: '',
      mainCategory: 'mens-wear',
      category: 't-shirts',
      stock: '',
      sku: ''
    });

    const onSave = () => {
      if (!form.name) return;
      const priceNum = 0;
      const stockNum = Number(form.stock) || 0;

      addProduct({
        name: form.name,
        description: '',
        price: priceNum,
        originalPrice: null,
        images: [],
        category: form.category || '',
        mainCategory: form.mainCategory,
        brand: form.brand || 'StyleHub',
        rating: 0,
        reviews: 0,
        sizes: ['XS','S','M','L','XL'],
        colors: ['Black','White','Navy'],
        isOnSale: false,
        isFinalSale: false,
        stock: stockNum,
        sku: form.sku || ''
      });

      setShowAddProduct(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Add Inventory Item</h2>
            <p className="text-gray-600 mt-1">Create a new product entry</p>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Classic Cotton T-Shirt"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => setForm(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="StyleHub"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => setForm(prev => ({ ...prev, sku: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SH-TS-001"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Category</label>
                <select
                  value={form.mainCategory}
                  onChange={(e) => {
                    const nextMain = e.target.value;
                    const nextCat = categoryOptions[nextMain][0] || '';
                    setForm(prev => ({ ...prev, mainCategory: nextMain, category: nextCat }));
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="mens-wear">Men's Wear</option>
                  <option value="womens-wear">Women's Wear</option>
                  <option value="kids-wear">Kids' Wear</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categoryOptions[form.mainCategory].map(opt => (
                    <option key={opt} value={opt}>{opt.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm(prev => ({ ...prev, stock: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="25"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setShowAddProduct(false)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = () => {
    if (!selectedProduct) return null;
    const product = getProduct(selectedProduct.id);
    if (!product) return null;

    const onDelete = () => {
      deleteProduct(product._id);
      setShowDeleteConfirm(false);
      setSelectedProduct(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Delete Product</h2>
            <button onClick={() => { setShowDeleteConfirm(false); setSelectedProduct(null); }} className="text-gray-500 hover:text-gray-700">Close</button>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex items-center space-x-3">
              <Trash className="h-5 w-5 text-red-600" />
              <p className="text-gray-800">Are you sure you want to delete <span className="font-semibold">{product.name}</span>?</p>
            </div>
            <p className="text-sm text-gray-600">This action cannot be undone and will remove the product from inventory.</p>
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button onClick={() => { setShowDeleteConfirm(false); setSelectedProduct(null); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={onDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">Delete</button>
          </div>
        </div>
      </div>
    );
  };

  const ViewProductModal = () => {
    if (!selectedProduct) return null;
    const product = getProduct(selectedProduct.id);
    if (!product) return null;

    const img = (product.images && product.images[0]) || FALLBACK_IMAGE;
    const status = selectedProduct.status;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-xl w-full overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
            <button onClick={() => { setShowViewProduct(false); setSelectedProduct(null); }} className="text-gray-500 hover:text-gray-700">Close</button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start">
              {((product.images && product.images[0]) && !isPlaceholderUrl(product.images[0])) ? (
                <img src={product.images[0]} alt={product.name} className="h-16 w-16 rounded-lg object-cover mr-4" />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                  <Package className="h-8 w-8 text-gray-500" />
                </div>
              )}
              <div>
                <p className="text-lg font-semibold text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-600">{product.brand}</p>
                <p className="text-sm text-gray-600">SKU: {product.sku || '—'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Category</p>
                <p className="text-gray-900">{product.category || product.mainCategory}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="text-gray-900">{status}</p>
              </div>
              <div>
                <p className="text-gray-500">Price</p>
                <p className="text-gray-900">${product.price}</p>
              </div>
              <div>
                <p className="text-gray-500">Stock</p>
                <p className="text-gray-900">{product.stock ?? 0}</p>
              </div>
            </div>
            {product.description && (
              <div>
                <p className="text-gray-500 text-sm mb-1">Description</p>
                <p className="text-gray-800 text-sm">{product.description}</p>
              </div>
            )}
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-end">
            <button onClick={() => { setShowViewProduct(false); setSelectedProduct(null); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Close</button>
          </div>
        </div>
      </div>
    );
  };

  const EditProductModal = () => {
    if (!selectedProduct) return null;
    const product = getProduct(selectedProduct.id);
    if (!product) return null;

    const [form, setForm] = useState({
      name: product.name || '',
      brand: product.brand || '',
      category: product.category || product.mainCategory || '',
      price: product.price || 0,
      stock: product.stock ?? 0,
      sku: product.sku || ''
    });

    const onSave = () => {
      updateProduct(product._id, {
        name: form.name,
        brand: form.brand,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        sku: form.sku
      });
      setShowEditProduct(false);
      setSelectedProduct(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-xl w-full overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
            <button onClick={() => { setShowEditProduct(false); setSelectedProduct(null); }} className="text-gray-500 hover:text-gray-700">Close</button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Brand</label>
                <input value={form.brand} onChange={(e) => setForm(prev => ({...prev, brand: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Category</label>
                <input value={form.category} onChange={(e) => setForm(prev => ({...prev, category: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">SKU</label>
                <input value={form.sku} onChange={(e) => setForm(prev => ({...prev, sku: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Price</label>
                <input type="number" value={form.price} onChange={(e) => setForm(prev => ({...prev, price: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Stock</label>
                <input type="number" value={form.stock} onChange={(e) => setForm(prev => ({...prev, stock: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button onClick={() => { setShowEditProduct(false); setSelectedProduct(null); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={onSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Save Changes</button>
          </div>
        </div>
      </div>
    );
  };

  const StockUpdateModal = () => {
    const [updateData, setUpdateData] = useState({
      adjustment: '',
      reason: '',
      notes: '',
      type: 'add' // 'add' or 'remove'
    });

    if (!selectedProduct) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Update Stock</h2>
            <p className="text-gray-600 mt-1">{selectedProduct.name} (SKU: {selectedProduct.sku})</p>
            <p className="text-sm text-gray-500">Current Stock: {selectedProduct.currentStock}</p>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adjustment Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="add"
                    checked={updateData.type === 'add'}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, type: e.target.value }))}
                    className="text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Add Stock</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="remove"
                    checked={updateData.type === 'remove'}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, type: e.target.value }))}
                    className="text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remove Stock</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={updateData.adjustment}
                onChange={(e) => setUpdateData(prev => ({ ...prev, adjustment: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter quantity"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <select
                value={updateData.reason}
                onChange={(e) => setUpdateData(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select reason</option>
                <option value="restock">Restock</option>
                <option value="sale">Sale</option>
                <option value="damage">Damage</option>
                <option value="return">Return</option>
                <option value="adjustment">Inventory Adjustment</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={updateData.notes}
                onChange={(e) => setUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional notes..."
              />
            </div>

            {updateData.adjustment && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  New Stock Level: {updateData.type === 'add' 
                    ? selectedProduct.currentStock + parseInt(updateData.adjustment || '0')
                    : selectedProduct.currentStock - parseInt(updateData.adjustment || '0')
                  }
                </p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowStockUpdate(false);
                setSelectedProduct(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Update Stock
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
        <p className="mt-2 text-gray-600">Loading inventory from products…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
        <p className="mt-2 text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your product inventory and stock levels.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setShowAddProduct(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Inventory</span>
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-blue-600">{inventory.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-green-600">${calculateInventoryValue().toLocaleString()}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-yellow-600">{getLowStockCount()}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{getOutOfStockCount()}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {getLowStockCount() > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-medium text-yellow-800">Low Stock Alert</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {inventory.filter(item => item.currentStock <= item.minStock && item.currentStock > 0).map(item => (
              <div key={item.id} className="bg-white p-3 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Stock: {item.currentStock} / Min: {item.minStock}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedProduct(item);
                      setShowStockUpdate(true);
                    }}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors"
                  >
                    Restock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category.toLowerCase()}>{category}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status} value={status.toLowerCase()}>{status}</option>
            ))}
          </select>

          <button onClick={() => refreshProducts()} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Levels
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Restocked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.image && !isPlaceholderUrl(item.image) ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                          <Package className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                         <div className="text-sm font-medium text-gray-900">{item.name}</div>
                         <div className="text-sm text-gray-500">{item.brand}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Current: <span className="font-medium">{item.currentStock}</span></div>
                      <div className="text-xs text-gray-500">
                        Available: {item.available} | Reserved: {item.reserved}
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: {item.minStock} | Max: {item.maxStock}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">${item.price}</div>
                      <div className="text-xs text-gray-500">Cost: ${item.costPrice}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(item.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.lastRestocked}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button title="View product" onClick={() => { setSelectedProduct(item); setShowViewProduct(true); }} className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button title="Edit product" onClick={() => { setSelectedProduct(item); setShowEditProduct(true); }} className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedProduct(item);
                          setShowStockUpdate(true);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <button
                        title="Delete product"
                        onClick={() => { setSelectedProduct(item); setShowDeleteConfirm(true); }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Update Modal */}
      {showStockUpdate && <StockUpdateModal />}
      {showViewProduct && <ViewProductModal />}
      {showEditProduct && <EditProductModal />}
      {showDeleteConfirm && <DeleteConfirmModal />}
      {showAddProduct && <AddInventoryModal />}
    </div>
  );
};

export default CMSInventory;