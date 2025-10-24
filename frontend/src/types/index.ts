export interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  brand: string
  stock: number
  rating: number
  reviews: Review[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Review {
  _id: string
  user: User
  rating: number
  comment: string
  createdAt: string
}

export interface User {
  _id: string
  name: string
  email: string
  avatar?: string
}

export interface CartItem {
  product: Product
  quantity: number
  size?: string
  color?: string
}

export interface Order {
  _id: string
  user: User
  items: CartItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: Address
  paymentMethod: string
  paymentStatus: 'pending' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  image: string
  description?: string
}