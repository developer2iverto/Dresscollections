import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, X, TrendingUp, Package, Users, Award } from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import { getDevCatalog, getProductsByCategory } from '../utils/api'

// Local banner type to satisfy strict typing
type Banner = {
  title: string
  description: string
  image: string
  gradient: string
  isAllProducts?: boolean
  stats?: {
    totalProducts: string
    categories: string
    brands: string
    avgRating: string
  }
}

// Category banner data
const categoryBanners: Record<string, Banner> = {
  // All Products - Default banner for comprehensive view
  'all-products': {
    title: 'All Products',
    description: 'Explore our complete collection of fashion-forward clothing',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop&auto=format&q=80',
    gradient: 'from-purple-600 via-pink-600 to-indigo-700',
    isAllProducts: true,
    stats: {
      totalProducts: '500+',
      categories: '15+',
      brands: '25+',
      avgRating: '4.6'
    }
  },
  // Main Categories
  'mens-wear': {
    title: "Men's Wear",
    description: "Discover the latest trends in men's fashion",
    image: '',
    gradient: 'from-blue-600 to-blue-800'
  },
  'womens-wear': {
    title: "Women's Wear",
    description: "Elegant styles for the modern woman",
    image: '',
    gradient: 'from-pink-500 to-purple-600'
  },
  'kids-wear': {
    title: "Kids' Wear",
    description: "Comfortable and playful clothing for children",
    image: '',
    gradient: 'from-green-400 to-blue-500'
  },

  
  // Men's Subcategories
  't-shirts': {
    title: 'T-Shirts',
    description: 'Comfortable and stylish t-shirts for everyday wear',
    image: '',
    gradient: 'from-blue-500 to-cyan-600'
  },
  'shirts': {
    title: 'Shirts',
    description: 'Professional and casual shirts for any occasion',
    image: '',
    gradient: 'from-slate-600 to-blue-700'
  },
  'jeans': {
    title: 'Jeans',
    description: 'Premium denim for the perfect fit',
    image: '',
    gradient: 'from-indigo-600 to-blue-800'
  },
  'pants': {
    title: 'Pants',
    description: 'Versatile pants for work and leisure',
    image: '',
    gradient: 'from-gray-600 to-slate-700'
  },
  'jackets': {
    title: 'Jackets',
    description: 'Stay warm and stylish with our jacket collection',
    image: '',
    gradient: 'from-emerald-600 to-teal-700'
  },
  'sweaters': {
    title: 'Sweaters',
    description: 'Cozy sweaters for the perfect layered look',
    image: '',
    gradient: 'from-orange-500 to-red-600'
  },
  
  // Women's Subcategories
  'dresses': {
    title: 'Dresses',
    description: 'Beautiful dresses for special moments',
    image: '',
    gradient: 'from-rose-400 to-pink-600'
  },
  'blouses': {
    title: 'Blouses',
    description: 'Elegant blouses for professional and casual wear',
    image: '',
    gradient: 'from-purple-400 to-pink-500'
  },
  'skirts': {
    title: 'Skirts',
    description: 'Stylish skirts for every season',
    image: '',
    gradient: 'from-violet-500 to-purple-600'
  },
  
  // Kids' Subcategories
  'shorts': {
    title: 'Shorts',
    description: 'Comfortable shorts for active kids',
    image: '',
    gradient: 'from-lime-400 to-green-500'
  },
  

  
  // Generic categories for backward compatibility
  'tops': {
    title: 'Tops',
    description: 'Stylish tops for every occasion',
    image: '',
    gradient: 'from-purple-500 to-pink-500'
  },
  'bottoms': {
    title: 'Bottoms',
    description: 'Comfortable and fashionable bottoms',
    image: '',
    gradient: 'from-indigo-500 to-purple-600'
  }
}

const Products = () => {
  const location = useLocation()
  const { products, clearCache, refreshProducts } = useProducts()
  // Local product shape used in this page to satisfy strict typing
  interface ProductRow {
    _id: string
    name: string
    brand?: string
    category?: string
    mainCategory?: string
    gender?: string
    price: number
    originalPrice?: number
    images: string[]
    sizes?: string[]
    colors?: string[]
    isOnSale?: boolean
    isFinalSale?: boolean
  }

  const [filteredProducts, setFilteredProducts] = useState<ProductRow[]>([])
  const [sourceProducts, setSourceProducts] = useState<any[]>([])
  const [currentCategory, setCurrentCategory] = useState('womens-wear')
  type Filters = { category: string; size: string; sizeType: string; color: string; priceRange: string }
  type ExpandableFilterKey = 'category' | 'size' | 'sizeType' | 'color'
  const [filters, setFilters] = useState<Filters>({
    category: '',
    size: '',
    sizeType: '',
    color: '',
    priceRange: ''
  })
  const [sortBy, setSortBy] = useState('featured')
  const [expandedFilters, setExpandedFilters] = useState<Record<ExpandableFilterKey, boolean>>({
    category: true,
    size: true,
    sizeType: false,
    color: false
  })

  // Helper: detect men's items even if gender field is missing
  const isMenItem = (p: any) => {
    const g = (p.gender || '').toLowerCase()
    if (g === 'men') return true
    const n = (p.name || '').toLowerCase()
    return /\bmen\b|\bman's\b|\bman\b|\bboy?s\b|\bgents?\b/.test(n)
  }

  // Image helpers: no auto placeholders; return trimmed URL only
  const isPlaceholderUrl = (u?: string) => /picsum\.photos|placehold\.co|via\.placeholder\.com|\/api\/placeholder\//i.test((u || '').trim())
  const sanitizeImageUrl = (url?: string) => {
    const u = (url || '').trim()
    return u && !isPlaceholderUrl(u) ? u : ''
  }
  const sanitizeBannerUrl = (url?: string) => {
    return (url || '').trim()
  }

  // Reset filters whenever navigation changes (avoid stale filters blocking results)
  useEffect(() => {
    setFilters({
      category: '',
      size: '',
      sizeType: '',
      color: '',
      priceRange: ''
    })
  }, [location.search])

  // Ensure we have the latest saved products from localStorage when visiting this page
  useEffect(() => {
    try {
      refreshProducts()
    } catch {}
  }, [])




  // Dynamic categories based on main category context
  const getCategoriesForMainCategory = (mainCategory: string): string[] => {
    const categoryMappings: Record<string, string[]> = {
      'mens-wear': ['T-Shirts', 'Shirts', 'Jeans', 'Pants', 'Jackets', 'Sweaters'],
      // Women’s Wear sidebar filters
      'womens-wear': ['Dresses', 'Jeans', 'Skirts'],
      'kids-wear': ['T-Shirts', 'Shorts', 'Jackets'],
      'all-products': ['Tops', 'Bottoms', 'Dresses', 'T-Shirts', 'Shirts', 'Jeans', 'Pants', 'Jackets', 'Sweaters', 'Blouses', 'Skirts', 'Shorts']
    }
    return categoryMappings[mainCategory] || categoryMappings['all-products']
  }

  // Determine current main category from currentCategory
  const getCurrentMainCategory = () => {
    if (['mens-wear', 'womens-wear', 'kids-wear', 'all-products'].includes(currentCategory)) {
      return currentCategory
    }
    
    // For subcategories, determine the main category based on URL params
    const searchParams = new URLSearchParams(location.search)
    const categoryParam = searchParams.get('category')
    
    if (categoryParam) {
      const categoryKey = categoryParam.toLowerCase().replace(/[^a-z0-9]/g, '-')
      if (['mens-wear', 'womens-wear', 'kids-wear'].includes(categoryKey)) {
        return categoryKey
      }
    }
    
    return 'all-products'
  }

  const categories: string[] = getCategoriesForMainCategory(getCurrentMainCategory())
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const sizeTypes = ['Regular', 'Petite', 'Tall', 'Plus']
  const colors = ['Black', 'White', 'Navy', 'Blue', 'Red', 'Pink', 'Green', 'Purple', 'Brown', 'Gray']

  // Prefer context products; fallback to localStorage or backend if empty
  useEffect(() => {
    const loadFallback = async () => {
      // If context already has products, use them
      if (Array.isArray(products) && products.length > 0) {
        setSourceProducts(products)
        return
      }

      // Try shared Dev Catalog written by CMS
      try {
        const dev = await getDevCatalog()
        const list = Array.isArray((dev as any)?.products) ? (dev as any).products : []
        if (list.length > 0) {
          setSourceProducts(list)
          return
        }
      } catch {}

      // Try localStorage shared by CMS Inventory
      const saved = localStorage.getItem('products')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSourceProducts(parsed)
            return
          }
        } catch {}
      }

      // As a last resort, fetch from backend by subcategory if present
      try {
        const params = new URLSearchParams(location.search)
        const sub = (params.get('subcategory') || '').toLowerCase()
        const fetchKey = sub || ''
        if (fetchKey) {
          try {
            const data: any = await getProductsByCategory(fetchKey)
            const list = Array.isArray(data?.products) ? data.products : (Array.isArray(data) ? data : [])
            if (Array.isArray(list) && list.length > 0) {
              setSourceProducts(list)
              return
            }
          } catch {}
        }
      } catch {}

      // If all else fails, keep empty
      setSourceProducts([])
    }

    loadFallback()
  }, [products, location.search])

  // Detect category from URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const categoryParam = searchParams.get('category')
    const subcategoryParam = searchParams.get('subcategory')
    
    // Prioritize subcategory if it exists and has a banner
    if (subcategoryParam) {
      const subcategoryKey = subcategoryParam.toLowerCase().replace(/[^a-z0-9]/g, '-')
      if (categoryBanners[subcategoryKey]) {
        setCurrentCategory(subcategoryKey)
        return
      }
    }
    
    // Fall back to main category derived from URL only
    if (categoryParam) {
      const categoryKey = categoryParam.toLowerCase().replace(/[^a-z0-9]/g, '-')
      
      if (categoryBanners[categoryKey]) {
        setCurrentCategory(categoryKey)
      } else {
        setCurrentCategory('all-products')
      }
    } else {
      // Default to All Products when no specific category is selected
      setCurrentCategory('all-products')
    }
  }, [location.search])

  useEffect(() => {
    let base = Array.isArray(sourceProducts) && sourceProducts.length > 0 ? sourceProducts : products
    let filtered = [...base]

    // Apply text search from URL ?search=
    const params = new URLSearchParams(location.search)
    const searchParam = (params.get('search') || '').trim().toLowerCase()
    if (searchParam) {
      filtered = filtered.filter((product: any) => {
        const name = (product.name || '').toLowerCase()
        const brand = (product.brand || '').toLowerCase()
        const category = (product.category || '').toLowerCase()
        const mainCategory = (product.mainCategory || '').toLowerCase()
        return (
          name.includes(searchParam) ||
          brand.includes(searchParam) ||
          category.includes(searchParam) ||
          mainCategory.includes(searchParam)
        )
      })
    }

    // Filter by current category if viewing a specific subcategory
    if (currentCategory && currentCategory !== 'all-products') {
      const categoryKey = currentCategory
      
      // When a sidebar category filter is selected (e.g., Jeans), let that override subcategory context
      const selectedFilterCategory = (filters.category || '').toLowerCase()
      const isMainContext = ['mens-wear', 'womens-wear', 'kids-wear'].includes(categoryKey)
      const shouldSkipSubcategoryNarrowing = selectedFilterCategory && !isMainContext && selectedFilterCategory !== categoryKey
      if (shouldSkipSubcategoryNarrowing) {
        // Skip narrowing by current subcategory and constrain by main category context
        const paramsMC = new URLSearchParams(location.search)
        const mainCategoryParam = (paramsMC.get('category') || '').toLowerCase().replace(/[^a-z0-9]/g, '-')
        if (['mens-wear','womens-wear','kids-wear'].includes(mainCategoryParam)) {
          filtered = filtered.filter(p => (p.mainCategory || '').toLowerCase() === mainCategoryParam)
          // On Women's Wear, also apply business rules (exclude T-Shirts and men’s jeans)
          if (mainCategoryParam === 'womens-wear') {
            filtered = filtered.filter(p => {
              const cat = (p.category || '').toLowerCase()
              if (cat === 't-shirts') return false
              if (cat === 'jeans' && isMenItem(p)) return false
              return true
            })
          }
        }
      } else {
      // Map category keys to product categories (matching the actual product category values)
      const categoryMapping: Record<string, string> = {
        't-shirts': 't-shirts',
        'shirts': 'shirts',
        'jeans': 'jeans',
        'pants': 'pants',
        'jackets': 'jackets',
        'sweaters': 'sweaters',
        'dresses': 'dresses',
        'blouses': 'blouses',
        'skirts': 'skirts',
        'shorts': 'shorts',
        'tops': 'tops',
        'bottoms': 'bottoms',
        'mens-wear': 'mens-wear',
        'womens-wear': 'womens-wear',
        'kids-wear': 'kids-wear'
      }
      
      const productCategory = categoryMapping[categoryKey]
      
      if (productCategory) {
        // For main categories, filter by mainCategory
        if (['mens-wear', 'womens-wear', 'kids-wear'].includes(productCategory)) {
          filtered = filtered.filter(product => (product.mainCategory || '').toLowerCase() === productCategory)

          // Business rule: On Women's Wear, exclude T-Shirts entirely and men's jeans
          if (productCategory === 'womens-wear') {
            filtered = filtered.filter(p => {
              const cat = (p.category || '').toLowerCase()
              if (cat === 't-shirts') return false
              if (cat === 'jeans' && isMenItem(p)) return false
              return true
            })
          }
        } else {
          // For subcategories, filter by category AND main category from URL
          const searchParams = new URLSearchParams(location.search)
          const mainCategoryParam = searchParams.get('category')
          
          filtered = filtered.filter(product => {
            const cat = (product.category || '').toLowerCase()
            const subcat = ((product as any).subcategory || '').toLowerCase()
            const name = (product.name || '').toLowerCase()
            const brand = (product.brand || '').toLowerCase()
            const tags = (((product as any).tags) || []) as string[]
            const allowedBottomCats = ['jeans','pants','bottoms','womenjeans']
              const isBottomCat = allowedBottomCats.includes(cat) || allowedBottomCats.includes(subcat)
              const nonBottomKeywords = ['jacket','coat','blazer','shirt','top','dress','skirt','short']
              const isNonBottomByName = nonBottomKeywords.some(k => name.includes(k))
              const jeansKeywordMatch = (
                name.includes('jean') || brand.includes('jean') || tags.some(t => (t || '').toLowerCase().includes('jean')) ||
                name.includes('denim') || brand.includes('denim') || tags.some(t => (t || '').toLowerCase().includes('denim'))
              )
              const params2 = new URLSearchParams(location.search)
              const currentMainKey2 = (params2.get('category') || '').toLowerCase().replace(/[^a-z0-9]/g, '-')
              const isMensContext2 = currentMainKey2 === 'mens-wear'
              const isWomensContext2 = currentMainKey2 === 'womens-wear'
              const looseJeansMatch = productCategory === 'jeans' && (
                (isBottomCat && jeansKeywordMatch) ||
                (isMensContext2 && jeansKeywordMatch && !isNonBottomByName) ||
                (isWomensContext2 && jeansKeywordMatch && !isNonBottomByName)
              )
            if (cat === productCategory || subcat === productCategory || looseJeansMatch) {
               // Extra guard: when viewing Jeans, exclude non-bottom items by name/category
               if (productCategory === 'jeans') {
                 const nameCheck = (product.name || '').toLowerCase()
                 const nonBottomKeywords = ['jacket','coat','blazer','shirt','top','dress','skirt','short']
                 const isNonBottomByName = nonBottomKeywords.some(k => nameCheck.includes(k))
                 if (isNonBottomByName || cat === 'jackets' || subcat === 'jackets') return false
               }
               // If we have a main category from URL, filter by it
               if (mainCategoryParam) {
                 const mainCategoryKey = mainCategoryParam.toLowerCase().replace(/[^a-z0-9]/g, '-')
                 const matchesMain = (product.mainCategory || '').toLowerCase() === mainCategoryKey
                 if (!matchesMain) return false
                 // Additional rule: for Women’s Wear → Jeans, exclude men's jeans
                 if (productCategory === 'jeans' && mainCategoryKey === 'womens-wear') {
                   if (isMenItem(product)) return false
                 }
                 // Additional rule: for Men’s Wear → Jeans, strictly include only men's items
                 if (productCategory === 'jeans' && mainCategoryKey === 'mens-wear') {
                   const mainCat = (product.mainCategory || '').toLowerCase()
                   if (mainCat !== 'mens-wear') return false
                   if (!isMenItem(product)) return false
                 }
                 return true
               }

               // Fallback: ensure subcategory belongs to appropriate main category
               const subcategoryToMainCategoryMap: Record<string, string[]> = {
                 // Allow Men's and Kids' T-Shirts when no main category is specified
                 't-shirts': ['mens-wear', 'kids-wear'],
                 'shirts': ['mens-wear'],
                 'jeans': ['mens-wear', 'womens-wear'], // Allow jeans in both, filter by gender
                 'pants': ['mens-wear', 'womens-wear'],
                 // Exclude jackets from women's wear
                 'jackets': ['mens-wear', 'kids-wear'],
                 'sweaters': ['mens-wear', 'womens-wear'],
                 'dresses': ['womens-wear'], // Only women's wear
                 'blouses': ['womens-wear'], // Only women's wear
                 'skirts': ['womens-wear'], // Only women's wear
                 // Exclude shorts from women's wear
                 'shorts': ['mens-wear', 'kids-wear'],
                 'tops': ['womens-wear', 'kids-wear'],
                 'bottoms': ['mens-wear', 'womens-wear', 'kids-wear']
               }
               
               const allowedMainCategories = subcategoryToMainCategoryMap[productCategory] || []
               return allowedMainCategories.includes((product.mainCategory || '').toLowerCase())
             }
             return false
          })
        }
      }
    }
    // Close the override guard block
    }

    // Targeted fallback: ensure Women’s Wear → Jeans shows women’s jeans
    const currentMainForJeans = getCurrentMainCategory()
    if (currentMainForJeans === 'womens-wear' && (filters.category || '').toLowerCase() === 'jeans') {
      filtered = (Array.isArray(base) ? base : products).filter(p => (
        ((p.category || '').toLowerCase() === 'jeans' || ((p as any).subcategory || '').toLowerCase() === 'jeans') &&
        ((p.mainCategory || '').toLowerCase() === 'womens-wear')
      ))
    }
    
    // Apply category filter universally when selected
    if (filters.category && filters.category.trim() !== '') {
      const selected = filters.category.toLowerCase()
      filtered = filtered.filter(product => {
        const category = (product.category || '').toLowerCase()
        const subcategory = ((product as any).subcategory || '').toLowerCase()
        let matchesCategory = category === selected || subcategory === selected
        // Treat womenjeans as jeans in Women’s Wear
        if (selected === 'jeans' && (category === 'womenjeans' || subcategory === 'womenjeans')) {
          matchesCategory = true
        }
          // Looser matching for Jeans: allow in Men's context even if category not set, still exclude non-bottoms
          if (selected === 'jeans' && !matchesCategory) {
            const name = (product.name || '').toLowerCase()
            const brand = (product.brand || '').toLowerCase()
            const tags = (((product as any).tags) || []) as string[]
            const allowedBottomCats = ['jeans','pants','bottoms','womenjeans']
            const isBottomCat = allowedBottomCats.includes(category) || allowedBottomCats.includes(subcategory)
            const hasJeansIndicator = name.includes('jean') || brand.includes('jean') || tags.some(t => (t || '').toLowerCase().includes('jean')) || name.includes('denim') || brand.includes('denim') || tags.some(t => (t || '').toLowerCase().includes('denim'))
            const nonBottomKeywords = ['jacket','coat','blazer','shirt','top','dress','skirt','short']
            const isNonBottomByName = nonBottomKeywords.some(k => name.includes(k))
            const currentMainCat2 = getCurrentMainCategory()
            if ((isBottomCat && hasJeansIndicator) ||
                (currentMainCat2 === 'mens-wear' && hasJeansIndicator && !isNonBottomByName) ||
                (currentMainCat2 === 'womens-wear' && hasJeansIndicator && !isNonBottomByName)) {
              matchesCategory = true
            }
          }
        if (!matchesCategory) return false
        // When filtering Jeans, exclude non-bottom items explicitly
        if (selected === 'jeans') {
          const nameCheck = (product.name || '').toLowerCase()
          const nonBottomKeywords = ['jacket','coat','blazer','shirt','top','dress','skirt','short']
          const isNonBottomByName = nonBottomKeywords.some(k => nameCheck.includes(k))
          if (isNonBottomByName || category === 'jackets' || subcategory === 'jackets') return false
        }
        // Context-aware T-Shirts filtering
        if (selected === 't-shirts') {
          const mainCat = (product.mainCategory || '').toLowerCase()
          const currentMain = getCurrentMainCategory()
          if (currentMain === 'all-products') {
            // Show both men's and kids' t-shirts in all-products
            return mainCat === 'mens-wear' || mainCat === 'kids-wear'
          }
          if (currentMain === 'mens-wear') {
            return mainCat === 'mens-wear'
          }
          if (currentMain === 'kids-wear') {
            return mainCat === 'kids-wear'
          }
          // For women's wear, T-Shirts are excluded by design
          return false
        }
        // Otherwise respect page context rule
        const currentMainCat = getCurrentMainCategory()
        if (currentMainCat === 'womens-wear') {
          if (selected === 'jeans') {
            return !(product.gender || '').toLowerCase().includes('men')
          }
        }
        if (currentMainCat === 'mens-wear') {
          if (selected === 'jeans') {
            const mainCat = (product.mainCategory || '').toLowerCase()
            return mainCat === 'mens-wear' && isMenItem(product)
          }
        }
        return true
      })
    }
    if (filters.size) {
      filtered = filtered.filter((product: ProductRow) => (product.sizes || []).includes(filters.size))
    }
    if (filters.color) {
      filtered = filtered.filter((product: ProductRow) => 
        (product.colors || []).some(color => (color || '').toLowerCase().includes(filters.color.toLowerCase()))
      )
    }

    // Sort products
    filtered.sort((a: ProductRow, b: ProductRow) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          // rating may not be on ProductRow; treat missing as 0
          const ar = (a as any).rating || 0
          const br = (b as any).rating || 0
          return br - ar
        case 'name':
          return a.name.localeCompare(b.name)
        case 'featured':
        default:
          return 0
      }
    })

    // Fallback: if Kids' Wear T-Shirts view is empty, pull from full context catalog
    const mainContext = getCurrentMainCategory()
    const isKidsTShirtsView = (mainContext === 'kids-wear') && (
      currentCategory === 't-shirts' || (filters.category || '') === 't-shirts'
    )
    if (isKidsTShirtsView && filtered.length === 0) {
      const catalogAll = Array.isArray(products) ? products : []
      const rescue = catalogAll.filter(p => (
        ((p.category || '').toLowerCase() === 't-shirts' || ((p as any).subcategory || '').toLowerCase() === 't-shirts') &&
        ((p.mainCategory || '').toLowerCase() === 'kids-wear')
      ))
      if (rescue.length > 0) {
        filtered = rescue
      }
    }

    // Rescue: if Women’s Wear Jeans view is empty, populate with women’s jeans
    const isWomensJeansView = (mainContext === 'womens-wear') && ((filters.category || '') === 'jeans')
    if (isWomensJeansView && filtered.length === 0) {
      const catalogAll = Array.isArray(products) ? products : []
      const rescue = catalogAll.filter(p => {
        const cat = (p.category || '').toLowerCase()
        const subcat = ((p as any).subcategory || '').toLowerCase()
        const main = (p.mainCategory || '').toLowerCase()
        const nameCheck = (p.name || '').toLowerCase()
        const nonBottomKeywords = ['jacket','coat','blazer','shirt','top','dress','skirt','short']
        const isNonBottomByName = nonBottomKeywords.some(k => nameCheck.includes(k))
        return (cat === 'jeans' || subcat === 'jeans') && main === 'womens-wear' && !isNonBottomByName
      })
      if (rescue.length > 0) {
        filtered = rescue
      }
    }

    // Final guard: ensure Men's Wear excludes any Kids' Wear items and women's items
    const contextMain = getCurrentMainCategory()
    if (contextMain === 'mens-wear') {
      const mensWearJeansBlocklistNames = ['jeans 4', 'jeans 5']
      filtered = filtered.filter(p => {
        const main = (p.mainCategory || '').toLowerCase()
        const g = (p.gender || '').toLowerCase()
        const n = (p.name || '').toLowerCase()
        const b = (p.brand || '').toLowerCase()
        const cat = (p.category || '').toLowerCase()
        const isKidsLike = g.includes('girl') || g.includes('boy') || /\bkids?\b/i.test(p.name || '') || n.includes('kid') || b.includes('kids')
        const isBlockedByName = cat === 'jeans' && mensWearJeansBlocklistNames.some(k => n.includes(k))
        return main === 'mens-wear' && !isKidsLike && isMenItem(p) && !isBlockedByName
      })
    }

    // Allow products without images; renderer shows a placeholder icon instead
    // Keep avoiding explicit placeholder URLs via sanitizeImageUrl during rendering.

    setFilteredProducts(filtered)
  }, [products, sourceProducts, filters, sortBy, currentCategory, location.search])

  const handleFilterChange = (key: keyof Filters, value: string) => {
    let processedValue = value
    
    // Convert display category names to product category format
    if (key === 'category') {
      const categoryNameMapping: Record<string, string> = {
        'T-Shirts': 't-shirts',
        'Shirts': 'shirts',
        'Jeans': 'jeans',
        'Pants': 'pants',
        'Jackets': 'jackets',
        'Sweaters': 'sweaters',
        'Dresses': 'dresses',
        'Blouses': 'blouses',
        'Skirts': 'skirts',
        'Shorts': 'shorts',
        'Tops': 'tops',
        'Bottoms': 'bottoms'
      }
      processedValue = categoryNameMapping[value] || value.toLowerCase()
    }
    
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === processedValue ? '' : processedValue
    }))
  }

  const toggleFilterExpansion = (filterKey: ExpandableFilterKey) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      category: '',
      size: '',
      sizeType: '',
      color: '',
      priceRange: ''
    })
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '').length
  }

  // Compute live stats for All Products banner using current catalog
  const catalog = Array.isArray(sourceProducts) && sourceProducts.length > 0 ? sourceProducts : products
  const totalProducts = Array.isArray(catalog) ? catalog.length : 0
  const lowStock = Array.isArray(catalog)
    ? catalog.filter((p: any) => {
        const stock = p && typeof p.stock === 'number' ? p.stock : 0
        const threshold = p && typeof p.lowStockThreshold === 'number' ? p.lowStockThreshold : 10
        return stock > 0 && stock <= threshold
      }).length
    : 0
  const outOfStock = Array.isArray(catalog)
    ? catalog.filter((p: any) => (p && typeof p.stock === 'number' ? p.stock : 0) === 0).length
    : 0
  const avgRatingVal = totalProducts > 0 && Array.isArray(catalog)
    ? (
        catalog.reduce((sum: number, p: any) => {
          const rating = p && typeof p.rating === 'number' ? p.rating : 0
          return sum + rating
        }, 0) / totalProducts
      ).toFixed(1)
    : '0.0'

  const currentBanner = categoryBanners[currentCategory] || categoryBanners['womens-wear']

  return (
    <div className="min-h-screen bg-white">
      {/* Category Banner */}
      <div className="relative min-h-[24rem] md:min-h-[28rem] lg:min-h-[30rem]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={sanitizeBannerUrl(currentBanner.image) ? { backgroundImage: `url(${sanitizeBannerUrl(currentBanner.image)})` } : {}}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${currentBanner.gradient} opacity-80`}></div>
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="w-full px-4 sm:px-6">
            <div className="flex flex-col items-center justify-center text-center text-white">
              <div className="mb-6">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
                  {currentBanner.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-95 font-medium max-w-3xl mx-auto leading-relaxed">
                  {currentBanner.description}
                </p>
              </div>
              
              {/* Statistics for All Products view */}
              {currentBanner.isAllProducts && currentBanner.stats && (
                <div className="w-full flex justify-center mb-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-full sm:max-w-3xl md:max-w-4xl px-2 sm:px-0">
                    <div className="bg-white bg-opacity-25 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20 shadow-lg hover:bg-opacity-30 transition-all duration-300 text-center">
                      <Package className="h-8 w-8 mx-auto mb-2 text-white drop-shadow-sm" />
                      <div className="text-2xl font-bold text-white drop-shadow-sm">{totalProducts}</div>
                      <div className="text-sm opacity-90 font-medium">Products</div>
                    </div>
                    <div className="bg-white bg-opacity-25 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20 shadow-lg hover:bg-opacity-30 transition-all duration-300 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-white drop-shadow-sm" />
                      <div className="text-2xl font-bold text-white drop-shadow-sm">{lowStock}</div>
                      <div className="text-sm opacity-90 font-medium">Low Stock</div>
                    </div>
                    <div className="bg-white bg-opacity-25 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20 shadow-lg hover:bg-opacity-30 transition-all duration-300 text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-white drop-shadow-sm" />
                      <div className="text-2xl font-bold text-white drop-shadow-sm">{outOfStock}</div>
                      <div className="text-sm opacity-90 font-medium">Out of Stock</div>
                    </div>
                    <div className="bg-white bg-opacity-25 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20 shadow-lg hover:bg-opacity-30 transition-all duration-300 text-center">
                      <Award className="h-8 w-8 mx-auto mb-2 text-white drop-shadow-sm" />
                      <div className="text-2xl font-bold text-white drop-shadow-sm">{avgRatingVal}</div>
                      <div className="text-sm opacity-90 font-medium">Avg Rating</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center w-full">
                <div className="bg-white bg-opacity-25 backdrop-blur-md rounded-xl px-6 py-3 border border-white border-opacity-20 shadow-lg">
                  <p className="text-white font-semibold text-lg drop-shadow-sm text-center">
                    Showing {filteredProducts.length} of {(Array.isArray(sourceProducts) && sourceProducts.length > 0 ? sourceProducts.length : products.length)} products
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {currentBanner.isAllProducts && (
              <div className="flex items-center space-x-2">
                <Link
                  to="/cms/products"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  title="Manage Products"
                >
                  Manage Products
                </Link>
                <button
                  onClick={clearCache}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  title="Refresh Catalog"
                >
                  Refresh Catalog
                </button>
              </div>
            )}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="featured">Featured</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Collections - Only show for All Products view */}
      {currentBanner.isAllProducts && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop by Category</h2>
              <p className="text-gray-600">Discover our most popular collections</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/products?category=mens-wear" className="group">
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 h-32 flex items-center justify-center text-white hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-1">Men's Wear</h3>
                    <p className="text-sm opacity-90">Latest trends & styles</p>
                  </div>
                </div>
              </Link>
              <Link to="/products?category=womens-wear" className="group">
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 h-32 flex items-center justify-center text-white hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-1">Women's Wear</h3>
                    <p className="text-sm opacity-90">Elegant & fashionable</p>
                  </div>
                </div>
              </Link>
              <Link to="/products?category=kids-wear" className="group">
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-green-400 to-blue-500 h-32 flex items-center justify-center text-white hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-1">Kids' Wear</h3>
                    <p className="text-sm opacity-90">Comfortable & playful</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-8">
              {/* Clear Filters */}
              {getActiveFiltersCount() > 0 && (
                <div className="mb-6">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All ({getActiveFiltersCount()})
                  </button>
                </div>
              )}

              {/* Shopping Tips - Only show for All Products view */}
              {currentBanner.isAllProducts && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Shopping Tips</h3>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Use filters to narrow down your search</li>
                    <li>• Check size guides for perfect fit</li>
                    <li>• Free shipping on orders over $50</li>
                    <li>• 30-day return policy</li>
                  </ul>
                </div>
              )}

              {/* Category Filter */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <button
                  onClick={() => toggleFilterExpansion('category')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-sm font-medium text-gray-900">Category</h3>
                  <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedFilters.category ? 'rotate-180' : ''}`} />
                </button>
                {expandedFilters.category && (
                  <div className="mt-4 space-y-3">
                    {categories.map((category: string) => {
                      // Convert display name to product category format for comparison
                      const categoryNameMapping: Record<string, string> = {
                        'T-Shirts': 't-shirts',
                        'Shirts': 'shirts',
                        'Jeans': 'jeans',
                        'Pants': 'pants',
                        'Jackets': 'jackets',
                        'Sweaters': 'sweaters',
                        'Dresses': 'dresses',
                        'Blouses': 'blouses',
                        'Skirts': 'skirts',
                        'Shorts': 'shorts',
                        'Tops': 'tops',
                        'Bottoms': 'bottoms'
                      }
                      const categoryValue = categoryNameMapping[category] || category.toLowerCase()
                      
                      return (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.category === categoryValue}
                            onChange={() => handleFilterChange('category', category)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">{category}</span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Size Filter */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <button
                  onClick={() => toggleFilterExpansion('size')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedFilters.size ? 'rotate-180' : ''}`} />
                </button>
                {expandedFilters.size && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleFilterChange('size', size)}
                        className={`px-3 py-2 text-sm border rounded-md text-center ${
                          filters.size === size
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Size Type Filter */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <button
                  onClick={() => toggleFilterExpansion('sizeType')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-sm font-medium text-gray-900">Size Type</h3>
                  <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedFilters.sizeType ? 'rotate-180' : ''}`} />
                </button>
                {expandedFilters.sizeType && (
                  <div className="mt-4 space-y-3">
                    {sizeTypes.map((sizeType) => (
                      <label key={sizeType} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.sizeType === sizeType}
                          onChange={() => handleFilterChange('sizeType', sizeType)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">{sizeType}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Color Filter */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <button
                  onClick={() => toggleFilterExpansion('color')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>
                  <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedFilters.color ? 'rotate-180' : ''}`} />
                </button>
                {expandedFilters.color && (
                  <div className="mt-4 space-y-3">
                    {colors.map((color) => (
                      <label key={color} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.color === color}
                          onChange={() => handleFilterChange('color', color)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">{color}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Trending Products - Only show for All Products view */}
            {currentBanner.isAllProducts && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">🔥 Trending Now</h2>
                  <span className="text-sm text-gray-500">Most popular this week</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {filteredProducts.slice(0, 4).map((product) => (
                    <Link key={product._id} to={`/products/${product._id}`} className="group">
                      <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg mb-2">
                        {sanitizeImageUrl(product.images?.[0]) ? (
                          <img
                            src={sanitizeImageUrl(product.images?.[0])}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Package className="h-10 w-10 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2">
                          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                            Trending
                          </span>
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm font-semibold text-gray-900">${Math.round(product.price)}</p>
                    </Link>
                  ))}
                </div>
                <hr className="border-gray-200 mb-6" />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product._id} className="group">
                  <Link to={`/products/${product._id}`}>
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-neutral-50 mb-3">
                      {sanitizeImageUrl(product.images?.[0]) ? (
                        <img
                          src={sanitizeImageUrl(product.images?.[0])}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                          <Package className="h-10 w-10 text-gray-300" />
                        </div>
                      )}
                      {product.isOnSale && (
                        <div className="absolute bottom-0 left-0 right-0 bg-primary-600 text-white text-xs py-1 text-center">
                          {product.isFinalSale ? 'FINAL SALE' : 'SALE'}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-1">
                      <h3 className="text-sm font-normal text-neutral-800 group-hover:text-primary-600">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-neutral-800">
                          ${Math.round(product.price)}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="ml-2 text-neutral-400 line-through text-xs">
                              ${Math.round(product.originalPrice)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products