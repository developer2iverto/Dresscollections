import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'super_admin' | 'admin' | 'product_admin' | 'editor' | 'author'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/cms/login" state={{ from: location }} replace />
  }

  // Check role-based access
  if (requiredRole && user) {
    // Super admin has access to everything
    if (user.role === 'super_admin') {
      return <React.Fragment>{children}</React.Fragment>
    }
    
    // Product admin has access to product-related pages and general admin pages
    if (user.role === 'product_admin' && 
        (requiredRole === 'product_admin' || requiredRole === 'editor' || requiredRole === 'admin')) {
      return <React.Fragment>{children}</React.Fragment>
    }
    
    // Admin has access to admin pages but not super_admin pages
    if (user.role === 'admin' && 
        (requiredRole === 'admin' || requiredRole === 'editor' || requiredRole === 'product_admin')) {
      return <React.Fragment>{children}</React.Fragment>
    }
    
    // If none of the above conditions are met, deny access
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page. Your current role is <span className="font-semibold">{user.role}</span>, 
            but this page requires <span className="font-semibold">{requiredRole}</span> access.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return <React.Fragment>{children}</React.Fragment>
}

export default ProtectedRoute