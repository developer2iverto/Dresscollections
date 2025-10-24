import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { useProducts } from '../context/ProductContext';
import { Package, ShoppingBag, DollarSign, TrendingUp, Plus, Tag, Clock, AlertTriangle, Star, Eye, Calendar, FileText, Users, BarChart3, Archive, ShoppingCart, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminRoles } from '../data/adminRoles';

const CMSDashboard = () => {
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const { user } = useAuth();
  const [roleInfo, setRoleInfo] = useState<any>(null);

  useEffect(() => {
    if (user && user.role) {
      setRoleInfo(adminRoles[user.role]);
    }
  }, [user]);

  // Calculate real analytics from product data
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);
  const lowStockProducts = products.filter(product => (product.stock || 0) <= 10 && (product.stock || 0) > 0).length;
  const outOfStockProducts = products.filter(product => (product.stock || 0) === 0).length;
  const averagePrice = products.length > 0 ? products.reduce((sum, product) => sum + product.price, 0) / products.length : 0;

  // Category distribution from real data
  const categoryStats = products.reduce((acc, product) => {
    const category = product.mainCategory || 'Other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryStats).map(([name, value], index) => ({
    name: name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: value as number,
    color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'][index % 5]
  }));

  // Mock data for charts (would come from order/sales data in real app)
  const salesData = [
    { month: 'Jan', revenue: 45000, orders: 240, products: totalProducts },
    { month: 'Feb', revenue: 38000, orders: 198, products: totalProducts },
    { month: 'Mar', revenue: 52000, orders: 300, products: totalProducts },
    { month: 'Apr', revenue: 48000, orders: 278, products: totalProducts },
    { month: 'May', revenue: 65000, orders: 389, products: totalProducts },
    { month: 'Jun', revenue: 58000, orders: 349, products: totalProducts },
  ];

  // Recent products from real data
  const recentProducts = products.slice(0, 4).map(product => ({
    id: product._id,
    name: product.name,
    price: `$${product.price}`,
    stock: product.stock || 0,
    status: product.stock === 0 ? 'Out of Stock' : product.stock <= 10 ? 'Low Stock' : 'Active',
    sales: product.reviews || 0
  }));

  const activeOffers = [
    { id: 1, title: 'Summer Sale 50% Off', type: 'Limited Time', expires: '2 days', products: 45 },
    { id: 2, title: 'Buy 2 Get 1 Free', type: 'Limited Days', expires: '5 days', products: 23 },
    { id: 3, title: 'Flash Sale - Accessories', type: 'Limited Hours', expires: '6 hours', products: 12 },
  ];
  
  // Role-based quick actions
  const getQuickActions = () => {
    if (!user || !user.role) return [];
    
    const actions = [];
    
    // Product management actions - for product_admin and super_admin
    if (user.role === 'product_admin' || user.role === 'super_admin' || user.role === 'admin') {
      actions.push({
        title: 'Add New Product',
        description: 'Upload images, set prices & sizes',
        icon: Package,
        bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
        iconColor: 'text-blue-200',
        buttonColor: 'text-blue-600',
        buttonHoverColor: 'bg-blue-50',
        path: '/cms/products'
      });
      
      actions.push({
        title: 'Manage Inventory',
        description: 'Track stock & update quantities',
        icon: Archive,
        bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
        iconColor: 'text-green-200',
        buttonColor: 'text-green-600',
        buttonHoverColor: 'bg-green-50',
        path: '/cms/inventory'
      });
    }
    
    // Order management - for admin and super_admin
    if (user.role === 'admin' || user.role === 'super_admin') {
      actions.push({
        title: 'Manage Orders',
        description: 'Process and track customer orders',
        icon: ShoppingCart,
        bgColor: 'bg-gradient-to-r from-amber-500 to-amber-600',
        iconColor: 'text-amber-200',
        buttonColor: 'text-amber-600',
        buttonHoverColor: 'bg-amber-50',
        path: '/cms/orders'
      });
      
      actions.push({
        title: 'Create Offers',
        description: 'Set limited time promotions',
        icon: Tag,
        bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
        iconColor: 'text-purple-200',
        buttonColor: 'text-purple-600',
        buttonHoverColor: 'bg-purple-50',
        path: '/cms/offers?create=1'
      });
    }
    
    // User management - for super_admin only
    if (user.role === 'super_admin') {
      actions.push({
        title: 'Manage Users',
        description: 'Add, edit, or remove user accounts',
        icon: Users,
        bgColor: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
        iconColor: 'text-indigo-200',
        buttonColor: 'text-indigo-600',
        buttonHoverColor: 'bg-indigo-50',
        path: '/cms/users'
      });
      
      actions.push({
        title: 'System Settings',
        description: 'Configure system preferences',
        icon: Settings,
        bgColor: 'bg-gradient-to-r from-gray-500 to-gray-600',
        iconColor: 'text-gray-200',
        buttonColor: 'text-gray-600',
        buttonHoverColor: 'bg-gray-50',
        path: '/cms/settings'
      });
    }
    
    return actions;
  };

  const stats = [
    {
      name: 'Total Products',
      value: totalProducts.toString(),
      change: `${lowStockProducts} low stock`,
      changeType: lowStockProducts > 0 ? 'warning' : 'neutral',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Stock',
      value: totalStock.toString(),
      change: `${outOfStockProducts} out of stock`,
      changeType: outOfStockProducts > 0 ? 'warning' : 'increase',
      icon: ShoppingBag,
      color: 'bg-green-500'
    },
    {
      name: 'Average Price',
      value: `$${averagePrice.toFixed(2)}`,
      change: `Across ${totalProducts} products`,
      changeType: 'neutral',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      name: 'Categories',
      value: Object.keys(categoryStats).length.toString(),
      change: `${categoryData.length} active categories`,
      changeType: 'neutral',
      icon: Tag,
      color: 'bg-orange-500'
    }
  ]

  const recentPosts = [
    {
      id: 1,
      title: 'Getting Started with React 18',
      author: 'John Doe',
      status: 'Published',
      date: '2024-01-15',
      views: 1234
    },
    {
      id: 2,
      title: 'Advanced TypeScript Patterns',
      author: 'Jane Smith',
      status: 'Draft',
      date: '2024-01-14',
      views: 0
    },
    {
      id: 3,
      title: 'Building Modern Web Apps',
      author: 'Mike Johnson',
      status: 'Published',
      date: '2024-01-13',
      views: 856
    },
    {
      id: 4,
      title: 'CSS Grid vs Flexbox',
      author: 'Sarah Wilson',
      status: 'Review',
      date: '2024-01-12',
      views: 0
    }
  ]

  const recentActivity = [
    {
      id: 1,
      action: 'New post published',
      details: '"Getting Started with React 18" by John Doe',
      time: '2 hours ago',
      type: 'publish'
    },
    {
      id: 2,
      action: 'User registered',
      details: 'alice@example.com joined the platform',
      time: '4 hours ago',
      type: 'user'
    },
    {
      id: 3,
      action: 'Comment posted',
      details: 'New comment on "Advanced TypeScript Patterns"',
      time: '6 hours ago',
      type: 'comment'
    },
    {
      id: 4,
      action: 'Post updated',
      details: '"Building Modern Web Apps" was edited',
      time: '1 day ago',
      type: 'edit'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800'
      case 'Draft':
        return 'bg-gray-100 text-gray-800'
      case 'Review':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Handle loading, error, and login states
  if (loading) {
    return <div className="p-6 text-center">Loading dashboard data...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-center text-red-500">Error loading dashboard: {error}</div>;
  }
  
  if (!user) {
    return <div className="p-6 text-center">Please log in to access the dashboard</div>;
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header with role information */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, {user.name || user.email}! {roleInfo && (
                <span className="font-medium text-indigo-600">
                  You are logged in as {roleInfo.name}
                </span>
              )}
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Calendar className="h-4 w-4 mr-2" />
              Last 30 days
            </button>
          </div>
        </div>
        
        {/* Role permissions display */}
        {roleInfo && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Your Permissions</h3>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {roleInfo.permissions.map((permission, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-700">{permission}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`${stat.color} p-3 rounded-md`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </div>
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <TrendingUp className={`self-center flex-shrink-0 h-4 w-4 ${
                              stat.changeType === 'decrease' ? 'transform rotate-180' : ''
                            }`} />
                            <span className="ml-1">{stat.change}</span>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section - Only visible to admin and super_admin */}
        {(user.role === 'admin' || user.role === 'super_admin') && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue & Orders Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Revenue & Orders</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sales by Category Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Sales by Category</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Recent Products */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All Products
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales
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
                {recentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.sales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : product.status === 'Low Stock'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Offers */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Active Offers</h3>
              <button onClick={() => navigate('/cms/offers?create=1')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Offer</span>
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeOffers.map((offer) => (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{offer.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{offer.type}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Expires in {offer.expires}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {offer.products} products
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" onClick={() => navigate(`/cms/offers?preview=${offer.id}`)}>
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800" onClick={() => navigate('/cms/offers?reset=1')}>
                        <AlertTriangle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions - Role-based */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {getQuickActions().map((action, index) => (
              <div key={index} className={`${action.bgColor} p-6 rounded-xl text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{action.title}</h3>
                    <p className="text-white opacity-80 mt-1">{action.description}</p>
                  </div>
                  <action.icon className={`h-8 w-8 ${action.iconColor}`} />
                </div>
                <button 
                  onClick={() => navigate(action.path)} 
                  className={`mt-4 bg-white ${action.buttonColor} px-4 py-2 rounded-lg hover:${action.buttonHoverColor} transition-colors`}>
                  {action.title}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CMSDashboard