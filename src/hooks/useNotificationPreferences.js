/**
 * useNotificationPreferences Hook
 * Manages user notification preferences
 */
import { useState, useEffect, useCallback } from 'react'
import { reminderAPI } from '@/lib/api'
// Note: Install react-hot-toast: npm install react-hot-toast
// For now, using console.log - replace with toast when installed
const toast = {
  success: (msg) => console.log('✅', msg),
  error: (msg) => console.error('❌', msg),
}

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch preferences
  const fetchPreferences = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await reminderAPI.getPreferences()
      setPreferences(response.data)
    } catch (err) {
      console.error('❌ Error fetching preferences:', err)
      setError(err.response?.data?.detail || 'Failed to fetch preferences')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Update preferences
  const updatePreferences = useCallback(async (updateData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await reminderAPI.updatePreferences(updateData)
      setPreferences(response.data)
      toast.success('Preferences updated successfully')
      return response.data
    } catch (err) {
      console.error('❌ Error updating preferences:', err)
      const errorMsg = err.response?.data?.detail || 'Failed to update preferences'
      setError(errorMsg)
      toast.error(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch on mount
  useEffect(() => {
    fetchPreferences()
  }, [fetchPreferences])

  return {
    preferences,
    isLoading,
    error,
    fetchPreferences,
    updatePreferences,
  }
}

