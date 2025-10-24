import React, { useState } from 'react'
import { 
  Save, 
  Globe, 
  Mail, 
  Shield, 
  Database,
  Bell,
  Palette,
  Upload,
  Key,
  Server
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const CMSSettings = () => {
  const { theme, setTheme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    general: {
      siteName: 'StyleHub CMS',
      siteDescription: 'A modern content management system',
      siteUrl: 'https://stylehub.com',
      adminEmail: 'admin@stylehub.com',
      timezone: 'UTC',
      language: 'en'
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUsername: '',
      smtpPassword: '',
      fromEmail: 'noreply@stylehub.com',
      fromName: 'StyleHub'
    },
    security: {
      enableTwoFactor: false,
      sessionTimeout: '24',
      maxLoginAttempts: '5',
      passwordMinLength: '8',
      requireSpecialChars: true
    },
    notifications: {
      emailNotifications: true,
      newUserRegistration: true,
      newComments: true,
      systemUpdates: false
    }
  })

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'advanced', name: 'Advanced', icon: Server }
  ]

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleSave = () => {
    console.log('Saving settings:', settings)
    // Implement save functionality
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Site Information</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Site Name</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.general.siteName}
              onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Site URL</label>
            <input
              type="url"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.general.siteUrl}
              onChange={(e) => handleInputChange('general', 'siteUrl', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Site Description</label>
            <textarea
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.general.siteDescription}
              onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Admin Email</label>
            <input
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.general.adminEmail}
              onChange={(e) => handleInputChange('general', 'adminEmail', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Timezone</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.general.timezone}
              onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">SMTP Configuration</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">SMTP Host</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.email.smtpHost}
              onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SMTP Port</label>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.email.smtpPort}
              onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.email.smtpUsername}
              onChange={(e) => handleInputChange('email', 'smtpUsername', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.email.smtpPassword}
              onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">From Email</label>
            <input
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.email.fromEmail}
              onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">From Name</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.email.fromName}
              onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
              <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
            </div>
            <button
              type="button"
              className={`${
                settings.security.enableTwoFactor ? 'bg-indigo-600' : 'bg-gray-200'
              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => handleInputChange('security', 'enableTwoFactor', !settings.security.enableTwoFactor)}
            >
              <span
                className={`${
                  settings.security.enableTwoFactor ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Session Timeout (hours)</label>
              <input
                type="number"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleInputChange('security', 'sessionTimeout', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Login Attempts</label>
              <input
                type="number"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={settings.security.maxLoginAttempts}
                onChange={(e) => handleInputChange('security', 'maxLoginAttempts', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password Min Length</label>
              <input
                type="number"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={settings.security.passwordMinLength}
                onChange={(e) => handleInputChange('security', 'passwordMinLength', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Require Special Characters</label>
              <p className="text-sm text-gray-500">Passwords must contain special characters</p>
            </div>
            <button
              type="button"
              className={`${
                settings.security.requireSpecialChars ? 'bg-indigo-600' : 'bg-gray-200'
              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => handleInputChange('security', 'requireSpecialChars', !settings.security.requireSpecialChars)}
            >
              <span
                className={`${
                  settings.security.requireSpecialChars ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <p className="text-sm text-gray-500">
                  {key === 'emailNotifications' && 'Enable email notifications'}
                  {key === 'newUserRegistration' && 'Notify when new users register'}
                  {key === 'newComments' && 'Notify when new comments are posted'}
                  {key === 'systemUpdates' && 'Notify about system updates'}
                </p>
              </div>
              <button
                type="button"
                className={`${
                  value ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                onClick={() => handleInputChange('notifications', key, !value)}
              >
                <span
                  className={`${
                    value ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'email':
        return renderEmailSettings()
      case 'security':
        return renderSecuritySettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Appearance</h3>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Theme</p>
                  <p className="text-sm text-gray-500">Switch between light and dark mode</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                  <button
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} hover:bg-gray-200`}
                    onClick={toggleTheme}
                  >
                    Toggle
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Preferred Theme</p>
                  <p className="text-sm text-gray-500">Explicitly choose Light or Dark</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className={`px-3 py-2 rounded-md text-sm ${theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
                    onClick={() => setTheme('light')}
                  >Light</button>
                  <button
                    className={`px-3 py-2 rounded-md text-sm ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
                    onClick={() => setTheme('dark')}
                  >Dark</button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'advanced':
        return (
          <div className="text-center py-12">
            <Server className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Advanced Settings</h3>
            <p className="mt-1 text-sm text-gray-500">Advanced configuration options coming soon.</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Settings
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Configure your CMS settings and preferences
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="mt-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            {/* Sidebar */}
            <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'bg-gray-50 text-indigo-700 hover:text-indigo-700 hover:bg-gray-50'
                        : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50'
                    } group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full`}
                  >
                    <tab.icon
                      className={`${
                        activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                      } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                    />
                    <span className="truncate">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main content */}
            <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-6">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CMSSettings