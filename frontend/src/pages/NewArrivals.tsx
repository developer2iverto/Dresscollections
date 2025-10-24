import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Heart, ShoppingCart, TrendingUp, Sparkles, Clock } from 'lucide-react'
import { useCart } from '../context/CartContext'

const NewArrivals = () => {
  const [favorites, setFavorites] = useState<string[]>([])
  const { addItem } = useCart()

  const toMainCategory = (cat: string) => {
    const key = (cat || '').toLowerCase()
    if (key.includes('women')) return 'womens-wear'
    if (key.includes('men')) return 'mens-wear'
    if (key.includes("kids")) return 'kids-wear'
    return 'womens-wear'
  }

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  // New arrival products with fresh, trendy images
  const newArrivals = [
    {
      id: 'na-1',
      name: 'Oversized Blazer',
      price: 89.99,
      originalPrice: 119.99,
      image: 'https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?w=500&h=600&fit=crop&auto=format&q=80',
      category: "Women's Wear",
      rating: 4.8,
      reviews: 156,
      isNew: true,
      colors: ['Black', 'Beige', 'Navy'],
      description: 'Sophisticated oversized blazer perfect for modern professional looks'
    },
    {
      id: 'na-2',
      name: 'Ribbed Knit Sweater',
      price: 54.99,
      originalPrice: 74.99,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=600&fit=crop&auto=format&q=80',
      category: "Women's Wear",
      rating: 4.9,
      reviews: 203,
      isNew: true,
      colors: ['Cream', 'Sage', 'Dusty Pink'],
      description: 'Cozy ribbed knit sweater with a relaxed fit for everyday comfort'
    },
    {
      id: 'na-3',
      name: 'High-Waisted Wide Leg Jeans',
      price: 68.99,
      originalPrice: 89.99,
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=600&fit=crop&auto=format&q=80',
      category: "Women's Wear",
      rating: 4.7,
      reviews: 189,
      isNew: true,
      colors: ['Light Blue', 'Dark Wash', 'Black'],
      description: 'Trendy high-waisted wide leg jeans for a vintage-inspired look'
    },
    {
      id: 'na-4',
      name: 'Minimalist Hoodie',
      price: 45.99,
      originalPrice: 59.99,
      image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=500&h=600&fit=crop&auto=format&q=80',
      category: "Men's Wear",
      rating: 4.6,
      reviews: 142,
      isNew: true,
      colors: ['Charcoal', 'Olive', 'Cream'],
      description: 'Clean, minimalist hoodie with premium cotton blend fabric'
    },
    {
      id: 'na-5',
      name: 'Cropped Cardigan',
      price: 42.99,
      originalPrice: 56.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop&auto=format&q=80',
      category: "Women's Wear",
      rating: 4.8,
      reviews: 167,
      isNew: true,
      colors: ['Lavender', 'Mint', 'Peach'],
      description: 'Soft cropped cardigan perfect for layering in any season'
    },
    {
      id: 'na-6',
      name: 'Vintage Band Tee',
      price: 28.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=600&fit=crop&auto=format&q=80',
      category: "Unisex",
      rating: 4.5,
      reviews: 234,
      isNew: true,
      colors: ['Black', 'White', 'Vintage Gray'],
      description: 'Authentic vintage-style band tee with distressed finish'
    },
    {
      id: 'na-7',
      name: 'Pleated Mini Skirt',
      price: 36.99,
      originalPrice: 48.99,
      image: 'https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?w=500&h=600&fit=crop&auto=format&q=80',
      category: "Women's Wear",
      rating: 4.9,
      reviews: 178,
      isNew: true,
      colors: ['Black', 'Plaid', 'Navy'],
      description: 'Classic pleated mini skirt with modern tailoring'
    },
    {
      id: 'na-8',
      name: 'Colorful Kids Hoodie',
      price: 32.99,
      originalPrice: 42.99,
      image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500&h=600&fit=crop&auto=format&q=80',
      category: "Kids' Wear",
      rating: 4.7,
      reviews: 145,
      isNew: true,
      colors: ['Rainbow', 'Blue', 'Pink'],
      description: 'Fun and comfortable hoodie with vibrant colors for kids'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-6xl font-bold">New Arrivals</h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover the latest fashion trends and must-have pieces that just landed in our collection
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span>Trending Now</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>Just Added</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">{newArrivals.length}</div>
              <div className="text-gray-600">New Items</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">4.7</div>
              <div className="text-gray-600">Avg Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">30%</div>
              <div className="text-gray-600">Avg Savings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">24h</div>
              <div className="text-gray-600">Fresh Arrivals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Additions</h2>
          <p className="text-gray-600">Showing {newArrivals.length} new products</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {newArrivals.map((product) => (
            <div key={product.id} className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* New Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  NEW
                </span>
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Heart 
                  className={`h-4 w-4 ${
                    favorites.includes(product.id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-400 hover:text-red-500'
                  }`} 
                />
              </button>

              {/* Product Image */}
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                    {product.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  <Link to={`/products/${product.id}`}>
                    {product.name}
                  </Link>
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Colors */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Colors:</span>
                    <div className="flex space-x-1">
                      {product.colors.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{
                            backgroundColor: color.toLowerCase() === 'black' ? '#000' :
                                           color.toLowerCase() === 'white' ? '#fff' :
                                           color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                           color.toLowerCase() === 'beige' ? '#f5f5dc' :
                                           color.toLowerCase() === 'cream' ? '#fffdd0' :
                                           color.toLowerCase() === 'sage' ? '#9caf88' :
                                           color.toLowerCase() === 'dusty pink' ? '#d4a5a5' :
                                           color.toLowerCase() === 'light blue' ? '#add8e6' :
                                           color.toLowerCase() === 'dark wash' ? '#2c3e50' :
                                           color.toLowerCase() === 'charcoal' ? '#36454f' :
                                           color.toLowerCase() === 'olive' ? '#808000' :
                                           color.toLowerCase() === 'lavender' ? '#e6e6fa' :
                                           color.toLowerCase() === 'mint' ? '#98fb98' :
                                           color.toLowerCase() === 'peach' ? '#ffcba4' :
                                           color.toLowerCase() === 'vintage gray' ? '#8b8680' :
                                           color.toLowerCase() === 'plaid' ? '#8b4513' :
                                           color.toLowerCase() === 'rainbow' ? 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)' :
                                           color.toLowerCase() === 'blue' ? '#0066cc' :
                                           color.toLowerCase() === 'pink' ? '#ffc0cb' :
                                           '#ccc'
                          }}
                        />
                      ))}
                      {product.colors.length > 3 && (
                        <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <span className="text-sm font-medium text-green-600">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => {
                    const productForCart = {
                      _id: product.id,
                      name: product.name,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      images: [product.image],
                      category: 'new-arrivals',
                      mainCategory: toMainCategory(product.category),
                      brand: 'StyleHub',
                      rating: product.rating,
                      reviews: product.reviews,
                      sizes: ['S','M','L'],
                      colors: product.colors || [],
                      isOnSale: !!product.originalPrice,
                      isFinalSale: false,
                      isActive: true
                    } as any

                    const defaultColor = (product.colors && product.colors[0]) || undefined
                    addItem(productForCart, 1, undefined, defaultColor)
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Be the first to know about new arrivals, exclusive deals, and fashion trends
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-purple-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewArrivals