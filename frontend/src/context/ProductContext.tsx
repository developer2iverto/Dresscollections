import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getDevCatalog, putDevCatalog } from '../utils/api'

export interface Product {
  _id: string
  name: string
  description?: string
  price: number
  originalPrice?: number | null
  images: string[]
  category: string
  mainCategory: string
  brand: string
  rating: number
  reviews: number
  sizes: string[]
  colors: string[]
  isOnSale: boolean
  isFinalSale: boolean
  stock?: number
  sku?: string
  material?: {
    primary: string
    composition: string
    blend: string[]
  }
  fit?: string
  gender?: string
  season?: string
  occasion?: string[]
  careInstructions?: string[]
  isActive?: boolean
  isFeatured?: boolean
  totalSales?: number
  lowStockThreshold?: number
  createdAt?: string
  updatedAt?: string
}

interface ProductContextType {
  products: Product[]
  loading: boolean
  error: string | null
  addProduct: (product: Omit<Product, '_id'>) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProduct: (id: string) => Product | undefined
  getProductsByCategory: (category: string) => Product[]
  getProductsByMainCategory: (mainCategory: string) => Product[]
  getFeaturedProducts: () => Product[]
  getProductsOnSale: () => Product[]
  searchProducts: (query: string) => Product[]
  refreshProducts: () => void
  clearCache: () => void
  applyOfferToAll: (offer: OfferInput) => void
  resetAllOffers: () => void
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

interface ProductProviderProps {
  children: ReactNode
}

// Lightweight offer type used by CMSOffers to apply promotions
export type OfferInput = {
  id?: string | number
  title?: string
  discountType: 'percentage' | 'fixed' | 'buy_x_get_y'
  discountValue: number
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeOffer, setActiveOffer] = useState<OfferInput | null>(null)
  const [promoOriginals, setPromoOriginals] = useState<Record<string, number>>({})

  // Initial product data (moved from Products.tsx)
  const initialProducts: Product[] = [
    // Women's T-Shirts
    {
      _id: '1',
      name: 'Classic Cotton T-Shirt',
      description: 'Comfortable and stylish cotton t-shirt perfect for everyday wear.',
      price: 22.99,
      originalPrice: 28.99,
      images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&auto=format&q=80'],
      category: 't-shirts',
      mainCategory: 'womens-wear',
      brand: 'StyleHub',
      rating: 4.4,
      reviews: 189,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['White', 'Black', 'Pink'],
      isOnSale: true,
      isFinalSale: false,
      stock: 45,
      sku: 'SH-WT-001',
      material: {
        primary: 'cotton',
        composition: '100% Organic Cotton',
        blend: ['cotton']
      },
      fit: 'regular',
      gender: 'women',
      season: 'all-season',
      occasion: ['casual', 'everyday'],
      isActive: true,
      isFeatured: true,
      totalSales: 189,
      lowStockThreshold: 10,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      _id: '2',
      name: 'Fitted V-Neck Tee',
      description: 'Flattering v-neck design with a fitted silhouette.',
      price: 26.99,
      originalPrice: null,
      images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop&auto=format&q=80'],
      category: 't-shirts',
      mainCategory: 'womens-wear',
      brand: 'FemmeStyle',
      rating: 4.6,
      reviews: 145,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Navy', 'White', 'Gray'],
      isOnSale: false,
      isFinalSale: false,
      stock: 32,
      sku: 'FS-VN-002',
      material: {
        primary: 'cotton',
        composition: '95% Cotton, 5% Elastane',
        blend: ['cotton', 'elastane']
      },
      fit: 'fitted',
      gender: 'women',
      season: 'all-season',
      occasion: ['casual', 'business'],
      isActive: true,
      isFeatured: false,
      totalSales: 145,
      lowStockThreshold: 10,
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-16T00:00:00Z'
    },
    {
      _id: '3',
      name: 'Oversized Graphic Tee',
      description: 'Trendy oversized fit with unique graphic design.',
      price: 24.99,
      originalPrice: 32.99,
      images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=500&fit=crop&auto=format&q=80'],
      category: 't-shirts',
      mainCategory: 'womens-wear',
      brand: 'UrbanVibes',
      rating: 4.3,
      reviews: 203,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Purple'],
      isOnSale: true,
      isFinalSale: false,
      stock: 28,
      sku: 'UV-GT-003',
      material: {
        primary: 'cotton',
        composition: '100% Cotton',
        blend: ['cotton']
      },
      fit: 'oversized',
      gender: 'women',
      season: 'all-season',
      occasion: ['casual', 'everyday'],
      isActive: true,
      isFeatured: false,
      totalSales: 203,
      lowStockThreshold: 10,
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-17T00:00:00Z'
    },
    // Men's Clothing
    {
      _id: '4',
      name: 'Premium Cotton T-Shirt',
      description: 'Experience ultimate comfort with our premium cotton t-shirt. Made from 100% organic cotton with a modern fit.',
      price: 29.99,
      originalPrice: 39.99,
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'
      ],
      category: 't-shirts',
      mainCategory: 'mens-wear',
      brand: 'StyleHub',
      rating: 4.8,
      reviews: 267,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Black', 'Navy', 'Gray'],
      isOnSale: true,
      isFinalSale: false,
      stock: 15,
      sku: 'SH-MT-004',
      material: {
        primary: 'cotton',
        composition: '100% Organic Cotton',
        blend: ['cotton']
      },
      fit: 'regular',
      gender: 'men',
      season: 'all-season',
      occasion: ['casual', 'everyday'],
      isActive: true,
      isFeatured: true,
      totalSales: 267,
      lowStockThreshold: 10,
      createdAt: '2024-01-04T00:00:00Z',
      updatedAt: '2024-01-18T00:00:00Z'
    },
    {
      _id: '5',
      name: 'Casual Button-Down Shirt',
      description: 'Versatile button-down shirt perfect for both casual and business casual occasions.',
      price: 49.99,
      originalPrice: null,
      images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop&auto=format&q=80'],
      category: 'shirts',
      mainCategory: 'mens-wear',
      brand: 'ClassicMen',
      rating: 4.5,
      reviews: 178,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Blue', 'Light Gray'],
      isOnSale: false,
      isFinalSale: false,
      stock: 22,
      sku: 'CM-BS-005',
      material: {
        primary: 'cotton',
        composition: '100% Cotton',
        blend: ['cotton']
      },
      fit: 'regular',
      gender: 'men',
      season: 'all-season',
      occasion: ['business', 'casual'],
      isActive: true,
      isFeatured: false,
      totalSales: 178,
      lowStockThreshold: 10,
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-19T00:00:00Z'
    },
    {
      _id: '6',
      name: 'Denim Jacket',
      description: 'Classic denim jacket with modern styling and comfortable fit.',
      price: 89.99,
      originalPrice: 109.99,
      images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop&auto=format&q=80'],
      category: 'jackets',
      mainCategory: 'mens-wear',
      brand: 'UrbanDenim',
      rating: 4.6,
      reviews: 156,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Classic Blue', 'Black', 'Light Wash'],
      isOnSale: true,
      isFinalSale: false,
      stock: 18,
      sku: 'UD-DJ-006',
      material: {
        primary: 'denim',
        composition: '100% Cotton Denim',
        blend: ['cotton']
      },
      fit: 'regular',
      gender: 'men',
      season: 'fall',
      occasion: ['casual', 'everyday'],
      isActive: true,
      isFeatured: true,
      totalSales: 156,
      lowStockThreshold: 10,
      createdAt: '2024-01-06T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    },
    // Additional Men's Shirts Collection
    {
      _id: '13',
      name: 'Oxford Dress Shirt',
      description: 'Crisp oxford shirt ideal for business casual and formal wear.',
      price: 59.99,
      originalPrice: 69.99,
      images: ['https://images.unsplash.com/photo-1520974735198-6f04d62a1bf0?w=400&h=500&fit=crop&auto=format&q=80'],
      category: 'shirts',
      mainCategory: 'mens-wear',
      brand: 'ClassicMen',
      rating: 4.4,
      reviews: 120,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Sky Blue', 'Light Gray'],
      isOnSale: true,
      isFinalSale: false,
      stock: 28,
      sku: 'CM-ODS-013',
      material: {
        primary: 'cotton',
        composition: '100% Cotton',
        blend: ['cotton']
      },
      fit: 'regular',
      gender: 'men',
      season: 'all-season',
      occasion: ['business', 'formal'],
      isActive: true,
      isFeatured: false,
      totalSales: 120,
      lowStockThreshold: 10,
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-10T00:00:00Z'
    },
    {
      _id: '14',
      name: 'Linen Summer Shirt',
      description: 'Breathable linen shirt perfect for warm weather and vacations.',
      price: 54.99,
      originalPrice: null,
      images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=500&fit=crop&auto=format&q=80'],
      category: 'shirts',
      mainCategory: 'mens-wear',
      brand: 'UrbanThreads',
      rating: 4.5,
      reviews: 96,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Beige', 'Sky Blue', 'Olive'],
      isOnSale: false,
      isFinalSale: false,
      stock: 32,
      sku: 'UT-LSS-014',
      material: {
        primary: 'linen',
        composition: '100% Linen',
        blend: ['linen']
      },
      fit: 'regular',
      gender: 'men',
      season: 'summer',
      occasion: ['casual', 'vacation'],
      isActive: true,
      isFeatured: true,
      totalSales: 96,
      lowStockThreshold: 8,
      createdAt: '2024-02-02T00:00:00Z',
      updatedAt: '2024-02-11T00:00:00Z'
    },
    {
      _id: '15',
      name: 'Plaid Flannel Shirt',
      description: 'Soft flannel shirt with classic plaid pattern for cozy layering.',
      price: 69.99,
      originalPrice: 79.99,
      images: ['https://images.unsplash.com/photo-1520975922203-b5f17b3f09a1?w=400&h=500&fit=crop&auto=format&q=80'],
      category: 'shirts',
      mainCategory: 'mens-wear',
      brand: 'StyleHub',
      rating: 4.7,
      reviews: 142,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Red Plaid', 'Blue Plaid', 'Green Plaid'],
      isOnSale: true,
      isFinalSale: false,
      stock: 26,
      sku: 'SH-PFS-015',
      material: {
        primary: 'cotton',
        composition: '100% Cotton Flannel',
        blend: ['cotton']
      },
      fit: 'regular',
      gender: 'men',
      season: 'fall',
      occasion: ['casual', 'outdoor'],
      isActive: true,
      isFeatured: true,
      totalSales: 142,
      lowStockThreshold: 10,
      createdAt: '2024-02-03T00:00:00Z',
      updatedAt: '2024-02-12T00:00:00Z'
    },
    {
      _id: '16',
      name: 'Stretch Slim-Fit Shirt',
      description: 'Modern slim-fit shirt with stretch for comfort and mobility.',
      price: 64.99,
      originalPrice: null,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&auto=format&q=80'],
      category: 'shirts',
      mainCategory: 'mens-wear',
      brand: 'ModernFit',
      rating: 4.6,
      reviews: 110,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'Navy', 'Charcoal'],
      isOnSale: false,
      isFinalSale: false,
      stock: 35,
      sku: 'MF-SSF-016',
      material: {
        primary: 'cotton',
        composition: '96% Cotton, 4% Elastane',
        blend: ['cotton', 'elastane']
      },
      fit: 'slim',
      gender: 'men',
      season: 'all-season',
      occasion: ['business', 'casual'],
      isActive: true,
      isFeatured: false,
      totalSales: 110,
      lowStockThreshold: 10,
      createdAt: '2024-02-04T00:00:00Z',
      updatedAt: '2024-02-13T00:00:00Z'
    },
    // Kids' Wear Products
    {
      _id: '7',
      name: 'Rainbow Princess Dress',
      description: 'Beautiful rainbow-colored dress perfect for special occasions and playtime.',
      price: 34.99,
      originalPrice: 42.99,
      images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=500&fit=crop&auto=format&q=80'],
      category: 'dresses',
      mainCategory: 'kids-wear',
      brand: 'KidsStyle',
      rating: 4.8,
      reviews: 95,
      sizes: ['2T', '3T', '4T', '5T', '6T'],
      colors: ['Rainbow', 'Pink', 'Purple'],
      isOnSale: true,
      isFinalSale: false,
      stock: 25,
      sku: 'KS-RPD-007',
      material: {
        primary: 'cotton',
        composition: '95% Cotton, 5% Elastane',
        blend: ['cotton', 'elastane']
      },
      fit: 'regular',
      gender: 'girls',
      season: 'spring',
      occasion: ['party', 'special-occasion'],
      isActive: true,
      isFeatured: true,
      totalSales: 95,
      lowStockThreshold: 5,
      createdAt: '2024-01-07T00:00:00Z',
      updatedAt: '2024-01-21T00:00:00Z'
    },
    {
      _id: '8',
      name: 'Floral Summer Dress',
      description: 'Light and airy floral dress perfect for summer days and outdoor activities.',
      price: 28.99,
      originalPrice: null,
      images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=500&fit=crop&auto=format&q=80'],
      category: 'dresses',
      mainCategory: 'kids-wear',
      brand: 'SunnyKids',
      rating: 4.6,
      reviews: 78,
      sizes: ['2T', '3T', '4T', '5T', '6T', '7T'],
      colors: ['Floral Pink', 'Floral Blue', 'Floral Yellow'],
      isOnSale: false,
      isFinalSale: false,
      stock: 30,
      sku: 'SK-FSD-008',
      material: {
        primary: 'cotton',
        composition: '100% Organic Cotton',
        blend: ['cotton']
      },
      fit: 'regular',
      gender: 'girls',
      season: 'summer',
      occasion: ['casual', 'outdoor'],
      isActive: true,
      isFeatured: false,
      totalSales: 78,
      lowStockThreshold: 8,
      createdAt: '2024-01-08T00:00:00Z',
      updatedAt: '2024-01-22T00:00:00Z'
    },
    {
      _id: '9',
      name: 'Unicorn Sparkle Dress',
      description: 'Magical unicorn-themed dress with sparkly details that kids absolutely love.',
      price: 39.99,
      originalPrice: 49.99,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop&auto=format&q=80'],
      category: 'dresses',
      mainCategory: 'kids-wear',
      brand: 'MagicKids',
      rating: 4.9,
      reviews: 124,
      sizes: ['2T', '3T', '4T', '5T', '6T'],
      colors: ['Unicorn White', 'Sparkle Pink', 'Magic Purple'],
      isOnSale: true,
      isFinalSale: false,
      stock: 20,
      sku: 'MK-USD-009',
      material: {
        primary: 'polyester',
        composition: '90% Polyester, 10% Spandex',
        blend: ['polyester', 'spandex']
      },
      fit: 'regular',
      gender: 'girls',
      season: 'all-season',
      occasion: ['party', 'costume', 'special-occasion'],
      isActive: true,
      isFeatured: true,
      totalSales: 124,
      lowStockThreshold: 5,
      createdAt: '2024-01-09T00:00:00Z',
      updatedAt: '2024-01-23T00:00:00Z'
    },
    {
      _id: '10',
      name: 'Kids Rainbow T-Shirt',
      description: 'Colorful rainbow t-shirt that brings joy and comfort to everyday wear.',
      price: 18.99,
      originalPrice: null,
      images: ['https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=400&h=500&fit=crop&auto=format&q=80'],
      category: 't-shirts',
      mainCategory: 'kids-wear',
      brand: 'RainbowKids',
      rating: 4.5,
      reviews: 67,
      sizes: ['2T', '3T', '4T', '5T', '6T', '7T'],
      colors: ['Rainbow', 'Blue Rainbow', 'Pink Rainbow'],
      isOnSale: false,
      isFinalSale: false,
      stock: 40,
      sku: 'RK-RT-010',
      material: {
        primary: 'cotton',
        composition: '100% Cotton',
        blend: ['cotton']
      },
      fit: 'regular',
      gender: 'unisex',
      season: 'all-season',
      occasion: ['casual', 'everyday'],
      isActive: true,
      isFeatured: false,
      totalSales: 67,
      lowStockThreshold: 10,
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-24T00:00:00Z'
    },
    {
      _id: '11',
      name: 'Denim Overall Dress',
      description: 'Classic denim overall dress that combines style and comfort for active kids.',
      price: 32.99,
      originalPrice: 38.99,
      images: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=500&fit=crop&auto=format&q=80'],
      category: 'dresses',
      mainCategory: 'kids-wear',
      brand: 'DenimKids',
      rating: 4.7,
      reviews: 89,
      sizes: ['2T', '3T', '4T', '5T', '6T', '7T'],
      colors: ['Classic Denim', 'Light Wash', 'Dark Wash'],
      isOnSale: true,
      isFinalSale: false,
      stock: 22,
      sku: 'DK-OD-011',
      material: {
        primary: 'denim',
        composition: '98% Cotton, 2% Elastane',
        blend: ['cotton', 'elastane']
      },
      fit: 'regular',
      gender: 'girls',
      season: 'fall',
      occasion: ['casual', 'school'],
      isActive: true,
      isFeatured: false,
      totalSales: 89,
      lowStockThreshold: 8,
      createdAt: '2024-01-11T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    },
    {
      _id: '12',
      name: 'Superhero Cape Dress',
      description: 'Empowering superhero-themed dress with detachable cape for imaginative play.',
      price: 36.99,
      originalPrice: null,
      images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop&auto=format&q=80'],
      category: 'dresses',
      mainCategory: 'kids-wear',
      brand: 'HeroKids',
      rating: 4.8,
      reviews: 112,
      sizes: ['2T', '3T', '4T', '5T', '6T'],
      colors: ['Hero Red', 'Hero Blue', 'Hero Purple'],
      isOnSale: false,
      isFinalSale: false,
      stock: 18,
      sku: 'HK-SCD-012',
      material: {
        primary: 'cotton',
        composition: '95% Cotton, 5% Spandex',
        blend: ['cotton', 'spandex']
      },
      fit: 'regular',
      gender: 'girls',
      season: 'all-season',
      occasion: ['costume', 'play', 'party'],
      isActive: true,
      isFeatured: true,
      totalSales: 112,
      lowStockThreshold: 5,
      createdAt: '2024-01-12T00:00:00Z',
      updatedAt: '2024-01-26T00:00:00Z'
    }
  ]

  // Ensure minimum products per category visible in filters
  const ensureMinimumProductsPerCategory = (baseProducts: Product[], targetPerCategory = 5): Product[] => {
    const wantedCategories = [
      'tops', 'bottoms', 'dresses', 't-shirts', 'shirts', 'jeans', 'pants', 'jackets', 'sweaters', 'blouses', 'skirts', 'shorts'
    ]

    const categoryToMainCategory: Record<string, 'mens-wear' | 'womens-wear' | 'kids-wear'> = {
      't-shirts': 'mens-wear',
      'shirts': 'mens-wear',
      'jeans': 'mens-wear',
      'pants': 'mens-wear',
      'jackets': 'mens-wear',
      'sweaters': 'mens-wear',
      'dresses': 'womens-wear',
      'blouses': 'womens-wear',
      'skirts': 'womens-wear',
      'tops': 'womens-wear',
      'bottoms': 'womens-wear',
      'shorts': 'kids-wear'
    }

    const result = [...baseProducts]

    const makeImageForCategory = (category: string, index: number) => {
      // Do not auto-generate placeholder images; leave empty in dev
      return ''
    }

    const generateProduct = (category: string, index: number): Product => {
      let mainCategory = categoryToMainCategory[category] || 'womens-wear'
      // For jeans, split between men's and women's to populate both sections
      if (category === 'jeans') {
        mainCategory = index % 2 === 0 ? 'womens-wear' : 'mens-wear'
      }
      // NEW: For t-shirts, split between men's and kids to ensure Kids' Wear has t-shirts
      if (category === 't-shirts') {
        mainCategory = index % 2 === 0 ? 'mens-wear' : 'kids-wear'
      }
      // Name reflects gender for jeans to avoid confusion in listings
      const baseName = category.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
      const name = category === 'jeans'
        ? `${mainCategory === 'mens-wear' ? 'Men' : 'Women'} ${baseName} ${index}`
        : `${baseName} ${index}`
      const id = `gen-${category}-${index}`
      const commonSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      const basePriceMap: Record<string, number> = {
        'tops': 29,
        'bottoms': 35,
        'dresses': 59,
        't-shirts': 19,
        'shirts': 39,
        'jeans': 49,
        'pants': 39,
        'jackets': 79,
        'sweaters': 59,
        'blouses': 45,
        'skirts': 39,
        'shorts': 24
      }
      const basePrice = basePriceMap[category] ?? 29
      const priceWhole = basePrice + (index - 1) * 2
      const originalWhole = priceWhole + 10
      return {
        _id: id,
        name,
        description: `Auto-generated ${category} sample product for catalog completeness`,
        price: priceWhole,
        originalPrice: originalWhole,
        images: [makeImageForCategory(category, index)],
        category,
        mainCategory,
        brand: 'StyleHub',
        rating: 4.2,
        reviews: 25 + index,
        sizes: commonSizes,
        colors: ['Black', 'White', 'Navy'],
        isOnSale: index % 2 === 0,
        isFinalSale: false,
        stock: 20 + index,
        sku: `AUTO-${category.toUpperCase()}-${index}`,
        material: {
          primary: 'cotton',
          composition: '100% Cotton',
          blend: ['cotton']
        },
        fit: 'regular',
        gender: mainCategory === 'mens-wear' ? 'men' : mainCategory === 'womens-wear' ? 'women' : 'unisex',
        season: 'all-season',
        occasion: ['casual', 'everyday'],
        isActive: true,
        isFeatured: false,
        totalSales: 0,
        lowStockThreshold: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }

    wantedCategories.forEach(cat => {
      const existing = result.filter(p => p.category === cat && p.isActive)

      // Do NOT override existing generated items — preserve admin edits.
      // Previously this block refreshed images/prices for generated IDs on each load,
      // which caused user-edited images to revert after page refresh.

      const missing = Math.max(0, targetPerCategory - existing.length)
      for (let i = 1; i <= missing; i++) {
        const candidate = generateProduct(cat, i)
        if (!result.some(p => p._id === candidate._id)) {
          result.push(candidate)
        }
      }
    })

    // Ensure distribution: guarantee at least one Men's Wear T-Shirts
    try {
      const menTShirts = result.filter(p => (
        (p.category || '').toLowerCase() === 't-shirts' &&
        (p.mainCategory || '').toLowerCase() === 'mens-wear' &&
        p.isActive
      ))
      if (menTShirts.length === 0) {
        // Use an even index to force 'mens-wear' for t-shirts in generateProduct
        let idx = 2
        while (result.some(p => p._id === `gen-t-shirts-${idx}`)) {
          idx += 2
        }
        const forcedMenTee = generateProduct('t-shirts', idx)
        // Defensive: if parity logic changes in future, force fields
        forcedMenTee.mainCategory = 'mens-wear'
        forcedMenTee.gender = 'men'
        result.push(forcedMenTee)
      }
    } catch (e) {
      console.warn('Distribution guard for Men\'s T-Shirts failed:', e)
    }

    return result
  }

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        // 1) Prefer shared Dev Catalog so admin changes replicate to storefront
        try {
          const dev = await getDevCatalog()
          const devList = Array.isArray((dev as any)?.products) ? (dev as any).products : []
          if (devList.length > 0) {
            const normalized = normalizeForMenWear(devList)
            setProducts(normalized)
            localStorage.setItem('products', JSON.stringify(normalized))
            setLoading(false)
            return
          }
        } catch {}

        // 2) Fallback to localStorage
        const stored = localStorage.getItem('products')
        if (stored) {
          let parsed = JSON.parse(stored) as Product[]

          // If Men’s T-Shirts are missing, enrich via ensureMinimumProductsPerCategory
          const hasMenTees = parsed.some(p => (
            (p.category || '').toLowerCase() === 't-shirts' &&
            (p.mainCategory || '').toLowerCase() === 'mens-wear' &&
            p.isActive
          ))
          const finalSet = hasMenTees ? parsed : ensureMinimumProductsPerCategory(parsed)

          setProducts(finalSet)
          localStorage.setItem('products', JSON.stringify(finalSet))
          setLoading(false)
          return
        }

        // 3) No storage: seed and save
        const seeded = ensureMinimumProductsPerCategory(initialProducts as Product[])
        setProducts(seeded)
        localStorage.setItem('products', JSON.stringify(seeded))
        setLoading(false)
      } catch (e) {
        console.error('Failed loading products; seeding fallback.', e)
        try {
          const seeded = ensureMinimumProductsPerCategory(initialProducts as Product[])
          setProducts(seeded)
          localStorage.setItem('products', JSON.stringify(seeded))
        } catch {}
        setError('Failed to load products')
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Save products to localStorage whenever products change
  useEffect(() => {
    if (products.length > 0) {
      try {
        localStorage.setItem('products', JSON.stringify(products))
      } catch {}
      // Also publish to shared dev catalog to replicate across ports
      try {
        putDevCatalog(products).catch(() => {})
      } catch {}
    }
  }, [products])

  const addProduct = (productData: Omit<Product, '_id'>) => {
    const allowedMainCategories = ['mens-wear', 'womens-wear', 'kids-wear'] as const

    const categoryToMainCategory: Record<string, (typeof allowedMainCategories)[number]> = {
      't-shirts': 'mens-wear',
      'shirts': 'mens-wear',
      'jeans': 'mens-wear',
      'pants': 'mens-wear',
      'jackets': 'mens-wear',
      'sweaters': 'mens-wear',
      'dresses': 'womens-wear',
      'blouses': 'womens-wear',
      'skirts': 'womens-wear',
      'tops': 'womens-wear',
      'bottoms': 'womens-wear',
      'shorts': 'kids-wear'
    }

    const commonSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    const defaultColors = ['Black', 'White', 'Navy']

    const normalizedCategory = (productData.category || '').toLowerCase()
    const mappedMain = categoryToMainCategory[normalizedCategory] || 'womens-wear'
    const inputMain = (productData.mainCategory || '').toLowerCase()
    const finalMainCategory = allowedMainCategories.includes(inputMain as any)
      ? (inputMain as (typeof allowedMainCategories)[number])
      : mappedMain

    const ensureArray = (arr?: string[]) => Array.isArray(arr) && arr.length > 0 ? arr : []

    const newProduct: Product = {
      ...productData,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalSales: 0,
      reviews: 0,
      rating: 0,
      // Defaults and normalization
      isActive: productData.isActive ?? true,
      isOnSale: productData.isOnSale ?? false,
      isFinalSale: productData.isFinalSale ?? false,
      mainCategory: finalMainCategory,
      sizes: ensureArray(productData.sizes).length > 0 ? ensureArray(productData.sizes) : commonSizes,
      colors: ensureArray(productData.colors).length > 0 ? ensureArray(productData.colors) : defaultColors,
      images: Array.isArray(productData.images) && productData.images.length > 0
        ? productData.images
        : []
    }

    setProducts(prev => [...prev, newProduct])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => 
        product._id === id 
          ? { ...product, ...updates, updatedAt: new Date().toISOString() }
          : product
      )
    )
  }

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product._id !== id))
  }

  // Apply a promotion to all products (simple global scope)
  const applyOfferToAll = (offer: OfferInput) => {
    setActiveOffer(offer)
    setProducts(prev => {
      const originals = { ...promoOriginals }
      const discounted = prev.map(p => {
        if (originals[p._id] === undefined) {
          originals[p._id] = p.price
        }
        let newPrice = p.price
        if (offer.discountType === 'percentage') {
          newPrice = Math.max(0, Math.round(originals[p._id] * (1 - offer.discountValue / 100)))
        } else if (offer.discountType === 'fixed') {
          newPrice = Math.max(0, Math.round(originals[p._id] - offer.discountValue))
        } else {
          // buy_x_get_y doesn't change unit price; mark as on sale
          newPrice = originals[p._id]
        }
        return {
          ...p,
          price: newPrice,
          isOnSale: true,
          originalPrice: p.originalPrice ?? originals[p._id]
        }
      })
      setPromoOriginals(originals)
      return discounted
    })
  }

  const resetAllOffers = () => {
    setActiveOffer(null)
    setProducts(prev => prev.map(p => {
      const original = promoOriginals[p._id]
      if (original !== undefined) {
        return { ...p, price: original, isOnSale: false }
      }
      return { ...p, isOnSale: false }
    }))
    setPromoOriginals({})
  }

  const getProduct = (id: string) => {
    return products.find(product => product._id === id)
  }

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category && product.isActive)
  }

  const getProductsByMainCategory = (mainCategory: string) => {
    return products.filter(product => product.mainCategory === mainCategory && product.isActive)
  }

  const getFeaturedProducts = () => {
    return products.filter(product => product.isFeatured && product.isActive)
  }

  const getProductsOnSale = () => {
    return products.filter(product => product.isOnSale && product.isActive)
  }

  const searchProducts = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return products.filter(product => 
      product.isActive && (
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.brand.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.mainCategory.toLowerCase().includes(lowercaseQuery)
      )
    )
  }

  const refreshProducts = () => {
    // Force reload products; normalize categories; seed if none exist
    try {
      // Prefer shared dev catalog for cross-port replication
      getDevCatalog().then((data: any) => {
        const list = Array.isArray(data?.products) ? data.products : []
        if (list.length > 0) {
          const normalized = normalizeForMenWear(list)
          setProducts(normalized)
          try { localStorage.setItem('products', JSON.stringify(normalized)) } catch {}
          return
        }
        // Fallback to localStorage if dev catalog empty
        const savedProducts = localStorage.getItem('products')
        const parsed = savedProducts ? JSON.parse(savedProducts) : []
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = normalizeForMenWear(parsed)
          setProducts(normalized)
          try { localStorage.setItem('products', JSON.stringify(normalized)) } catch {}
        } else {
          const seeded = ensureMinimumProductsPerCategory([], 5)
          const normalizedSeed = normalizeForMenWear(seeded)
          setProducts(normalizedSeed)
          localStorage.setItem('products', JSON.stringify(normalizedSeed))
        }
      }).catch(() => {
        // If dev catalog fetch fails, fallback to existing behavior
        const savedProducts = localStorage.getItem('products')
        const parsed = savedProducts ? JSON.parse(savedProducts) : []
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = normalizeForMenWear(parsed)
          setProducts(normalized)
          try { localStorage.setItem('products', JSON.stringify(normalized)) } catch {}
        } else {
          const seeded = ensureMinimumProductsPerCategory([], 5)
          const normalizedSeed = normalizeForMenWear(seeded)
          setProducts(normalizedSeed)
          localStorage.setItem('products', JSON.stringify(normalizedSeed))
        }
      })
    } catch (err) {
      console.error('Failed to refresh products, seeding defaults', err)
    }
  }

  const normalizeForMenWear = (items: any[]) => {
    const list = (Array.isArray(items) ? items : []).map((p) => {
      const cat = (p.category || '').toLowerCase()
      let gender = (p.gender || '').toLowerCase()
      let mc = (p.mainCategory || '').toLowerCase()
      const name = (p.name || '').toLowerCase()

      // Infer gender from product name when not provided
      if (!gender) {
        if (name.includes('men')) gender = 'men'
        else if (name.includes('women') || name.includes('lady') || name.includes('ladies')) gender = 'women'
        else if (name.includes('kid') || name.includes('boys') || name.includes('girls')) gender = 'kids'
      }

      // If mainCategory missing, derive from category and gender
      if (!mc) {
        const categoryToMainCategory: Record<string, 'mens-wear' | 'womens-wear' | 'kids-wear'> = {
          't-shirts': 'mens-wear',
          'shirts': 'mens-wear',
          'jeans': 'mens-wear',
          'pants': 'mens-wear',
          'jackets': 'mens-wear',
          'sweaters': 'mens-wear',
          'dresses': 'womens-wear',
          'blouses': 'womens-wear',
          'skirts': 'womens-wear',
          'tops': 'womens-wear',
          'bottoms': 'womens-wear',
          'shorts': 'kids-wear'
        }
        // Special handling
        if (cat === 'jeans') {
          mc = gender === 'women' ? 'womens-wear' : 'mens-wear'
        } else if (cat === 't-shirts') {
          // Route t-shirts to men or kids depending on gender
          mc = gender === 'kids' ? 'kids-wear' : 'mens-wear'
        } else {
          mc = categoryToMainCategory[cat] || mc || ''
        }
      }

      return { ...p, mainCategory: mc, gender }
    })

    return list
  }

  const clearCache = () => {
    try {
      localStorage.removeItem('products')
      // Do not regenerate sample products; leave catalog empty until admin adds.
      setProducts([])
    } catch (err) {
      console.error('Error clearing cache:', err)
    }
  }

  const value: ProductContextType = {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProductsByCategory,
    getProductsByMainCategory,
    getFeaturedProducts,
    getProductsOnSale,
    searchProducts,
    refreshProducts,
    clearCache,
    applyOfferToAll,
    resetAllOffers
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}