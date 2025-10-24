import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Percent, Tag, ShoppingCart } from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'

const Deals = () => {
  const { getProductsOnSale, loading, error } = useProducts()
  const { addItem } = useCart()
  const [addingId, setAddingId] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const saleProducts = getProductsOnSale()

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-center mb-4">
            <Percent className="h-8 w-8 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold">Deals & Sale</h1>
          </div>
          <p className="text-center text-lg md:text-xl max-w-3xl mx-auto">
            Grab limited-time discounts on popular styles. New deals drop regularly.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center"><Tag className="h-5 w-5 mr-2" /><span>Curated Offers</span></div>
            <div className="flex items-center"><Percent className="h-5 w-5 mr-2" /><span>Extra Savings</span></div>
          </div>
        </div>
      </div>

      {/* Status / Empty state */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading && (
            <div className="text-gray-700">Loading deals…</div>
          )}
          {error && (
            <div className="text-red-600">{error}</div>
          )}
          {!loading && !error && saleProducts.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-yellow-900 mb-1">No deals available right now</h3>
              <p className="text-sm text-yellow-800">
                Check back soon or explore our <Link to="/new-arrivals" className="underline font-medium">New Arrivals</Link>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Deals Grid */}
      {saleProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">On Sale Now</h2>
            <p className="text-gray-600">Showing {saleProducts.length} discounted products</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {saleProducts.map((product) => (
              <div key={product._id} className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Sale Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {product.isFinalSale ? 'FINAL SALE' : 'SALE'}
                  </span>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(product._id)}
                  className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                  aria-label="Toggle favorite"
                >
                  {/* Simple heart shape via CSS to avoid extra imports */}
                  <div className={`h-4 w-4 ${favorites.includes(product._id) ? 'bg-red-500' : 'bg-gray-300'} clip-heart`}></div>
                </button>

                {/* Product Image */}
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-3">
                  <div className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                    {product.mainCategory?.replace('-', ' ') || 'Category'}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    <Link to={`/products/${product._id}`}>{product.name}</Link>
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{product.rating} ({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    {product.originalPrice && (
                      <span className="text-sm font-medium text-green-600">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      try {
                        setAddingId(product._id)
                        const defaultSize = Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes[0] : undefined
                        const defaultColor = Array.isArray(product.colors) && product.colors.length > 0 ? product.colors[0] : undefined
                        addItem(product as any, 1, defaultSize, defaultColor)
                      } finally {
                        setTimeout(() => setAddingId(null), 400)
                      }
                    }}
                    className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${addingId === product._id ? 'opacity-75 cursor-wait' : 'hover:from-purple-700 hover:to-pink-700'}`}
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className={`h-4 w-4 ${addingId === product._id ? 'animate-pulse' : ''}`} />
                    <span>{addingId === product._id ? 'Adding…' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simple CSS clip-path for heart */}
      <style>{`
        .clip-heart {
          clip-path: polygon(50% 0%, 61% 7%, 70% 16%, 76% 26%, 79% 38%, 79% 50%, 76% 62%, 70% 72%, 61% 81%, 50% 88%, 39% 81%, 30% 72%, 24% 62%, 21% 50%, 21% 38%, 24% 26%, 30% 16%, 39% 7%);
        }
      `}</style>
    </div>
  )
}

export default Deals