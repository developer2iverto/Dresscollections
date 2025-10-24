import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Truck, 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  User,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Download,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  X
} from 'lucide-react';

const CMSOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const imageFallback = 'https://via.placeholder.com/48?text=%20';

  // Mock orders data
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.johnson@email.com',
      customerPhone: '+1 (555) 123-4567',
      orderDate: '2024-01-18',
      orderTime: '14:30',
      status: 'Processing',
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      totalAmount: 299.97,
      shippingAddress: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      items: [
        { id: 1, name: 'Summer Dress', quantity: 2, price: 89.99, image: '/api/placeholder/40/40' },
        { id: 2, name: 'Designer Handbag', quantity: 1, price: 119.99, image: '/api/placeholder/40/40' }
      ],
      shippingCost: 9.99,
      tax: 24.00,
      discount: 0,
      trackingNumber: null,
      estimatedDelivery: '2024-01-25'
    },
    {
      id: 'ORD-002',
      customerName: 'Michael Chen',
      customerEmail: 'michael.chen@email.com',
      customerPhone: '+1 (555) 987-6543',
      orderDate: '2024-01-17',
      orderTime: '09:15',
      status: 'Shipped',
      paymentStatus: 'Paid',
      paymentMethod: 'PayPal',
      totalAmount: 459.98,
      shippingAddress: {
        street: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      },
      items: [
        { id: 3, name: 'Casual Sneakers', quantity: 1, price: 129.99, image: '/api/placeholder/40/40' },
        { id: 4, name: 'Luxury Watch', quantity: 1, price: 329.99, image: '/api/placeholder/40/40' }
      ],
      shippingCost: 15.99,
      tax: 36.80,
      discount: 50.00,
      trackingNumber: 'TRK123456789',
      estimatedDelivery: '2024-01-22'
    },
    {
      id: 'ORD-003',
      customerName: 'Emily Rodriguez',
      customerEmail: 'emily.rodriguez@email.com',
      customerPhone: '+1 (555) 456-7890',
      orderDate: '2024-01-16',
      orderTime: '16:45',
      status: 'Delivered',
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      totalAmount: 189.99,
      shippingAddress: {
        street: '789 Pine Street',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA'
      },
      items: [
        { id: 5, name: 'Winter Jacket', quantity: 1, price: 179.99, image: '/api/placeholder/40/40' }
      ],
      shippingCost: 10.00,
      tax: 14.40,
      discount: 15.00,
      trackingNumber: 'TRK987654321',
      estimatedDelivery: '2024-01-20'
    },
    {
      id: 'ORD-004',
      customerName: 'David Wilson',
      customerEmail: 'david.wilson@email.com',
      customerPhone: '+1 (555) 321-0987',
      orderDate: '2024-01-15',
      orderTime: '11:20',
      status: 'Cancelled',
      paymentStatus: 'Refunded',
      paymentMethod: 'Credit Card',
      totalAmount: 0,
      shippingAddress: {
        street: '321 Elm Street',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        country: 'USA'
      },
      items: [
        { id: 6, name: 'Sports Shoes', quantity: 2, price: 99.99, image: '/api/placeholder/40/40' }
      ],
      shippingCost: 0,
      tax: 0,
      discount: 0,
      trackingNumber: null,
      estimatedDelivery: null
    }
  ]);

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const timeframes = ['All', 'Today', 'This Week', 'This Month', 'Last 30 Days'];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Processing': return <Package className="h-4 w-4" />;
      case 'Shipped': return <Truck className="h-4 w-4" />;
      case 'Delivered': return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotalRevenue = () => {
    return orders
      .filter(order => order.paymentStatus === 'Paid')
      .reduce((total, order) => total + order.totalAmount, 0);
  };

  const getOrdersCount = (status: string) => {
    return orders.filter(order => order.status === status).length;
  };

  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;

    const [newStatus, setNewStatus] = useState(selectedOrder.status);
    const [isEditing, setIsEditing] = useState(false);
    const [draftOrder, setDraftOrder] = useState({ ...selectedOrder });

    useEffect(() => {
      // Reset draft when switching orders
      setDraftOrder({ ...selectedOrder });
      setIsEditing(false);
      setNewStatus(selectedOrder.status);
    }, [selectedOrder]);

    const recalcTotal = (o: any) => {
      const itemsTotal = (o.items || []).reduce((sum: number, it: any) => sum + (it.price || 0) * (it.quantity || 0), 0);
      return parseFloat((itemsTotal + (o.shippingCost || 0) + (o.tax || 0) - (o.discount || 0)).toFixed(2));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <p className="text-gray-600 mt-1">Order ID: {selectedOrder.id}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
                  onClick={() => setIsEditing(v => !v)}
                >
                  {isEditing ? 'Viewing' : 'Edit'}
                </button>
                <button 
                  onClick={() => {
                    setShowOrderDetails(false);
                    setSelectedOrder(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Status and Actions */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedOrder.status)}
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  onClick={() => {
                    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                  }}
                >
                  Update Status
                </button>
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Customer Information</span>
                </h3>
                <div className="space-y-2">
                  {isEditing ? (
                    <>
                      <label className="text-sm block">
                        <span className="font-medium">Name:</span>
                        <input className="mt-1 w-full border rounded-lg px-3 py-2" value={draftOrder.customerName}
                          onChange={(e) => setDraftOrder({ ...draftOrder, customerName: e.target.value })} />
                      </label>
                      <label className="text-sm block">
                        <span className="font-medium flex items-center space-x-2"><Mail className="h-4 w-4" /><span>Email</span></span>
                        <input className="mt-1 w-full border rounded-lg px-3 py-2" value={draftOrder.customerEmail}
                          onChange={(e) => setDraftOrder({ ...draftOrder, customerEmail: e.target.value })} />
                      </label>
                      <label className="text-sm block">
                        <span className="font-medium flex items-center space-x-2"><Phone className="h-4 w-4" /><span>Phone</span></span>
                        <input className="mt-1 w-full border rounded-lg px-3 py-2" value={draftOrder.customerPhone}
                          onChange={(e) => setDraftOrder({ ...draftOrder, customerPhone: e.target.value })} />
                      </label>
                    </>
                  ) : (
                    <>
                      <p className="text-sm"><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                      <p className="text-sm flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{selectedOrder.customerEmail}</span>
                      </p>
                      <p className="text-sm flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{selectedOrder.customerPhone}</span>
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Shipping Address</span>
                </h3>
                <div className="text-sm text-gray-700 space-y-2">
                  {isEditing ? (
                    <>
                      <input className="w-full border rounded-lg px-3 py-2" placeholder="Street"
                        value={draftOrder.shippingAddress.street}
                        onChange={(e) => setDraftOrder({ ...draftOrder, shippingAddress: { ...draftOrder.shippingAddress, street: e.target.value } })} />
                      <div className="grid grid-cols-3 gap-2">
                        <input className="border rounded-lg px-3 py-2" placeholder="City" value={draftOrder.shippingAddress.city}
                          onChange={(e) => setDraftOrder({ ...draftOrder, shippingAddress: { ...draftOrder.shippingAddress, city: e.target.value } })} />
                        <input className="border rounded-lg px-3 py-2" placeholder="State" value={draftOrder.shippingAddress.state}
                          onChange={(e) => setDraftOrder({ ...draftOrder, shippingAddress: { ...draftOrder.shippingAddress, state: e.target.value } })} />
                        <input className="border rounded-lg px-3 py-2" placeholder="Zip" value={draftOrder.shippingAddress.zipCode}
                          onChange={(e) => setDraftOrder({ ...draftOrder, shippingAddress: { ...draftOrder.shippingAddress, zipCode: e.target.value } })} />
                      </div>
                      <input className="w-full border rounded-lg px-3 py-2" placeholder="Country" value={draftOrder.shippingAddress.country}
                        onChange={(e) => setDraftOrder({ ...draftOrder, shippingAddress: { ...draftOrder.shippingAddress, country: e.target.value } })} />
                    </>
                  ) : (
                    <>
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Order Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Order Date</p>
                  <p className="font-medium">{selectedOrder.orderDate} at {selectedOrder.orderTime}</p>
                </div>
                <div>
                  <p className="text-gray-600">Payment Method</p>
                  {isEditing ? (
                    <input className="mt-1 w-full border rounded-lg px-3 py-2" value={draftOrder.paymentMethod}
                      onChange={(e) => setDraftOrder({ ...draftOrder, paymentMethod: e.target.value })} />
                  ) : (
                    <p className="font-medium">{selectedOrder.paymentMethod}</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-600">Estimated Delivery</p>
                  {isEditing ? (
                    <input className="mt-1 w-full border rounded-lg px-3 py-2" value={draftOrder.estimatedDelivery || ''}
                      onChange={(e) => setDraftOrder({ ...draftOrder, estimatedDelivery: e.target.value })} />
                  ) : (
                    <p className="font-medium">{selectedOrder.estimatedDelivery || 'N/A'}</p>
                  )}
                </div>
                {selectedOrder.trackingNumber && (
                  <div className="md:col-span-3">
                    <p className="text-gray-600">Tracking Number</p>
                    {isEditing ? (
                      <input className="mt-1 w-full border rounded-lg px-3 py-2" value={draftOrder.trackingNumber || ''}
                        onChange={(e) => setDraftOrder({ ...draftOrder, trackingNumber: e.target.value })} />
                    ) : (
                      <p className="font-medium text-blue-600">{selectedOrder.trackingNumber}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-3">
                {(isEditing ? draftOrder.items : selectedOrder.items).map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.image || imageFallback} 
                        alt={item.name}
                        className="h-12 w-12 rounded-lg object-cover"
                        loading="lazy"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = imageFallback; }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {isEditing ? (
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-600">Quantity:</span>
                            <input type="number" min={0} className="border rounded px-2 py-1 w-20"
                              value={item.quantity}
                              onChange={(e) => {
                                const qty = Math.max(0, Number(e.target.value));
                                const nextItems = [...draftOrder.items];
                                nextItems[index] = { ...nextItems[index], quantity: qty };
                                setDraftOrder({ ...draftOrder, items: nextItems });
                              }}
                            />
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">${item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${(recalcTotal(isEditing ? draftOrder : selectedOrder) - (isEditing ? draftOrder.shippingCost : selectedOrder.shippingCost) - (isEditing ? draftOrder.tax : selectedOrder.tax) + (isEditing ? draftOrder.discount : selectedOrder.discount)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping:</span>
                  {isEditing ? (
                    <input type="number" className="border rounded px-2 py-1 w-24 text-right" value={draftOrder.shippingCost}
                      onChange={(e) => setDraftOrder({ ...draftOrder, shippingCost: Number(e.target.value) })} />
                  ) : (
                    <span>${selectedOrder.shippingCost.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span>Tax:</span>
                  {isEditing ? (
                    <input type="number" className="border rounded px-2 py-1 w-24 text-right" value={draftOrder.tax}
                      onChange={(e) => setDraftOrder({ ...draftOrder, tax: Number(e.target.value) })} />
                  ) : (
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span>Discount:</span>
                  {isEditing ? (
                    <input type="number" className="border rounded px-2 py-1 w-24 text-right" value={draftOrder.discount}
                      onChange={(e) => setDraftOrder({ ...draftOrder, discount: Number(e.target.value) })} />
                  ) : (
                    <span className="text-green-600">${selectedOrder.discount.toFixed(2)}</span>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-medium text-lg">
                  <span>Total:</span>
                  <span>${(isEditing ? recalcTotal(draftOrder) : selectedOrder.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-2">
              {isEditing ? (
                <>
                  <button className="px-4 py-2 rounded-lg bg-gray-100" onClick={() => { setDraftOrder({ ...selectedOrder }); setIsEditing(false); }}>
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-green-600 text-white"
                    onClick={() => {
                      const total = recalcTotal(draftOrder);
                      const updated = { ...draftOrder, status: newStatus, totalAmount: total };
                      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? updated : o));
                      setSelectedOrder(updated);
                      setIsEditing(false);
                    }}
                  >
                    Save Changes
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-1">Track and manage customer orders and fulfillment.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-yellow-600">{getOrdersCount('Processing')}</p>
            </div>
            <Package className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shipped</p>
              <p className="text-2xl font-bold text-purple-600">{getOrdersCount('Shipped')}</p>
            </div>
            <Truck className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{getOrdersCount('Delivered')}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-green-600">${calculateTotalRevenue().toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
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
              placeholder="Search orders..."
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

          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {timeframes.map(timeframe => (
              <option key={timeframe} value={timeframe.toLowerCase()}>{timeframe}</option>
            ))}
          </select>

          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    {order.trackingNumber && (
                      <div className="text-xs text-blue-600">{order.trackingNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.orderDate}</div>
                    <div className="text-sm text-gray-500">{order.orderTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items.reduce((total, item) => total + item.quantity, 0)} units
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${order.totalAmount.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetails(true);
                        }}
                        title="Edit order"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {order.status === 'Processing' && (
                        <button className="text-purple-600 hover:text-purple-900">
                          <Truck className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && <OrderDetailsModal />}
    </div>
  );
};

export default CMSOrders;