import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ProductProvider } from './context/ProductContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Footer from './components/Footer'
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
];

const cmsRoutes = [
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
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <Router>
              <div className="min-h-screen flex flex-col bg-neutral-50">
                <Routes>
                  {/* Public Routes */}
                  {publicRoutes.map(({ path, element, noTopPadding }) => (
                    <Route
                      key={path}
                      path={path}
                      element={
                        <Layout className={noTopPadding ? '' : 'pt-6'}>
                          {element}
                        </Layout>
                      }
                    />
                  ))}
                  
                  {/* Protected Customer Routes */}
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <Layout><Account /></Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* CMS Routes */}
                  <Route path="/cms/login" element={<CMSLogin />} />
                  
                  {/* Protected CMS Routes */}
                  <Route
                    path="/cms"
                    element={
                      <ProtectedRoute>
                        <CMSLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<CMSDashboard />} />
                    {cmsRoutes.map(({ path, element, role }) => (
                      <Route
                        key={path}
                        path={path}
                        element={
                          role ? (
                            <ProtectedRoute requiredRole={role}>
                              {element}
                            </ProtectedRoute>
                          ) : (
                            element
                          )
                        }
                      />
                    ))}
                  </Route>

                  {/* Error Route */}
                  <Route
                    path="*"
                    element={
                      <Layout>
                        <div className="text-center py-10">
                          <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                        </div>
                      </Layout>
                    }
                  />
                </Routes>
              </div>
            </Router>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;