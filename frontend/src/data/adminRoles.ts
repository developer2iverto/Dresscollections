/**
 * Admin Role Definitions and Responsibilities
 * This file defines the different admin roles and their responsibilities in the system
 */

export interface RoleDefinition {
  name: string;
  description: string;
  permissions: string[];
  accessiblePages: string[];
}

export const adminRoles: Record<string, RoleDefinition> = {
  'super_admin': {
    name: 'Super Admin',
    description: 'Has full access to all system features and functionalities',
    permissions: [
      'Manage all users',
      'Manage all products',
      'Manage all orders',
      'Manage system settings',
      'Manage inventory',
      'Manage offers and promotions',
      'View analytics and reports',
      'Manage payment methods',
      'Assign user roles'
    ],
    accessiblePages: [
      '/cms/dashboard',
      '/cms/products',
      '/cms/orders',
      '/cms/inventory',
      '/cms/offers',
      '/cms/users',
      '/cms/settings',
      '/cms/account'
    ]
  },
  'product_admin': {
    name: 'Product Admin',
    description: 'Responsible for product management and inventory',
    permissions: [
      'Manage all products',
      'Manage inventory',
      'View product analytics',
      'Manage product categories',
      'Manage product attributes'
    ],
    accessiblePages: [
      '/cms/dashboard',
      '/cms/products',
      '/cms/inventory',
      '/cms/account'
    ]
  },
  'admin': {
    name: 'Admin',
    description: 'General administrator with access to most features except user management',
    permissions: [
      'Manage products',
      'Manage orders',
      'Manage inventory',
      'Manage offers and promotions',
      'View analytics and reports'
    ],
    accessiblePages: [
      '/cms/dashboard',
      '/cms/products',
      '/cms/orders',
      '/cms/inventory',
      '/cms/offers',
      '/cms/account'
    ]
  },
  'user': {
    name: 'User',
    description: 'Regular user with no admin access',
    permissions: [
      'View and purchase products',
      'Manage own account',
      'View order history'
    ],
    accessiblePages: []
  }
};

/**
 * Get role information by role name
 * @param role The role name to get information for
 * @returns The role definition or undefined if not found
 */
export const getRoleInfo = (role: string): RoleDefinition | undefined => {
  return adminRoles[role];
};

/**
 * Check if a user with the given role can access a specific page
 * @param role The user's role
 * @param page The page path to check access for
 * @returns Boolean indicating if the user can access the page
 */
export const canAccessPage = (role: string, page: string): boolean => {
  const roleInfo = adminRoles[role];
  if (!roleInfo) return false;
  
  return roleInfo.accessiblePages.includes(page);
};