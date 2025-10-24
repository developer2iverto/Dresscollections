export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  rating: number
  reviews: number
  category: string
  subcategory: string
  description: string
  material: {
    primary: string
    secondary?: string
    composition: string
  }
  fit: string
  gender: string
  ageGroup: string
  season: string[]
  occasion: string[]
  sizes: Array<{
    size: string
    stock: number
    price?: number
  }>
  colors: Array<{
    name: string
    hex: string
    images: string[]
    stock: number
  }>
  careInstructions: string[]
  modelInfo: {
    height: string
    size: string
    measurements: string
  }
  features: string[]
  brand: string
  sku: string
  inStock: boolean
  isNew?: boolean
  isOnSale?: boolean
}

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Elegant Cotton Kurti',
    price: 45.99,
    originalPrice: 59.99,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
      'https://placehold.co/500x500?text=Product+Image',
      'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e5?w=500'
    ],
    rating: 4.5,
    reviews: 128,
    category: 'womens-wear',
    subcategory: 'kurtis',
    description: 'A beautiful and comfortable cotton kurti perfect for everyday wear and casual occasions. Features elegant embroidery and a flattering A-line cut.',
    material: {
      primary: 'Cotton',
      composition: '100% Pure Cotton'
    },
    fit: 'A-line',
    gender: 'Women',
    ageGroup: 'Adult',
    season: ['Spring', 'Summer', 'Fall'],
    occasion: ['Casual', 'Work', 'Festival'],
    sizes: [
      { size: 'XS', stock: 15 },
      { size: 'S', stock: 25 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 8 },
      { size: 'XXL', stock: 5 }
    ],
    colors: [
      {
        name: 'Royal Blue',
        hex: '#1e3a8a',
        images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500'],
        stock: 40
      },
      {
        name: 'Emerald Green',
        hex: '#059669',
        images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500'],
        stock: 35
      },
      {
        name: 'Maroon',
        hex: '#7f1d1d',
        images: ['https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e5?w=500'],
        stock: 45
      }
    ],
    careInstructions: [
      'Machine wash cold',
      'Gentle cycle',
      'Do not bleach',
      'Iron on medium heat'
    ],
    modelInfo: {
      height: '5\'5"',
      size: 'M',
      measurements: 'Bust: 36", Waist: 30", Length: 42"'
    },
    features: ['Pure Cotton', 'Embroidered', 'A-line cut', 'Three-quarter sleeves'],
    brand: 'StyleHub Ethnic',
    sku: 'SH-KT-001',
    inStock: true,
    isOnSale: true
  },
  {
    id: '2',
    name: 'Comfortable Palazzo Pants',
    price: 32.99,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500',
      'https://images.unsplash.com/photo-1506629905607-c60f6c3e7db1?w=500'
    ],
    rating: 4.8,
    reviews: 89,
    category: 'womens-wear',
    subcategory: 'pants',
    description: 'Flowy and comfortable palazzo pants perfect for casual wear and summer outings. Made from breathable fabric with an elastic waistband.',
    material: {
      primary: 'Rayon',
      secondary: 'Cotton',
      composition: '70% Rayon, 30% Cotton'
    },
    fit: 'Wide Leg',
    gender: 'Women',
    ageGroup: 'Adult',
    season: ['Spring', 'Summer'],
    occasion: ['Casual', 'Beach', 'Vacation'],
    sizes: [
      { size: 'XS', stock: 8 },
      { size: 'S', stock: 12 },
      { size: 'M', stock: 18 },
      { size: 'L', stock: 15 },
      { size: 'XL', stock: 10 },
      { size: 'XXL', stock: 6 }
    ],
    colors: [
      {
        name: 'Navy Blue',
        hex: '#1e3a8a',
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500'],
        stock: 30
      },
      {
        name: 'Black',
        hex: '#000000',
        images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500'],
        stock: 25
      },
      {
        name: 'Olive Green',
        hex: '#6b7280',
        images: ['https://placehold.co/500x500?text=Olive+Green'],
        stock: 28
      }
    ],
    careInstructions: [
      'Hand wash cold',
      'Hang to dry',
      'Do not bleach',
      'Iron on low heat if needed'
    ],
    modelInfo: {
      height: '5\'6"',
      size: 'S',
      measurements: 'Waist: 28", Hips: 38", Length: 40"'
    },
    features: ['Breathable fabric', 'Elastic waistband', 'Side pockets', 'Flowy design'],
    brand: 'StyleHub Comfort',
    sku: 'SH-PP-002',
    inStock: true,
    isNew: true
  },
  {
    id: '3',
    name: 'Kids Rainbow Hoodie',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=500',
    images: [
      'https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=500',
      'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500'
    ],
    rating: 4.6,
    reviews: 45,
    category: 'kids-wear',
    subcategory: 'hoodies',
    description: 'A cozy and colorful hoodie for kids. Features a fun rainbow design and soft fleece lining for extra warmth.',
    material: {
      primary: 'Cotton',
      secondary: 'Polyester',
      composition: '80% Cotton, 20% Polyester'
    },
    fit: 'Regular',
    gender: 'Unisex',
    ageGroup: 'Kids',
    season: ['Fall', 'Winter', 'Spring'],
    occasion: ['School', 'Play', 'Casual'],
    sizes: [
      { size: '4T', stock: 10 },
      { size: '5T', stock: 12 },
      { size: '6', stock: 15 },
      { size: '7', stock: 18 },
      { size: '8', stock: 14 },
      { size: '10', stock: 12 },
      { size: '12', stock: 8 }
    ],
    colors: [
      {
        name: 'Rainbow Multi',
        hex: '#ff6b6b',
        images: ['https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=500'],
        stock: 45
      },
      {
        name: 'Purple',
        hex: '#9c88ff',
        images: ['https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500'],
        stock: 35
      }
    ],
    careInstructions: [
      'Machine wash warm',
      'Tumble dry medium',
      'Do not bleach',
      'Iron on medium heat'
    ],
    modelInfo: {
      height: '4\'2"',
      size: '8',
      measurements: 'Age 8-9 years'
    },
    features: ['Fleece lined', 'Kangaroo pocket', 'Drawstring hood', 'Ribbed cuffs'],
    brand: 'StyleHub Kids',
    sku: 'SH-KH-003',
    inStock: true,
    isNew: true
  },
  {
    id: '4',
    name: 'Girls Floral Summer Dress',
    price: 28.99,
    originalPrice: 35.99,
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500'
    ],
    rating: 4.7,
    reviews: 67,
    category: 'kids-wear',
    subcategory: 'dresses',
    description: 'Beautiful floral print dress perfect for summer occasions. Features a comfortable fit and vibrant colors that kids love.',
    material: {
      primary: 'Cotton',
      secondary: 'Elastane',
      composition: '95% Cotton, 5% Elastane'
    },
    fit: 'A-line',
    gender: 'Girls',
    ageGroup: 'Kids',
    season: ['Spring', 'Summer'],
    occasion: ['Party', 'School', 'Casual'],
    sizes: [
      { size: '4T', stock: 12 },
      { size: '5T', stock: 15 },
      { size: '6', stock: 18 },
      { size: '7', stock: 20 },
      { size: '8', stock: 16 },
      { size: '10', stock: 14 },
      { size: '12', stock: 10 }
    ],
    colors: [
      {
        name: 'Pink Floral',
        hex: '#f472b6',
        images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500'],
        stock: 50
      },
      {
        name: 'Blue Floral',
        hex: '#60a5fa',
        images: ['https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500'],
        stock: 45
      }
    ],
    careInstructions: [
      'Machine wash cold',
      'Gentle cycle',
      'Do not bleach',
      'Iron on low heat'
    ],
    modelInfo: {
      height: '4\'0"',
      size: '7',
      measurements: 'Age 6-7 years'
    },
    features: ['Floral print', 'Comfortable fit', 'Easy care', 'Vibrant colors'],
    brand: 'StyleHub Kids',
    sku: 'SH-KD-004',
    inStock: true,
    isOnSale: true
  },
  {
    id: '5',
    name: 'Kids Cotton T-Shirt',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500',
      'https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=500'
    ],
    rating: 4.5,
    reviews: 89,
    category: 'kids-wear',
    subcategory: 't-shirts',
    description: 'Soft and comfortable cotton t-shirt for everyday wear. Perfect for school, play, and casual outings.',
    material: {
      primary: 'Cotton',
      composition: '100% Organic Cotton'
    },
    fit: 'Regular',
    gender: 'Unisex',
    ageGroup: 'Kids',
    season: ['Spring', 'Summer', 'Fall'],
    occasion: ['School', 'Play', 'Casual'],
    sizes: [
      { size: '4T', stock: 20 },
      { size: '5T', stock: 25 },
      { size: '6', stock: 30 },
      { size: '7', stock: 28 },
      { size: '8', stock: 25 },
      { size: '10', stock: 22 },
      { size: '12', stock: 18 }
    ],
    colors: [
      {
        name: 'Red',
        hex: '#ef4444',
        images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500'],
        stock: 75
      },
      {
        name: 'Blue',
        hex: '#3b82f6',
        images: ['https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=500'],
        stock: 73
      }
    ],
    careInstructions: [
      'Machine wash warm',
      'Tumble dry low',
      'Do not bleach',
      'Iron on medium heat'
    ],
    modelInfo: {
      height: '4\'1"',
      size: '8',
      measurements: 'Age 7-8 years'
    },
    features: ['100% Cotton', 'Soft fabric', 'Durable', 'Easy care'],
    brand: 'StyleHub Kids',
    sku: 'SH-KT-005',
    inStock: true,
    isNew: false
  },
  {
    id: '6',
    name: 'Kids Denim Shorts',
    price: 22.99,
    originalPrice: 28.99,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500'
    ],
    rating: 4.4,
    reviews: 56,
    category: 'kids-wear',
    subcategory: 'shorts',
    description: 'Comfortable denim shorts perfect for summer activities. Features adjustable waist and durable construction.',
    material: {
      primary: 'Denim',
      secondary: 'Cotton',
      composition: '98% Cotton, 2% Elastane'
    },
    fit: 'Regular',
    gender: 'Unisex',
    ageGroup: 'Kids',
    season: ['Spring', 'Summer'],
    occasion: ['Play', 'Casual', 'School'],
    sizes: [
      { size: '4T', stock: 15 },
      { size: '5T', stock: 18 },
      { size: '6', stock: 22 },
      { size: '7', stock: 25 },
      { size: '8', stock: 20 },
      { size: '10', stock: 18 },
      { size: '12', stock: 15 }
    ],
    colors: [
      {
        name: 'Light Blue',
        hex: '#93c5fd',
        images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500'],
        stock: 65
      },
      {
        name: 'Dark Blue',
        hex: '#1e40af',
        images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500'],
        stock: 68
      }
    ],
    careInstructions: [
      'Machine wash cold',
      'Tumble dry low',
      'Do not bleach',
      'Iron on medium heat'
    ],
    modelInfo: {
      height: '4\'3"',
      size: '8',
      measurements: 'Age 7-8 years'
    },
    features: ['Adjustable waist', 'Durable denim', 'Multiple pockets', 'Comfortable fit'],
    brand: 'StyleHub Kids',
    sku: 'SH-KS-006',
    inStock: true,
    isOnSale: true
  },
  {
    id: '7',
    name: 'Kids Cargo Pants',
    price: 32.99,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500',
      'https://images.unsplash.com/photo-1506629905607-c60f6c3e7db1?w=500'
    ],
    rating: 4.6,
    reviews: 42,
    category: 'kids-wear',
    subcategory: 'pants',
    description: 'Durable cargo pants with multiple pockets. Perfect for active kids who need functional and comfortable clothing.',
    material: {
      primary: 'Cotton',
      secondary: 'Polyester',
      composition: '65% Cotton, 35% Polyester'
    },
    fit: 'Regular',
    gender: 'Unisex',
    ageGroup: 'Kids',
    season: ['Fall', 'Winter', 'Spring'],
    occasion: ['School', 'Play', 'Outdoor'],
    sizes: [
      { size: '4T', stock: 12 },
      { size: '5T', stock: 15 },
      { size: '6', stock: 18 },
      { size: '7', stock: 20 },
      { size: '8', stock: 22 },
      { size: '10', stock: 18 },
      { size: '12', stock: 15 }
    ],
    colors: [
      {
        name: 'Khaki',
        hex: '#a3a3a3',
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500'],
        stock: 60
      },
      {
        name: 'Olive Green',
        hex: '#65a30d',
        images: ['https://images.unsplash.com/photo-1506629905607-c60f6c3e7db1?w=500'],
        stock: 60
      }
    ],
    careInstructions: [
      'Machine wash warm',
      'Tumble dry medium',
      'Do not bleach',
      'Iron on medium heat'
    ],
    modelInfo: {
      height: '4\'4"',
      size: '10',
      measurements: 'Age 9-10 years'
    },
    features: ['Multiple cargo pockets', 'Durable fabric', 'Adjustable waist', 'Reinforced knees'],
    brand: 'StyleHub Kids',
    sku: 'SH-KP-007',
    inStock: true,
    isNew: true
  },
  {
    id: '8',
    name: 'Kids Winter Jacket',
    price: 45.99,
    originalPrice: 55.99,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500'
    ],
    rating: 4.8,
    reviews: 73,
    category: 'kids-wear',
    subcategory: 'jackets',
    description: 'Warm and cozy winter jacket with hood. Features water-resistant material and soft fleece lining for maximum comfort.',
    material: {
      primary: 'Polyester',
      secondary: 'Cotton',
      composition: '100% Polyester shell, Fleece lining'
    },
    fit: 'Regular',
    gender: 'Unisex',
    ageGroup: 'Kids',
    season: ['Fall', 'Winter'],
    occasion: ['School', 'Outdoor', 'Casual'],
    sizes: [
      { size: '4T', stock: 10 },
      { size: '5T', stock: 12 },
      { size: '6', stock: 15 },
      { size: '7', stock: 18 },
      { size: '8', stock: 20 },
      { size: '10', stock: 16 },
      { size: '12', stock: 12 }
    ],
    colors: [
      {
        name: 'Navy Blue',
        hex: '#1e3a8a',
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'],
        stock: 50
      },
      {
        name: 'Red',
        hex: '#dc2626',
        images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500'],
        stock: 53
      }
    ],
    careInstructions: [
      'Machine wash cold',
      'Gentle cycle',
      'Do not bleach',
      'Air dry recommended'
    ],
    modelInfo: {
      height: '4\'5"',
      size: '10',
      measurements: 'Age 9-10 years'
    },
    features: ['Water-resistant', 'Fleece lined', 'Hood with drawstring', 'Multiple pockets'],
    brand: 'StyleHub Kids',
    sku: 'SH-KJ-008',
    inStock: true,
    isOnSale: true
  }

]

export const categories = [
  {
    id: 'mens-wear',
    name: "Men's Wear",
    description: 'Stylish and comfortable clothing for men',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
    subcategories: ['t-shirts', 'shirts', 'jeans', 'pants', 'jackets', 'sweaters', 'shorts', 'suits']
  },
  {
    id: 'womens-wear',
    name: "Women's Wear",
    description: 'Fashion-forward clothing for women',
    image: 'https://images.unsplash.com/photo-1494790108755-2616c9c0e4b5?w=500',
    subcategories: ['dresses', 't-shirts', 'blouses', 'jeans', 'skirts', 'jackets', 'sweaters', 'pants']
  },
  {
    id: 'kids-wear',
    name: "Kids' Wear",
    description: 'Fun and comfortable clothing for children',
    image: 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=500',
    subcategories: ['t-shirts', 'dresses', 'pants', 'shorts', 'jackets', 'hoodies', 'pajamas']
  },

]

export const brands = [
  'StyleHub Essentials',
  'StyleHub Collection',
  'StyleHub Kids',
  'Urban Threads',
  'Classic Comfort',
  'Modern Minimalist',
  'Trendy Basics'
]

export const materials = [
  'Cotton',
  'Polyester',
  'Viscose',
  'Linen',
  'Wool',
  'Silk',
  'Denim',
  'Leather',
  'Cashmere',
  'Bamboo'
]

export const fits = [
  'Slim',
  'Regular',
  'Relaxed',
  'Oversized',
  'A-line',
  'Straight',
  'Skinny',
  'Bootcut',
  'Wide Leg'
]

export const occasions = [
  'Casual',
  'Work',
  'Formal',
  'Party',
  'Date Night',
  'Weekend',
  'Vacation',
  'Sports',
  'School',
  'Travel'
]

export const seasons = [
  'Spring',
  'Summer',
  'Fall',
  'Winter',
  'All Season'
]