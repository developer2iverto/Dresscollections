import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Mail,
  Shield,
  Calendar,
  MoreVertical,
  UserCheck,
  UserX,
  X,
  Save
} from 'lucide-react'
import { getUsers } from '../utils/api'

interface User {
  id: number
  name: string
  email: string
  role: 'Super Admin' | 'Admin' | 'Product Admin' | 'Editor' | 'Author' | 'Subscriber'
  status: 'Active' | 'Inactive' | 'Pending'
  joinDate: string
  lastLogin: string
  postsCount: number
}

const CMSUsers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const initialUsers: User[] = []

  const [users, setUsers] = useState<User[]>(initialUsers)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null)
  const [showActionsUserId, setShowActionsUserId] = useState<number | null>(null)

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800'
      case 'Editor':
        return 'bg-blue-100 text-blue-800'
      case 'Author':
        return 'bg-green-100 text-green-800'
      case 'Subscriber':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Inactive':
        return 'bg-red-100 text-red-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Load real-time users from API (polling every 10s)
  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        setError(null)
        const data = await getUsers({ limit: 50 })
        const mapped: User[] = (data.users || []).map((u: any, idx: number) => ({
          id: idx + 1,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
          email: u.email,
          role: (u.role === 'admin' ? 'Admin' : 'Subscriber'),
          status: (u.isActive === false ? 'Inactive' : 'Active'),
          joinDate: u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : '',
          lastLogin: u.lastLogin ? new Date(u.lastLogin).toISOString().slice(0, 10) : 'Never',
          postsCount: 0
        }))
        if (isMounted) {
          setUsers(mapped)
          setLoading(false)
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e.message || 'Failed to load users')
          setLoading(false)
        }
      }
    }

    load()
    const interval = setInterval(load, 10000)
    return () => { isMounted = false; clearInterval(interval) }
  }, [])

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id))
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on users:`, selectedUsers)
    // Implement bulk actions here
    setSelectedUsers([])
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const openEdit = (user: User) => {
    setEditingUser(user)
    setShowEditModal(true)
    setShowActionsUserId(null)
  }

  const saveEdit = (updated: User) => {
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)))
    setShowEditModal(false)
    setEditingUser(null)
  }

  const openDelete = (userId: number) => {
    setDeletingUserId(userId)
    setShowActionsUserId(null)
  }

  const confirmDelete = () => {
    if (deletingUserId !== null) {
      setUsers(prev => prev.filter(u => u.id !== deletingUserId))
      setSelectedUsers(prev => prev.filter(id => id !== deletingUserId))
    }
    setDeletingUserId(null)
  }

  const toggleActions = (userId: number) => {
    setShowActionsUserId(prev => (prev === userId ? null : userId))
  }

  const toggleActive = (userId: number) => {
    setUsers(prev => prev.map(u => (
      u.id === userId
        ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
        : u
    )))
  }

  const toggleAdmin = (userId: number) => {
    setUsers(prev => prev.map(u => (
      u.id === userId
        ? { ...u, role: u.role === 'Admin' ? 'Subscriber' : 'Admin' }
        : u
    )))
  }

  const addUser = (newUser: { firstName: string, lastName: string, email: string, phone: string, password: string, role: User['role'], status: User['status'] }) => {
    const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1
    const today = new Date().toISOString().slice(0, 10)
    const user: User = {
      id: nextId,
      name: `${newUser.firstName} ${newUser.lastName}`.trim(),
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      joinDate: today,
      lastLogin: 'Never',
      postsCount: 0
    }
    setUsers(prev => [user, ...prev])
    setShowAddModal(false)
  }

  return (
    <>
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Users
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage user accounts and permissions
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button onClick={() => setShowAddModal(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-lg font-medium text-gray-900">{users.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {users.filter(u => u.status === 'Active').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <UserX className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {users.filter(u => u.status === 'Pending').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Admins</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {users.filter(u => u.role === 'Admin').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="author">Author</option>
                  <option value="subscriber">Subscriber</option>
                </select>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="overflow-visible">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posts
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {getInitials(user.name)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {user.joinDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.postsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative flex items-center space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900" onClick={() => openEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" onClick={() => openDelete(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600" onClick={() => toggleActions(user.id)}>
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {showActionsUserId === user.id && (
                          <div className="absolute right-0 top-6 mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                            <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onClick={() => openEdit(user)}>Edit</button>
                            <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onClick={() => toggleActive(user.id)}>
                              {user.status === 'Active' ? 'Set Inactive' : 'Set Active'}
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onClick={() => toggleAdmin(user.id)}>
                              {user.role === 'Admin' ? 'Set Subscriber' : 'Set Admin'}
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50" onClick={() => openDelete(user.id)}>Delete</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
                  <span className="font-medium">{users.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {showEditModal && editingUser && (
      <EditUserModal
        user={editingUser}
        onClose={() => { setShowEditModal(false); setEditingUser(null) }}
        onSave={saveEdit}
      />
    )}

    {showAddModal && (
      <AddUserModal
        onClose={() => setShowAddModal(false)}
        onSave={addUser}
      />
    )}

    {deletingUserId !== null && (
      <ConfirmDeleteModal
        onCancel={() => setDeletingUserId(null)}
        onConfirm={confirmDelete}
      />
    )}
    </>
  )
}

export default CMSUsers

// Edit User Modal
const EditUserModal: React.FC<{ user: User, onClose: () => void, onSave: (u: User) => void }> = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [role, setRole] = useState<User['role']>(user.role)
  const [status, setStatus] = useState<User['status']>(user.status)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" value={role} onChange={e => setRole(e.target.value as User['role'])}>
                <option>Super Admin</option>
                <option>Admin</option>
                <option>Product Admin</option>
                <option>Editor</option>
                <option>Author</option>
                <option>Subscriber</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" value={status} onChange={e => setStatus(e.target.value as User['status'])}>
                <option>Active</option>
                <option>Inactive</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
          <button className="inline-flex items-center px-4 py-2 rounded-md text-sm text-gray-700 bg-gray-100 hover:bg-gray-200" onClick={onClose}>
            Cancel
          </button>
          <button
            className="inline-flex items-center px-4 py-2 rounded-md text-sm text-white bg-indigo-600 hover:bg-indigo-700"
            onClick={() => onSave({ ...user, name, email, role, status })}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// Confirm Delete Modal
const ConfirmDeleteModal: React.FC<{ onCancel: () => void, onConfirm: () => void }> = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Delete User</h3>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-700">Are you sure you want to delete this user? This action cannot be undone.</p>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
          <button className="inline-flex items-center px-4 py-2 rounded-md text-sm text-gray-700 bg-gray-100 hover:bg-gray-200" onClick={onCancel}>
            Cancel
          </button>
          <button className="inline-flex items-center px-4 py-2 rounded-md text-sm text-white bg-red-600 hover:bg-red-700" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// Add User Modal
const AddUserModal: React.FC<{ onClose: () => void, onSave: (u: { firstName: string, lastName: string, email: string, phone: string, password: string, role: User['role'], status: User['status'] }) => void }> = ({ onClose, onSave }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<User['role']>('Subscriber')
  const [status, setStatus] = useState<User['status']>('Active')

  const validEmail = /.+@.+\..+/.test(email)
  const validPhone = /^\+?[\d\s-()]+$/.test(phone)
  const canSave = firstName.trim().length > 0 && lastName.trim().length > 0 && validEmail && validPhone && password.length >= 6

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Add User</h3>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" value={role} onChange={e => setRole(e.target.value as User['role'])}>
                <option>Super Admin</option>
                <option>Admin</option>
                <option>Product Admin</option>
                <option>Editor</option>
                <option>Author</option>
                <option>Subscriber</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" value={status} onChange={e => setStatus(e.target.value as User['status'])}>
                <option>Active</option>
                <option>Inactive</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
          {!validEmail && email && (
            <p className="text-sm text-red-600">Please enter a valid email.</p>
          )}
          {!validPhone && phone && (
            <p className="text-sm text-red-600">Please enter a valid phone.</p>
          )}
          {password && password.length < 6 && (
            <p className="text-sm text-red-600">Password must be at least 6 characters.</p>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
          <button className="inline-flex items-center px-4 py-2 rounded-md text-sm text-gray-700 bg-gray-100 hover:bg-gray-200" onClick={onClose}>
            Cancel
          </button>
          <button
            disabled={!canSave}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm text-white ${canSave ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'}`}
            onClick={() => onSave({ firstName, lastName, email, phone, password, role, status })}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </button>
        </div>
      </div>
    </div>
  )
}