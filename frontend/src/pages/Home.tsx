import { Link } from 'react-router-dom'
import { ArrowRight, Star, Truck, Shield, Headphones, Shirt, Users, Sparkles } from 'lucide-react'

const Home = () => {
  const featuredProducts = [
    {
      id: '1',
      name: 'Elegant Cotton Kurti',
      price: 45.99,
      originalPrice: 59.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
      rating: 4.5,
      reviews: 128,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Royal Blue', 'Emerald Green', 'Maroon']
    },
    {
      id: '2',
      name: 'Comfortable Palazzo Pants',
      price: 32.99,
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500',
      rating: 4.8,
      reviews: 89,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Navy Blue', 'Black', 'Olive Green']
    },
    {
      id: '3',
      name: 'Designer Anarkali Suit',
      price: 89.99,
      originalPrice: 119.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop&auto=format&q=80',
      rating: 4.6,
      reviews: 156,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Pink', 'Purple', 'Golden']
    },
    {
      id: '4',
      name: 'Casual Straight Pants',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500',
      rating: 4.7,
      reviews: 203,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Khaki']
    }
  ]

  const categories = [
    {
      name: "Kurtis & Tops",
      gradient: 'from-pink-300 via-rose-400 to-fuchsia-400',
      count: '1,234 items',
      description: 'Elegant ethnic wear for women'
    },
    {
      name: "Palazzo & Pants",
      gradient: 'from-sky-300 via-cyan-400 to-teal-400',
      count: '2,567 items',
      description: 'Comfortable bottoms for all occasions'
    },
    {
      name: "Traditional Suits",
      gradient: 'from-amber-300 via-orange-400 to-red-400',
      count: '890 items',
      description: 'Designer ethnic suits and sets'
    },

  ]

  const collections = [
    {
      title: 'Summer Collection 2024',
      description: 'Light, breezy fabrics perfect for the season',
      gradient: 'from-indigo-400 via-violet-500 to-fuchsia-500',
      link: '/collections/summer-2024'
    },
    {
      title: 'Formal Wear',
      description: 'Professional attire for every occasion',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
      link: '/collections/formal'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full">
        <div className="relative h-[70vh] w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
            alt="Style Union Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="container-custom">
              <div className="max-w-lg">
                <h1 className="text-white mb-6">
                  New Collection
                </h1>
                <p className="text-white text-lg mb-8 font-light">
                  Discover our latest arrivals for the season
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/products"
                    className="btn-primary"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    to="/collections"
                    className="btn-outline text-white border-white hover:bg-white/20"
                  >
                    View Lookbook
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="relative py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Trending Categories</h2>
            <p className="text-gray-600 mt-2">Explore popular picks curated for you.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'Women', gradient: 'from-pink-200 via-rose-300 to-fuchsia-300' },
              { label: 'Men', gradient: 'from-blue-200 via-sky-300 to-indigo-300' },
              { label: 'Kids', gradient: 'from-emerald-200 via-teal-300 to-cyan-300' },
            ].map((item) => (
              <Link
                key={item.label}
                to="/products"
                className={`group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${item.gradient} text-gray-900 shadow-sm hover:shadow-lg transition-all duration-300 float-slow`}
              >
                <div className="absolute inset-0 opacity-20 bg-white/40 mix-blend-overlay" />
                <div className="relative flex items-center justify-between">
                  <span className="text-lg font-semibold">{item.label}</span>
                  <ArrowRight className="h-5 w-5 text-gray-700 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $75</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shirt className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">Premium fabrics and craftsmanship</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Style Support</h3>
              <p className="text-gray-600">Personal styling assistance available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect style for every occasion
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/category/${category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`h-64 bg-gradient-to-br ${category.gradient} relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300`}>
                  <div className="absolute inset-0 bg-[url('/fabric-mesh.svg')] opacity-10 mix-blend-overlay"></div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white drop-shadow">
                  <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-100 mb-1">{category.description}</p>
                  <p className="text-sm text-gray-200">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Collections
            </h2>
            <p className="text-xl text-gray-600">
              Curated styles for the modern wardrobe
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {collections.map((collection, index) => (
              <Link
                key={index}
                to={collection.link}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`h-64 bg-gradient-to-br ${collection.gradient} relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300`}>
                  <div className="absolute inset-0 bg-[url('/fabric-mesh.svg')] opacity-10 mix-blend-overlay"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
                    <p className="text-lg text-gray-100">{collection.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trending Now
            </h2>
            <p className="text-xl text-gray-600">
              Most popular items this season
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({product.reviews})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">${product.price}</span>
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    Sizes: {product.sizes.join(', ')}
                  </div>
                  <div className="text-xs text-gray-500">
                    Colors: {product.colors.join(', ')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay in Style
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Subscribe to get the latest fashion trends and exclusive offers
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <button className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-r-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home