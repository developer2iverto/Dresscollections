import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Lock, LogOut } from 'lucide-react';

const Account = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Mock order history
  const orders = [
    { id: '#ORD-2023-1234', date: '2023-10-15', status: 'Delivered', total: '$129.99' },
    { id: '#ORD-2023-0987', date: '2023-09-22', status: 'Processing', total: '$75.50' },
    { id: '#ORD-2023-0654', date: '2023-08-10', status: 'Delivered', total: '$210.25' },
  ];

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your account</p>
          <button 
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            onClick={() => window.location.href = '/login'}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-medium text-gray-900 mb-8">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user.firstName || 'User'}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 ${
                activeTab === 'profile' 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 ${
                activeTab === 'orders' 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Orders</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 ${
                activeTab === 'addresses' 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MapPin className="h-5 w-5" />
              <span>Addresses</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 ${
                activeTab === 'security' 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Lock className="h-5 w-5" />
              <span>Security</span>
            </button>
            
            <button 
              onClick={logout}
              className="w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-6">Profile Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <div className="flex border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-2 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        className="flex-1 p-2 focus:outline-none focus:ring-0 border-0"
                        value={user.firstName || ''}
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <div className="flex border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-2 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        className="flex-1 p-2 focus:outline-none focus:ring-0 border-0"
                        value={user.lastName || ''}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="flex border rounded-md overflow-hidden">
                    <div className="bg-gray-50 p-2 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      className="flex-1 p-2 focus:outline-none focus:ring-0 border-0"
                      value={user.email}
                      readOnly
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="flex border rounded-md overflow-hidden">
                    <div className="bg-gray-50 p-2 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="tel" 
                      className="flex-1 p-2 focus:outline-none focus:ring-0 border-0"
                      value={user.phone || 'Not provided'}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-6">Order History</h2>
              
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'Delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-primary-600 hover:text-primary-900">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">You haven't placed any orders yet.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'addresses' && (
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-6">Saved Addresses</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 relative">
                  <div className="absolute top-4 right-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                  
                  <h3 className="font-medium mb-2">Home</h3>
                  <p className="text-sm text-gray-600">123 Main Street</p>
                  <p className="text-sm text-gray-600">Apt 4B</p>
                  <p className="text-sm text-gray-600">New York, NY 10001</p>
                  <p className="text-sm text-gray-600">United States</p>
                  <p className="text-sm text-gray-600 mt-2">Phone: (555) 123-4567</p>
                  
                  <div className="mt-4 flex space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Default Shipping
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Default Billing
                    </span>
                  </div>
                </div>
                
                <div className="border border-dashed rounded-lg p-4 flex items-center justify-center">
                  <button className="text-primary-600 hover:text-primary-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Address
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <div className="flex border rounded-md overflow-hidden">
                        <div className="bg-gray-50 p-2 flex items-center justify-center">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                          type="password" 
                          className="flex-1 p-2 focus:outline-none focus:ring-0 border-0"
                          placeholder="Enter current password"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <div className="flex border rounded-md overflow-hidden">
                        <div className="bg-gray-50 p-2 flex items-center justify-center">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                          type="password" 
                          className="flex-1 p-2 focus:outline-none focus:ring-0 border-0"
                          placeholder="Enter new password"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <div className="flex border rounded-md overflow-hidden">
                        <div className="bg-gray-50 p-2 flex items-center justify-center">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                          type="password" 
                          className="flex-1 p-2 focus:outline-none focus:ring-0 border-0"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
                  
                  <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;