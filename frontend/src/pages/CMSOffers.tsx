import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Clock, 
  Calendar, 
  Tag, 
  Percent, 
  DollarSign,
  Eye,
  AlertTriangle,
  Save,
  X,
  Package,
  Timer,
  TrendingUp
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useLocation } from 'react-router-dom';
import type { OfferInput } from '../context/ProductContext';

const CMSOffers = () => {
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [previewOffer, setPreviewOffer] = useState<OfferInput | null>(null);
  const { products, applyOfferToAll, resetAllOffers } = useProducts();
  const location = useLocation();
  const [notice, setNotice] = useState<string | null>(null);
  const [isApplyingId, setIsApplyingId] = useState<number | null>(null);

  // Mock offers data
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: 'Summer Sale 50% Off',
      description: 'Get 50% off on all summer collection items',
      type: 'Limited Time',
      discountType: 'percentage',
      discountValue: 50,
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      endTime: '23:59',
      status: 'Active',
      productsCount: 45,
      usageCount: 234,
      revenue: 12450,
      timeRemaining: '2 days 14 hours'
    },
    {
      id: 2,
      title: 'Buy 2 Get 1 Free',
      description: 'Purchase any 2 items and get the 3rd one free',
      type: 'Limited Days',
      discountType: 'buy_x_get_y',
      discountValue: 1,
      startDate: '2024-01-10',
      endDate: '2024-01-25',
      endTime: '23:59',
      status: 'Active',
      productsCount: 23,
      usageCount: 156,
      revenue: 8900,
      timeRemaining: '7 days 10 hours'
    },
    {
      id: 3,
      title: 'Flash Sale - Accessories',
      description: 'Limited time flash sale on accessories',
      type: 'Limited Hours',
      discountType: 'percentage',
      discountValue: 30,
      startDate: '2024-01-18',
      endDate: '2024-01-18',
      endTime: '18:00',
      status: 'Active',
      productsCount: 12,
      usageCount: 89,
      revenue: 3200,
      timeRemaining: '6 hours 23 minutes'
    },
    {
      id: 4,
      title: 'Winter Clearance',
      description: 'Clear out winter inventory with huge discounts',
      type: 'Limited Days',
      discountType: 'fixed',
      discountValue: 25,
      startDate: '2024-01-05',
      endDate: '2024-01-10',
      endTime: '23:59',
      status: 'Expired',
      productsCount: 67,
      usageCount: 445,
      revenue: 18750,
      timeRemaining: 'Expired'
    }
  ]);

  // Handle deep-links from Dashboard: create, preview, reset
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const create = params.get('create');
    const previewId = params.get('preview');
    const reset = params.get('reset');

    if (create === '1') {
      setShowCreateOffer(true);
    }

    if (previewId) {
      const idNum = Number(previewId);
      const found = offers.find(o => o.id === idNum);
      if (found) {
        setPreviewOffer({
          id: found.id,
          title: found.title,
          discountType: found.discountType as OfferInput['discountType'],
          discountValue: found.discountValue as number
        });
      }
    }

    if (reset === '1') {
      resetAllOffers();
    }
  }, [location.search, offers, resetAllOffers]);

  const offerTypes = ['All', 'Limited Time', 'Limited Days', 'Limited Hours'];
  const statuses = ['All', 'Active', 'Scheduled', 'Expired', 'Draft'];
  const discountTypes = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'fixed', label: 'Fixed Amount ($)' },
    { value: 'buy_x_get_y', label: 'Buy X Get Y Free' }
  ];

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || offer.type.toLowerCase() === selectedType.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || offer.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleApply = async (offer: OfferInput) => {
    try {
      setIsApplyingId(Number(offer.id) || null);
      applyOfferToAll(offer);
      setNotice(`Applied offer "${offer.title ?? 'Promotion'}" to all products.`);
    } finally {
      setTimeout(() => setIsApplyingId(null), 300);
    }
  };

  const handleReset = () => {
    resetAllOffers();
    setNotice('Reset all active offers and restored original prices.');
  };

  const computeDiscountedPrice = (price: number, offer: OfferInput) => {
    if (offer.discountType === 'percentage') {
      return Math.max(0, Math.round(price * (1 - offer.discountValue / 100)));
    }
    if (offer.discountType === 'fixed') {
      return Math.max(0, Math.round(price - offer.discountValue));
    }
    return price; // buy_x_get_y keeps unit price
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Limited Time': return <Timer className="h-4 w-4" />;
      case 'Limited Days': return <Calendar className="h-4 w-4" />;
      case 'Limited Hours': return <Clock className="h-4 w-4" />;
      default: return <Tag className="h-4 w-4" />;
    }
  };

  const CreateOfferModal = () => {
    const [offerData, setOfferData] = useState({
      title: '',
      description: '',
      type: 'Limited Time',
      discountType: 'percentage',
      discountValue: '',
      buyQuantity: '',
      getQuantity: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      selectedProducts: [],
      minOrderValue: '',
      maxUsage: '',
      userLimit: ''
    });

    const [selectedProducts, setSelectedProducts] = useState([]);

    // Mock products for selection
    const availableProducts = [
      { id: 1, name: 'Summer Dress', price: 89.99, category: 'Clothing' },
      { id: 2, name: 'Designer Handbag', price: 299.99, category: 'Accessories' },
      { id: 3, name: 'Casual Sneakers', price: 129.99, category: 'Shoes' },
      { id: 4, name: 'Luxury Watch', price: 599.99, category: 'Accessories' }
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Create New Offer</h2>
              <button 
                onClick={() => setShowCreateOffer(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Title *
                </label>
                <input
                  type="text"
                  value={offerData.title}
                  onChange={(e) => setOfferData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter offer title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={offerData.description}
                  onChange={(e) => setOfferData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter offer description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Type *
                </label>
                <select
                  value={offerData.type}
                  onChange={(e) => setOfferData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Limited Time">Limited Time</option>
                  <option value="Limited Days">Limited Days</option>
                  <option value="Limited Hours">Limited Hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type *
                </label>
                <select
                  value={offerData.discountType}
                  onChange={(e) => setOfferData(prev => ({ ...prev, discountType: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {discountTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Discount Configuration */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Discount Configuration</h3>
              
              {offerData.discountType === 'buy_x_get_y' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buy Quantity *
                    </label>
                    <input
                      type="number"
                      value={offerData.buyQuantity}
                      onChange={(e) => setOfferData(prev => ({ ...prev, buyQuantity: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Get Quantity Free *
                    </label>
                    <input
                      type="number"
                      value={offerData.getQuantity}
                      onChange={(e) => setOfferData(prev => ({ ...prev, getQuantity: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 1"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value *
                  </label>
                  <div className="relative">
                    {offerData.discountType === 'percentage' ? (
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    ) : (
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    )}
                    <input
                      type="number"
                      value={offerData.discountValue}
                      onChange={(e) => setOfferData(prev => ({ ...prev, discountValue: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={offerData.discountType === 'percentage' ? 'e.g., 25' : 'e.g., 10.00'}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Time Configuration */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Time Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={offerData.startDate}
                    onChange={(e) => setOfferData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={offerData.startTime}
                    onChange={(e) => setOfferData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={offerData.endDate}
                    onChange={(e) => setOfferData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={offerData.endTime}
                    onChange={(e) => setOfferData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Product Selection */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Applicable Products</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="all-products"
                    name="product-selection"
                    className="text-blue-600"
                  />
                  <label htmlFor="all-products" className="text-sm text-gray-700">
                    Apply to all products
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="specific-products"
                    name="product-selection"
                    className="text-blue-600"
                    defaultChecked
                  />
                  <label htmlFor="specific-products" className="text-sm text-gray-700">
                    Select specific products
                  </label>
                </div>
              </div>

              <div className="mt-4 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                {availableProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="text-blue-600"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.category} • ${product.price}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage Limits */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Limits</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Order Value
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      value={offerData.minOrderValue}
                      onChange={(e) => setOfferData(prev => ({ ...prev, minOrderValue: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Usage Count
                  </label>
                  <input
                    type="number"
                    value={offerData.maxUsage}
                    onChange={(e) => setOfferData(prev => ({ ...prev, maxUsage: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Unlimited"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Per User
                  </label>
                  <input
                    type="number"
                    value={offerData.userLimit}
                    onChange={(e) => setOfferData(prev => ({ ...prev, userLimit: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Unlimited"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setShowCreateOffer(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Save as Draft
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Create Offer</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {notice && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {notice}
        </div>
      )}
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offers Management</h1>
          <p className="text-gray-600 mt-1">Create and manage limited time promotions and discounts.</p>
        </div>
        <button
          onClick={() => setShowCreateOffer(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Offer</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Offers</p>
              <p className="text-2xl font-bold text-green-600">12</p>
            </div>
            <Tag className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-600">$43,300</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usage</p>
              <p className="text-2xl font-bold text-purple-600">924</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600">3</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search offers..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {offerTypes.map(type => (
              <option key={type} value={type.toLowerCase()}>{type}</option>
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

          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Offer Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                      <div className="text-sm text-gray-500">{offer.description}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {offer.productsCount} products
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(offer.type)}
                      <span className="text-sm text-gray-900">{offer.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {offer.discountType === 'percentage' && `${offer.discountValue}%`}
                    {offer.discountType === 'fixed' && `$${offer.discountValue}`}
                    {offer.discountType === 'buy_x_get_y' && `Buy 2 Get ${offer.discountValue} Free`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{offer.timeRemaining}</div>
                    {offer.status === 'Active' && offer.timeRemaining !== 'Expired' && (
                      <div className="text-xs text-gray-500">
                        Ends {offer.endDate} at {offer.endTime}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {offer.usageCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${offer.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(offer.status)}`}>
                      {offer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => setPreviewOffer({
                          id: offer.id,
                          title: offer.title,
                          discountType: offer.discountType as OfferInput['discountType'],
                          discountValue: offer.discountValue as number
                        })}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className={`text-green-600 hover:text-green-900 ${isApplyingId === offer.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isApplyingId === offer.id}
                        onClick={() => handleApply({
                          id: offer.id,
                          title: offer.title,
                          discountType: offer.discountType as OfferInput['discountType'],
                          discountValue: offer.discountValue as number
                        })}
                      >
                        Apply
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        onClick={handleReset}
                      >
                        Reset
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => setOffers(prev => prev.filter(o => o.id !== offer.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {previewOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preview: {previewOffer.title}</h3>
              <button className="text-gray-500" onClick={() => setPreviewOffer(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {products.slice(0, 10).map(p => (
                <div key={p._id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.brand} • {p.category}</div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500 mr-2 line-through">${p.price}</span>
                    <span className="text-green-600 font-semibold">${computeDiscountedPrice(p.price, previewOffer)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
              <button className="px-4 py-2 rounded-lg bg-gray-100" onClick={() => setPreviewOffer(null)}>Close</button>
              <button
                className="px-4 py-2 rounded-lg bg-green-600 text-white"
                onClick={() => {
                  applyOfferToAll(previewOffer);
                  setPreviewOffer(null);
                }}
              >Apply Offer</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Offer Modal */}
      {showCreateOffer && <CreateOfferModal />}
    </div>
  );
};

export default CMSOffers;