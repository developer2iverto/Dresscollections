const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const details = (data && data.details) || null
    const detailMsg = Array.isArray(details) ? details.map((d: any) => d?.msg || d?.message).filter(Boolean).join('; ') : ''
    const baseMsg = (data && (data.error || data.message)) || `Request failed (${res.status})`
    const message = detailMsg ? `${baseMsg}: ${detailMsg}` : baseMsg
    const err: any = new Error(message)
    if (details) err.details = details
    throw err
  }
  return data
}

export function getUsers(params?: { page?: number; limit?: number; search?: string; role?: string }) {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.limit) query.set('limit', String(params.limit))
  if (params?.search) query.set('search', params.search)
  if (params?.role) query.set('role', params.role)
  const qs = query.toString()
  return apiFetch(`/users${qs ? `?${qs}` : ''}`)
}

export function postLogin(email: string, password: string) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    credentials: 'include'
  })
}

export function postRegister(firstName: string, lastName: string, email: string, phone: string, password: string) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, email, phone, password })
  })
}

export function getMe() {
  return apiFetch('/auth/me')
}

// Address management APIs
export interface AddressInput {
  type?: 'home' | 'work' | 'other'
  street: string
  city: string
  state: string
  zipCode: string
  country?: string
  isDefault?: boolean
}

export function addAddress(input: AddressInput) {
  return apiFetch('/users/addresses', {
    method: 'POST',
    body: JSON.stringify(input)
  })
}

export function updateAddress(addressId: string, input: Partial<AddressInput>) {
  return apiFetch(`/users/addresses/${addressId}`, {
    method: 'PUT',
    body: JSON.stringify(input)
  })
}

export function deleteAddress(addressId: string) {
  return apiFetch(`/users/addresses/${addressId}`, {
    method: 'DELETE'
  })
}

export function setDefaultAddress(addressId: string) {
  return apiFetch(`/users/addresses/${addressId}/default`, {
    method: 'PUT'
  })
}

export function getProducts(params?: { page?: number; limit?: number; category?: string }) {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.limit) query.set('limit', String(params.limit))
  if (params?.category) query.set('category', params.category)
  const qs = query.toString()
  return apiFetch(`/products${qs ? `?${qs}` : ''}`)
}

export function getProductsByCategory(category: string) {
  return apiFetch(`/products/category/${encodeURIComponent(category)}`)
}

export function createProduct(input: any) {
  return apiFetch('/products', { method: 'POST', body: JSON.stringify(input) })
}

export function updateProductApi(id: string, input: any) {
  return apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(input) })
}

export function deleteProductApi(id: string) {
  return apiFetch(`/products/${id}`, { method: 'DELETE' })
}

export function getProductById(id: string) {
  return apiFetch(`/products/${id}`)
}
// Dev catalog helpers for cross-port replication
export async function getDevCatalog() {
  return apiFetch('/dev/catalog')
}

export async function putDevCatalog(products: any[]) {
  return apiFetch('/dev/catalog', {
    method: 'PUT',
    body: JSON.stringify({ products }),
  })
}