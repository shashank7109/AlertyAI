/**
 * Firebase Configuration for Push Notifications
 * Initialize Firebase with credentials from environment variables
 */
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// VAPID key for web push
const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY

let app = null
let messaging = null

// Initialize Firebase
export const initFirebase = () => {
  if (typeof window === 'undefined') {
    return null // Server-side rendering
  }

  try {
    if (!app) {
      app = initializeApp(firebaseConfig)
      console.log('✅ Firebase initialized')
    }
    return app
  } catch (error) {
    console.error('❌ Firebase initialization error:', error)
    return null
  }
}

// Get Firebase Messaging instance
export const getFirebaseMessaging = () => {
  if (typeof window === 'undefined') {
    return null // Server-side rendering
  }

  try {
    if (!messaging) {
      const app = initFirebase()
      if (app) {
        messaging = getMessaging(app)
        console.log('✅ Firebase Messaging initialized')
      }
    }
    return messaging
  } catch (error) {
    console.error('❌ Firebase Messaging initialization error:', error)
    return null
  }
}

// Request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null
  }

  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      const messaging = getFirebaseMessaging()
      if (messaging && vapidKey) {
        const token = await getToken(messaging, { vapidKey })
        if (token) {
          console.log('✅ FCM Token obtained:', token.substring(0, 20) + '...')
          return token
        }
      }
    } else {
      console.warn('⚠️ Notification permission denied')
    }
    return null
  } catch (error) {
    console.error('❌ Error requesting notification permission:', error)
    return null
  }
}

// Listen for foreground messages
export const onForegroundMessage = (callback) => {
  const messaging = getFirebaseMessaging()
  if (messaging) {
    onMessage(messaging, (payload) => {
      console.log('📬 Foreground message received:', payload)
      callback(payload)
    })
  }
}

export default { initFirebase, getFirebaseMessaging, requestNotificationPermission, onForegroundMessage }

