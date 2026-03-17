/**
 * Copyright (c) 2026 AlertyAI
 * SPDX-License-Identifier: MIT
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { FiUsers, FiTrash2, FiRefreshCw, FiShield, FiMail, FiCalendar, FiCheckCircle, FiXCircle, FiUser } from 'react-icons/fi'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { adminAPI } from '@/lib/api'

const ADMIN_EMAIL = 'alertyai.07@gmail.com'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState(null)
  const [pagination, setPagination] = useState({ skip: 0, limit: 50, total: 0 })

  useEffect(() => {
    checkAuthAndLoad()
  }, [])

  const checkAuthAndLoad = async () => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please login to access admin page')
        router.push('/login')
        return
      }

      // Get current user from localStorage
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        toast.error('User information not found')
        router.push('/login')
        return
      }

      const user = JSON.parse(userStr)
      setCurrentUser(user)

      // Check if user is admin
      const userEmail = (user.email || '').toLowerCase()
      if (userEmail !== ADMIN_EMAIL.toLowerCase()) {
        toast.error('Access denied. Admin privileges required.')
        setIsAuthorized(false)
        setLoading(false)
        router.push('/dashboard')
        return
      }

      setIsAuthorized(true)
      await Promise.all([loadUsers(), loadStats()])
    } catch (error) {
      console.error('Error checking auth:', error)
      toast.error('Failed to verify access')
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async (newSkip = null, newLimit = null) => {
    try {
      const skip = newSkip !== null ? newSkip : pagination.skip
      const limit = newLimit !== null ? newLimit : pagination.limit

      const response = await adminAPI.getAllUsers(skip, limit)
      if (response.data.success) {
        setUsers(response.data.users)
        setPagination(prev => ({
          ...prev,
          skip,
          limit,
          total: response.data.total
        }))
      }
    } catch (error) {
      console.error('Error loading users:', error)
      if (error.response?.status === 403) {
        toast.error('Access denied. Admin privileges required.')
        router.push('/dashboard')
      } else {
        toast.error('Failed to load users')
      }
    }
  }

  const loadStats = async () => {
    try {
      const response = await adminAPI.getStats()
      if (response.data.success) {
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleDeleteUser = async (userId, userEmail) => {
    if (!confirm(`Are you sure you want to delete user ${userEmail}? This action cannot be undone.`)) {
      return
    }

    console.log('Attempting to delete user:', { userId, userEmail, userIdType: typeof userId })
    setDeletingUserId(userId)
    try {
      const response = await adminAPI.deleteUser(userId)
      if (response.data.success) {
        toast.success(`User ${userEmail} deleted successfully`)
        await loadUsers()
        await loadStats()
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        } : null,
        request: error.request ? {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        } : null,
        userId: userId
      })

      // Handle different error types
      if (!error.response) {
        // Network error or no response
        toast.error('Network error: Could not connect to server. Please check your connection.')
        console.error('No response from server. This might be a network error or CORS issue.')
      } else if (error.response.status === 403) {
        toast.error('Access denied. Admin privileges required.')
        router.push('/dashboard')
      } else if (error.response.status === 400) {
        const errorMsg = error.response.data?.detail || 'Cannot delete this user'
        toast.error(errorMsg)
      } else if (error.response.status === 404) {
        const errorMsg = error.response.data?.detail || 'User not found'
        toast.error(errorMsg)
        console.error('User not found. User ID sent:', userId)
        // Reload users list in case IDs have changed
        await loadUsers()
      } else if (error.response.status === 401) {
        toast.error('Authentication failed. Please login again.')
        router.push('/login')
      } else {
        const errorMsg = error.response.data?.detail || error.response.data?.message || `Failed to delete user (${error.response.status})`
        toast.error(errorMsg)
      }
    } finally {
      setDeletingUserId(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FiRefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">Loading admin panel...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isAuthorized) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <FiShield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">You do not have permission to access this page.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FiShield className="text-blue-500" />
                Admin Panel
              </h1>
              <p className="text-gray-600 mt-2">Manage users and view database statistics</p>
            </div>
            <button
              onClick={() => { loadUsers(); loadStats(); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_users}</p>
                </div>
                <FiUsers className="w-12 h-12 text-blue-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Users</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.active_users}</p>
                </div>
                <FiCheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Verified Users</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{stats.verified_users}</p>
                </div>
                <FiMail className="w-12 h-12 text-purple-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">New (7 days)</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{stats.recent_users_7d}</p>
                </div>
                <FiCalendar className="w-12 h-12 text-orange-500" />
              </div>
            </motion.div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FiUsers className="text-blue-500" />
              Registered Users ({pagination.total})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.is_active ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <FiCheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <FiXCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.is_verified || user.email_verified ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          disabled={deletingUserId === user.id || user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition ${deletingUserId === user.id || user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                        >
                          {deletingUserId === user.id ? (
                            <>
                              <FiRefreshCw className="w-4 h-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <FiTrash2 className="w-4 h-4" />
                              Delete
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {pagination.skip + 1} to {Math.min(pagination.skip + pagination.limit, pagination.total)} of {pagination.total} users
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newSkip = Math.max(0, pagination.skip - pagination.limit)
                    loadUsers(newSkip, pagination.limit)
                  }}
                  disabled={pagination.skip === 0}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    const newSkip = pagination.skip + pagination.limit
                    loadUsers(newSkip, pagination.limit)
                  }}
                  disabled={pagination.skip + pagination.limit >= pagination.total}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
