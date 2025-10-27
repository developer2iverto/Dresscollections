import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, User, Menu, X, ChevronDown, Settings } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const { state } = useCart()
  const { user } = useAuth()
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const userTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const q = searchQuery.trim()
    if (q.length > 0) {
      navigate(`/products?search=${encodeURIComponent(q)}`)
      setIsSearchOpen(false)
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      if (userTimeoutRef.current) {
        clearTimeout(userTimeoutRef.current)
      }
    }
  }, [])

  const categories = [
    {
      name: "Men's Wear",
      href: '/products?category=mens-wear',
      subcategories: [
        { name: 'T-Shirts', href: '/products?category=mens-wear&subcategory=t-shirts' },
        { name: 'Shirts', href: '/products?category=mens-wear&subcategory=shirts' },
        { name: 'Pants', href: '/products?category=mens-wear&subcategory=pants' },
        { name: 'Jackets', href: '/products?category=mens-wear&subcategory=jackets' },
        { name: 'Sweaters', href: '/products?category=mens-wear&subcategory=sweaters' }
      ]
    },
    {
      name: "Women's Wear",
      href: '/products?category=womens-wear',
      subcategories: [
        { name: 'Jeans', href: '/products?category=womens-wear&subcategory=jeans' },
        { name: 'Skirts', href: '/products?category=womens-wear&subcategory=skirts' },
        // Removed T-Shirts, Blouses, Jackets from women's wear menu
      ]
    },
    {
      name: "Kids' Wear",
      href: '/products?category=kids-wear',
      subcategories: [
        // Removed T-Shirts from kids' wear menu
        { name: 'Dresses', href: '/products?category=kids-wear&subcategory=dresses' },
        // Removed Pants, Shorts, Jackets from kids' wear menu
      ]
    },

  ]

  // Hover handlers with delay
  const handleCategoriesMouseEnter = () => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setShowCategoriesDropdown(true)
  }

  const handleCategoriesMouseLeave = () => {
    // Set a delay before hiding the dropdown
    hoverTimeoutRef.current = setTimeout(() => {
      setShowCategoriesDropdown(false)
    }, 500) // 500ms delay (0.5 seconds)
  }

  const handleUserMouseEnter = () => {
    // Clear any existing timeout
    if (userTimeoutRef.current) {
      clearTimeout(userTimeoutRef.current)
      userTimeoutRef.current = null
    }
    setShowUserDropdown(true)
  }

  const handleUserMouseLeave = () => {
    // Set a delay before hiding the dropdown
    userTimeoutRef.current = setTimeout(() => {
      setShowUserDropdown(false)
    }, 500) // 500ms delay (0.5 seconds)
  }

  return (
    <React.Fragment>
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-lg font-heading uppercase tracking-widest text-neutral-900">StyleUnion</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for garments, brands, styles..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/products" className="text-neutral-800 hover:text-primary-600 text-sm uppercase tracking-wide font-normal transition-colors">
              All Products
            </Link>
            
            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleCategoriesMouseEnter}
              onMouseLeave={handleCategoriesMouseLeave}
            >
              <button className="flex items-center text-neutral-800 hover:text-primary-600 text-sm uppercase tracking-wide font-normal transition-colors">
                Categories
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              
              {showCategoriesDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-neutral-200 py-3 z-50">
                  <div className="grid grid-cols-1 gap-2 px-4">
                    {categories.map((category) => (
                      <div key={category.name} className="space-y-1">
                        <Link
                          to={category.href}
                          className="block text-sm uppercase tracking-wide text-neutral-800 hover:text-primary-600 transition-colors"
                        >
                          {category.name}
                        </Link>
                        <ul className="space-y-1 mb-3">
                          {category.subcategories.map((sub) => (
                            <li key={sub.name}>
                              <Link
                                to={sub.href}
                                className="block text-xs text-neutral-600 hover:text-primary-600 transition-colors"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/deals" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Sale
            </Link>
            <Link to="/new-arrivals" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              New Arrivals
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6">
            {/* Search icon removed as requested */}
            {/* User dropdown for Account/Admin */}
            <div 
              className="relative"
              onMouseEnter={handleUserMouseEnter}
              onMouseLeave={handleUserMouseLeave}
            >
              <button className="text-neutral-800 hover:text-primary-600 transition-colors">
                <User className="h-5 w-5 stroke-current" />
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-neutral-200 rounded-md shadow-lg z-50">
                  <div className="py-2">
                    {user ? (
                      <>
                        <Link to="/account" className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-50">My Account</Link>
                        {(user.role === 'super_admin' || user.role === 'admin' || user.role === 'product_admin') ? (
                          <Link to="/cms/dashboard" className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-50">Admin Dashboard</Link>
                        ) : (
                          <Link to="/cms/login" className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-50">Admin Login</Link>
                        )}
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-50">Customer Login / Register</Link>
                        <Link to="/cms/login" className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-50">Admin Login</Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link to="/cart" className="text-neutral-800 hover:text-primary-600 transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {state.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {state.items.length}
                </span>
              )}
            </Link>
            
            {/* Mobile menu button */}
            <button 
              className="lg:hidden text-neutral-800 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for garments, brands, styles..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Mobile Navigation Links */}
              <Link
                to="/products"
                className="text-gray-700 hover:text-purple-600 font-medium py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>

              {/* Mobile Categories */}
              {categories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <Link
                    to={category.href}
                    className="block font-medium text-gray-900 hover:text-purple-600 py-1 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                  <div className="pl-4 space-y-1">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.href}
                        className="block text-sm text-gray-600 hover:text-purple-600 py-1 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <Link
                to="/deals"
                className="text-gray-700 hover:text-purple-600 font-medium py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sale
              </Link>
              <Link
                to="/new-arrivals"
                className="text-gray-700 hover:text-purple-600 font-medium py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                New Arrivals
              </Link>
              
              {/* Mobile User Options */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link
                  to="/login"
                  className="flex items-center text-gray-700 hover:text-purple-600 font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-3" />
                  Login / Register
                </Link>
                <Link
                  to="/cms/login"
                  className="flex items-center text-gray-700 hover:text-purple-600 font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Admin Panel
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
    {isSearchOpen && (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/40" onClick={() => setIsSearchOpen(false)}></div>
        <div className="relative max-w-xl mx-auto mt-24 px-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="flex items-center bg-white rounded-lg shadow-lg border border-neutral-200">
              <Search className="h-5 w-5 text-gray-400 ml-3" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for garments, brands, styles..."
                className="flex-1 px-3 py-3 outline-none"
              />
              <button type="button" onClick={() => setIsSearchOpen(false)} className="px-3 py-2 text-gray-500 hover:text-gray-700" aria-label="Close search">
                <X className="h-5 w-5" />
              </button>
              <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </React.Fragment>
  )
}

export default Header