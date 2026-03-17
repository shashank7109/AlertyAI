/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

*/

/**
 * useReminders Hook
 * Manages reminder CRUD operations with React Query
 */
import { useState, useEffect, useCallback } from 'react'
import { reminderAPI } from '@/lib/api'
// Note: Install react-hot-toast: npm install react-hot-toast
// For now, using console.log - replace with toast when installed
const toast = {
  success: (msg) => console.log('✅', msg),
  error: (msg) => console.error('❌', msg),
}

export const useReminders = () => {
  const [reminders, setReminders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    status: null,
    limit: 50,
    skip: 0,
  })

  // Fetch reminders
  const fetchReminders = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await reminderAPI.getAll(filters)
      setReminders(response.data)
    } catch (err) {
      console.error('❌ Error fetching reminders:', err)
      setError(err.response?.data?.detail || 'Failed to fetch reminders')
      toast.error('Failed to load reminders')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  // Create reminder
  const createReminder = useCallback(async (reminderData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await reminderAPI.create(reminderData)
      toast.success('Reminder created successfully')
      await fetchReminders() // Refresh list
      return response.data
    } catch (err) {
      console.error('❌ Error creating reminder:', err)
      const errorMsg = err.response?.data?.detail || 'Failed to create reminder'
      setError(errorMsg)
      toast.error(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [fetchReminders])

  // Update reminder
  const updateReminder = useCallback(async (reminderId, updateData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await reminderAPI.update(reminderId, updateData)
      toast.success('Reminder updated successfully')
      await fetchReminders() // Refresh list
      return response.data
    } catch (err) {
      console.error('❌ Error updating reminder:', err)
      const errorMsg = err.response?.data?.detail || 'Failed to update reminder'
      setError(errorMsg)
      toast.error(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [fetchReminders])

  // Delete reminder
  const deleteReminder = useCallback(async (reminderId) => {
    setIsLoading(true)
    setError(null)

    try {
      await reminderAPI.delete(reminderId)
      toast.success('Reminder deleted successfully')
      await fetchReminders() // Refresh list
    } catch (err) {
      console.error('❌ Error deleting reminder:', err)
      const errorMsg = err.response?.data?.detail || 'Failed to delete reminder'
      setError(errorMsg)
      toast.error(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [fetchReminders])

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchReminders()
  }, [fetchReminders])

  return {
    reminders,
    isLoading,
    error,
    filters,
    setFilters,
    fetchReminders,
    createReminder,
    updateReminder,
    deleteReminder,
  }
}

