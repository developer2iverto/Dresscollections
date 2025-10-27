import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, Ruler, Info, ChevronDown, CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'
import { getProductById } from '../utils/api'

const ProductDetail = () => {
  const { id } = useParams()
  const { addItem } = useCart()
  const { getProduct, products } = useProducts()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showCareInstructions, setShowCareInstructions] = useState(false)
  const [loadedProduct, setLoadedProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [addError, setAddError] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [showAddSuccess, setShowAddSuccess] = useState(false)
  const [addSuccessText, setAddSuccessText] = useState('')

  // Load product from context first; if not found, fetch from backend
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setLoadError(null)
      try {
        // Prefer context (local store including admin-added and generated products)
        const ctxProduct = id ? getProduct(id) : undefined
        if (ctxProduct) {
          setLoadedProduct(ctxProduct)
          setLoading(false)
          return
        }

        // Fallback: try backend API
        if (id) {
          try {
            const data: any = await getProductById(id)
            const backendProduct = data?.product || data
            setLoadedProduct(backendProduct)
          } catch (e: any) {
            setLoadError('Product not found')
          }
        } else {
          setLoadError('Missing product id')
        }
      } catch (e: any) {
        setLoadError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, products])

  const product = useMemo(() => {
    // Normalize shape for UI expectations
    if (!loadedProduct) return null
    const base: any = loadedProduct
    return {
      ...base,
      images: Array.isArray(base.images) && base.images.length > 0 ? base.images : [],
      colors:
        Array.isArray(base.colors) && base.colors.length > 0
          ? base.colors.map((c: any) =>
              typeof c === 'string'
                ? { name: c, hexCode: '#000000', stock: base.stock || 0, images: base.images }
                : c
            )
          : [
              { name: 'Black', hexCode: '#000000', stock: base.stock || 0, images: base.images },
              { name: 'White', hexCode: '#FFFFFF', stock: base.stock || 0, images: base.images }
            ],
      sizes:
        Array.isArray(base.sizes) && base.sizes.length > 0
          ? base.sizes.map((s: any) =>
              typeof s === 'string' ? { size: s, stock: base.stock || 0, price: base.price } : s
            )
          : [
              { size: 'S', stock: base.stock || 0, price: base.price },
              { size: 'M', stock: base.stock || 0, price: base.price },
              { size: 'L', stock: base.stock || 0, price: base.price }
            ],
      rating: typeof base.rating === 'number' ? base.rating : 4.5,
      reviews: Array.isArray(base.reviews) ? base.reviews : []
    }
  }, [loadedProduct])

  const sizeGuideData = {
    'S': { chest: '34-36"', waist: '28-30"', length: '27"' },
    'M': { chest: '38-40"', waist: '32-34"', length: '28"' },
    'L': { chest: '42-44"', waist: '36-38"', length: '29"' },
    'XL': { chest: '46-48"', waist: '40-42"', length: '30"' },
    'XXL': { chest: '50-52"', waist: '44-46"', length: '31"' }
  }

  const careInstructionLabels = {
    'machine-wash-cold': 'Machine wash cold (30°C)',
    'tumble-dry-low': 'Tumble dry on low heat',
    'iron-medium': 'Iron on medium heat',
    'do-not-bleach': 'Do not bleach'
  }

  const isPlaceholderUrl = (u?: string) => /picsum\.photos|placehold\.co|via\.placeholder\.com|\/api\/placeholder\//i.test((u || '').trim())

  // After product loads, preselect first available color and size to avoid empty UI states
  useEffect(() => {
    if (!product) return
    if (!selectedColor && Array.isArray(product.colors) && product.colors.length > 0) {
      const firstColor = product.colors[0]
      setSelectedColor(typeof firstColor === 'string' ? firstColor : (firstColor.name || 'Black'))
    }
    if (!selectedSize && Array.isArray(product.sizes) && product.sizes.length > 0) {
      const firstSize = product.sizes[0]
      setSelectedSize(typeof firstSize === 'string' ? firstSize : (firstSize.size || 'M'))
    }
  }, [product])

  const handleAddToCart = () => {
    if (!selectedSize) {
      setAddError('Please select a size')
      return
    }
    if (!selectedColor) {
      setAddError('Please select a color')
      return
    }
    setAddError(null)
    setIsAdding(true)
    addItem(product, quantity, selectedSize, selectedColor)
    setShowAddSuccess(true)
    setAddSuccessText('Item added to cart')
    setTimeout(() => {
      setIsAdding(false)
      setShowAddSuccess(false)
    }, 1500)
  }

  const getSelectedColorImages = () => {
    if (!product) return []
    const colorData = product.colors.find((c: any) => c.name === selectedColor)
    return colorData?.images || product.images
  }

  const getSelectedSizeStock = () => {
    if (!product) return 0
    const sizeData = product.sizes.find((s: any) => s.size === selectedSize)
    return sizeData?.stock || 0
  }

  const getSelectedSizePrice = () => {
    if (!product) return 0
    const sizeData = product.sizes.find((s: any) => s.size === selectedSize)
    return sizeData?.price || product.price
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {loading && (
        <div className="py-20 text-center text-gray-600">Loading product…</div>
      )}
      {!loading && loadError && (
        <div className="py-20 text-center text-red-600">{loadError}</div>
      )}
      {!loading && !loadError && product && (
      <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
            {(() => { const mainSrc = getSelectedColorImages()[selectedImage] || product.images[selectedImage]; return (mainSrc && !isPlaceholderUrl(mainSrc)) })() ? (
              <img
                src={getSelectedColorImages()[selectedImage] || product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                <span className="text-sm">No image</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(getSelectedColorImages()).filter((u: string) => !!u && !isPlaceholderUrl(u)).map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-lg border-2 ${
                  selectedImage === index ? 'border-purple-600' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <span className="text-sm text-purple-600 font-medium">{product.brand}</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                {product.gender === 'men' ? "Men's" : product.gender === 'women' ? "Women's" : 'Unisex'}
              </span>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                {product.fit} fit
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {product.material?.primary || 'Material'}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {product.rating} ({product.reviews.length} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-900">
                ${selectedSize ? getSelectedSizePrice() : product.price}
              </span>
              {product.originalPrice && product.originalPrice > (selectedSize ? getSelectedSizePrice() : product.price) && (
                <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice && product.originalPrice > (selectedSize ? getSelectedSizePrice() : product.price) && (
                <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded">
                  Save ${product.originalPrice - (selectedSize ? getSelectedSizePrice() : product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Color: {selectedColor}</h3>
            </div>
            <div className="flex space-x-3">
              {product.colors.map((color: any) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                    selectedColor === color.name ? 'border-purple-600' : 'border-gray-300'
                  } ${color.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: (color as any).hexCode || (color as any).hex || '#000000' }}
                  disabled={color.stock === 0}
                  title={`${color.name} ${color.stock === 0 ? '(Out of stock)' : ''}`}
                >
                  {selectedColor === color.name && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Size: {selectedSize}</h3>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
              >
                <Ruler className="h-4 w-4 mr-1" />
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((size: any) => (
                <button
                  key={size.size}
                  onClick={() => setSelectedSize(size.size)}
                  className={`py-3 px-4 border rounded-lg text-center font-medium ${
                    selectedSize === size.size
                      ? 'border-purple-600 bg-purple-50 text-purple-600'
                      : size.stock > 0
                      ? 'border-gray-300 hover:border-gray-400'
                      : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={size.stock === 0}
                >
                  {size.size}
                  {size.stock === 0 && <div className="text-xs">Out</div>}
                </button>
              ))}
            </div>
            {selectedSize && (
              <p className="text-sm text-gray-600 mt-2">
                {getSelectedSizeStock()} in stock
              </p>
            )}
          </div>

          {/* Material & Care */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Material & Care</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Material:</span> {product.material?.composition || 'Details not available'}
              </p>
              <button
                onClick={() => setShowCareInstructions(!showCareInstructions)}
                className="flex items-center text-sm text-purple-600 hover:text-purple-700"
              >
                <Info className="h-4 w-4 mr-1" />
                Care Instructions
                <ChevronDown className={`h-4 w-4 ml-1 transform ${showCareInstructions ? 'rotate-180' : ''}`} />
              </button>
              {showCareInstructions && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <ul className="space-y-1">
                    {Array.isArray(product.careInstructions) && product.careInstructions.length > 0 ? (
                      product.careInstructions.map((ci: string, idx: number) => (
                        <li key={idx}>• {ci}</li>
                      ))
                    ) : (
                      <>
                        <li>• {careInstructionLabels['machine-wash-cold']}</li>
                        <li>• {careInstructionLabels['tumble-dry-low']}</li>
                        <li>• {careInstructionLabels['iron-medium']}</li>
                        <li>• {careInstructionLabels['do-not-bleach']}</li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Model Info */}
          {product.modelInfo && (
            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Model Information</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>Height: {product.modelInfo?.height} | Chest: {product.modelInfo?.chest} | Waist: {product.modelInfo?.waist}</p>
                <p>Model is wearing size: <span className="font-medium">{product.modelInfo?.wearingSize || product.modelInfo?.size}</span></p>
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {[...Array(Math.min(10, getSelectedSizeStock()))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
                disabled={isAdding || !selectedSize || !selectedColor || getSelectedSizeStock() === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isAdding ? 'Adding…' : 'Add to Cart'}
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
            {addError && (
              <div className="mt-3 text-sm text-red-600">
                {addError}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-sm">Free shipping on orders over $75</span>
              </div>
              <div className="flex items-center">
                <RotateCcw className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-sm">30-day return policy</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-sm">Quality guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-purple-600 py-2 px-1 text-sm font-medium text-purple-600">
              Description
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Reviews ({product.reviews.length})
            </button>
          </nav>
        </div>
        <div className="py-6">
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Perfect for:</h4>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(product.occasion) && product.occasion.map((occ: any) => (
                <span key={occ} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                  {occ}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      </>
      )}

      {showAddSuccess && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>{addSuccessText}</span>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Size Guide</h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Size</th>
                    <th className="text-left py-2">Chest</th>
                    <th className="text-left py-2">Waist</th>
                    <th className="text-left py-2">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(sizeGuideData).map(([size, measurements]) => (
                    <tr key={size} className="border-b">
                      <td className="py-2 font-medium">{size}</td>
                      <td className="py-2">{measurements.chest}</td>
                      <td className="py-2">{measurements.waist}</td>
                      <td className="py-2">{measurements.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>All measurements are in inches. For best fit, measure yourself and compare with the size chart.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail