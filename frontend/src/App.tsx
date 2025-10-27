import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ProductProvider } from './context/ProductContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import NewArrivals from './pages/NewArrivals'
import Deals from './pages/Deals'
import Account from './pages/Account'
import CareInstructions from './pages/CareInstructions'
import CMSLogin from './pages/CMSLogin'
import CMSLayout from './components/CMSLayout'
import CMSDashboard from './pages/CMSDashboard'
import CMSUsers from './pages/CMSUsers'
import CMSSettings from './pages/CMSSettings'
import CMSProducts from './pages/CMSProducts'
import CMSOrders from './pages/CMSOrders'
import CMSInventory from './pages/CMSInventory'
import CMSOffers from './pages/CMSOffers'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import React from 'react'

type Role = 'super_admin' | 'admin' | 'product_admin' | 'editor' | 'author'
interface CmsRoute {
  path: string
  element: React.ReactNode
  role?: Role
}

// Route configurations
const publicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/products', element: <Products /> },
  { path: '/products/:id', element: <ProductDetail /> },
  { path: '/cart', element: <Cart /> },
  { path: '/checkout', element: <Checkout /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/new-arrivals', element: <NewArrivals />, noTopPadding: true },
  { path: '/deals', element: <Deals />, noTopPadding: true },
  { path: '/care-instructions', element: <CareInstructions /> },
];

const cmsRoutes: CmsRoute[] = [
  { path: 'dashboard', element: <CMSDashboard /> },
  { path: 'products', element: <CMSProducts />, role: 'product_admin' },
  { path: 'orders', element: <CMSOrders />, role: 'admin' },
  { path: 'inventory', element: <CMSInventory />, role: 'product_admin' },
  { path: 'offers', element: <CMSOffers />, role: 'admin' },
  { path: 'users', element: <CMSUsers />, role: 'super_admin' },
  { path: 'settings', element: <CMSSettings />, role: 'super_admin' },
  { path: 'account', element: <CMSDashboard /> },
];

function App() {
  // Define router with React Router v7 future flags
  const router = createBrowserRouter(
    [
      // Public routes rendered with Layout wrapper
      ...publicRoutes.map(({ path, element, noTopPadding }) => ({
        path,
        element: (
          <Layout className={noTopPadding ? '' : 'pt-6'}>
            {element}
          </Layout>
        ),
      })),

      // Protected customer route
      {
        path: '/account',
        element: (
          <ProtectedRoute>
            <Layout>
              <Account />
            </Layout>
          </ProtectedRoute>
        ),
      },

      // CMS login
      { path: '/cms/login', element: <CMSLogin /> },

      // Protected CMS area with nested routes
      {
        path: '/cms',
        element: (
          <ProtectedRoute>
            <CMSLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <CMSDashboard /> },
          ...cmsRoutes.map(({ path, element, role }) => ({
            path,
            element: role ? (
              <ProtectedRoute requiredRole={role}>{element}</ProtectedRoute>
            ) : (
              element
            ),
          })),
        ],
      },

      // Catch-all 404
      {
        path: '*',
        element: (
          <Layout>
            <div className="text-center py-10">
              <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            </div>
          </Layout>
        ),
      },
    ],
  )

  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;