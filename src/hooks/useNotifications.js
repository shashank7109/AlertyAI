/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

/**
 * useNotifications Hook
 * Handles push notification permissions, FCM token registration, and message listening
 */
import { useState, useEffect, useCallback } from 'react'
import { requestNotificationPermission, onForegroundMessage } from '@/lib/firebase'
import { reminderAPI } from '@/lib/api'
// Note: Install react-hot-toast: npm install react-hot-toast
// For now, using console.log - replace with toast when installed
const toast = {
  success: (msg, options) => {
    console.log('✅', msg, options)
    // Show browser notification if available
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(msg, { body: options?.description })
    }
  },
}

export const useNotifications = () => {
  const [fcmToken, setFcmToken] = useState(null)
  const [permission, setPermission] = useState('default')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Check notification permission status
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  // Request permission and get FCM token
  const requestPermission = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const token = await requestNotificationPermission()
      if (token) {
        setFcmToken(token)
        setPermission('granted')

        // Register device with backend
        try {
          await reminderAPI.registerDevice({
            fcm_token: token,
            device_type: 'web',
            device_name: navigator.userAgent,
            os_version: navigator.platform,
            app_version: '1.0.0',
          })
          console.log('✅ Device registered with backend')
        } catch (err) {
          console.error('❌ Failed to register device:', err)
          setError('Failed to register device')
        }
      } else {
        setPermission('denied')
        setError('Notification permission denied')
      }
    } catch (err) {
      console.error('❌ Error requesting notification permission:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Listen for foreground messages
  useEffect(() => {
    if (permission === 'granted') {
      onForegroundMessage((payload) => {
        const notification = payload.notification
        if (notification) {
          // Show in-app notification
          toast.success(notification.title, {
            description: notification.body,
            duration: 5000,
          })

          // Handle notification click
          if (payload.data?.task_id) {
            // Navigate to task (implement navigation logic)
            console.log('Navigate to task:', payload.data.task_id)
          }
        }
      })
    }
  }, [permission])

  return {
    fcmToken,
    permission,
    isLoading,
    error,
    requestPermission,
    isGranted: permission === 'granted',
    isDenied: permission === 'denied',
  }
}

