import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { CreditCard, Truck, Shield, MapPin, Edit, Trash2, Plus, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { addAddress, updateAddress, deleteAddress, setDefaultAddress, type AddressInput } from '../utils/api'

const Checkout = () => {
  const { state, clearCart } = useCart()
  const { user, refreshUser } = useAuth()
  const [step, setStep] = useState(1)
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string>('')
  const [addressForm, setAddressForm] = useState<AddressInput>({
    type: 'home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false
  })
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Order Notes
    notes: ''
  })

  // Prefill shipping fields from authenticated user
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || user.firstName || '',
        lastName: prev.lastName || user.lastName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }))
      // select default address if present
      const defaultAddr = (user.addresses || []).find(a => a.isDefault)
      const firstAddr = (user.addresses || [])[0]
      const initial = defaultAddr || firstAddr
      if (initial) {
        setSelectedAddressId(initial._id || '')
        setFormData(prev => ({
          ...prev,
          address: initial.street || '',
          city: initial.city || '',
          state: initial.state || '',
          zipCode: initial.zipCode || '',
          country: initial.country || prev.country
        }))
      }
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAddressForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId)
    const addr = (user?.addresses || []).find(a => (a._id || '') === addressId)
    if (addr) {
      setFormData(prev => ({
        ...prev,
        address: addr.street || '',
        city: addr.city || '',
        state: addr.state || '',
        zipCode: addr.zipCode || '',
        country: addr.country || prev.country
      }))
    }
  }

  const resetAddressForm = () => {
    setAddressForm({ type: 'home', street: '', city: '', state: '', zipCode: '', country: 'India', isDefault: false })
    setEditingAddressId('')
    setIsEditing(false)
  }

  const startAddAddress = () => {
    resetAddressForm()
    setShowAddressForm(true)
  }

  const startEditAddress = (addressId: string) => {
    const addr = (user?.addresses || []).find(a => (a._id || '') === addressId)
    if (addr) {
      setAddressForm({
        type: addr.type || 'home',
        street: addr.street || '',
        city: addr.city || '',
        state: addr.state || '',
        zipCode: addr.zipCode || '',
        country: addr.country || 'India',
        isDefault: !!addr.isDefault
      })
      setEditingAddressId(addressId)
      setIsEditing(true)
      setShowAddressForm(true)
    }
  }

  const submitAddressForm = async () => {
    try {
      if (isEditing && editingAddressId) {
        await updateAddress(editingAddressId, addressForm)
      } else {
        const res = await addAddress(addressForm)
        const newId = res?.address?._id || ''
        setSelectedAddressId(newId)
      }
      await refreshUser()
      setShowAddressForm(false)
    } catch (err) {
      alert((err as Error)?.message || 'Failed to save address')
    }
  }

  const removeAddress = async (addressId: string) => {
    if (!confirm('Remove this address?')) return
    try {
      await deleteAddress(addressId)
      await refreshUser()
      if (selectedAddressId === addressId) {
        setSelectedAddressId('')
      }
    } catch (err) {
      alert((err as Error)?.message || 'Failed to delete address')
    }
  }

  const makeDefault = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId)
      await refreshUser()
    } catch (err) {
      alert((err as Error)?.message || 'Failed to set default')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically process the payment
    alert('Order placed successfully! (This is a demo)')
    clearCart()
    setStep(4) // Success step
  }

  const subtotal = state.total
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (state.items.length === 0 && step !== 4) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600">Add items to your cart before checkout</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {[
            { number: 1, title: 'Shipping' },
            { number: 2, title: 'Payment' },
            { number: 3, title: 'Review' },
            { number: 4, title: 'Complete' }
          ].map((stepItem) => (
            <div key={stepItem.number} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepItem.number
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepItem.number}
              </div>
              <span className={`ml-2 text-sm ${step >= stepItem.number ? 'text-primary-600' : 'text-gray-500'}`}>
                {stepItem.title}
              </span>
              {stepItem.number < 4 && (
                <div className={`w-16 h-0.5 ml-4 ${step > stepItem.number ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Information
                </h2>

                {/* Saved Addresses */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium flex items-center"><MapPin className="h-5 w-5 mr-2" /> Saved Addresses</h3>
                    <button type="button" onClick={startAddAddress} className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md">
                      <Plus className="h-4 w-4 mr-1" /> Add New
                    </button>
                  </div>

                  {(user?.addresses && user.addresses.length > 0) ? (
                    <div className="space-y-3">
                      {user.addresses.map(addr => (
                        <div key={addr._id || Math.random()} className={`border rounded-lg p-3 flex items-start justify-between ${selectedAddressId === (addr._id || '') ? 'border-primary-500' : 'border-gray-200'}`}>
                          <label className="flex items-start cursor-pointer">
                            <input type="radio" className="mt-1 mr-3" checked={selectedAddressId === (addr._id || '')} onChange={() => handleSelectAddress(addr._id || '')} />
                            <div>
                              <p className="font-medium">{addr.type?.toUpperCase() || 'HOME'} {addr.isDefault && (<span className="ml-2 inline-flex items-center text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded"><CheckCircle className="h-3 w-3 mr-1" /> Default</span>)}</p>
                              <p className="text-gray-700">{addr.street}</p>
                              <p className="text-gray-700">{addr.city}, {addr.state} {addr.zipCode}</p>
                              <p className="text-gray-500 text-sm">{addr.country}</p>
                            </div>
                          </label>
                          <div className="flex items-center gap-2">
                            <button type="button" className="text-primary-600 hover:text-primary-700" onClick={() => startEditAddress(addr._id || '')}><Edit className="h-4 w-4" /></button>
                            <button type="button" className="text-red-600 hover:text-red-700" onClick={() => removeAddress(addr._id || '')}><Trash2 className="h-4 w-4" /></button>
                            <button type="button" className="text-gray-600 hover:text-gray-800 border px-2 py-1 rounded" onClick={() => makeDefault(addr._id || '')}>Make Default</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No saved addresses. Add one to speed up checkout.</p>
                  )}

                  {showAddressForm && (
                    <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium mb-3">{isEditing ? 'Edit Address' : 'Add Address'}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Type</label>
                          <select name="type" value={addressForm.type || 'home'} onChange={handleAddressFormChange} className="w-full border rounded px-3 py-2">
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Street</label>
                          <input name="street" value={addressForm.street} onChange={handleAddressFormChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">City</label>
                          <input name="city" value={addressForm.city} onChange={handleAddressFormChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">State</label>
                          <input name="state" value={addressForm.state} onChange={handleAddressFormChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Zip Code</label>
                          <input name="zipCode" value={addressForm.zipCode} onChange={handleAddressFormChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Country</label>
                          <input name="country" value={addressForm.country || ''} onChange={handleAddressFormChange} className="w-full border rounded px-3 py-2" />
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button type="button" onClick={submitAddressForm} className="bg-primary-600 text-white px-4 py-2 rounded">Save</button>
                        <button type="button" onClick={() => { setShowAddressForm(false); resetAddressForm(); }} className="bg-gray-200 text-gray-800 px-4 py-2 rounded">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Review Your Order
                </h2>
                
                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {state.items.map((item) => (
                      <div key={`${item.product._id}-${item.size}-${item.color}`} className="flex items-center space-x-4">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.name}</h4>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × ${item.product.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Shipping Address */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
                  <div className="text-gray-600">
                    <p>{formData.firstName} {formData.lastName}</p>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                    <p>{formData.country}</p>
                  </div>
                </div>
                
                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                  <p className="text-gray-600">
                    **** **** **** {formData.cardNumber.slice(-4)}
                  </p>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Order Complete */}
            {step === 4 && (
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for your purchase. You will receive an email confirmation shortly.
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 space-y-2">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <span>Secure SSL encryption</span>
              </div>
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-2" />
                <span>Free returns within 30 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout