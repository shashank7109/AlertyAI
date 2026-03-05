'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import api, { authAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authAPI.login(formData)
      console.log('Login response:', response.data)

      const { access_token, token, refresh_token, user } = response.data

      // Store tokens and user info (use access_token if available, fallback to token)
      const authToken = access_token || token

      if (!authToken) {
        console.error('No token received in login response:', response.data)
        toast.error('Login failed: No token received')
        return
      }

      console.log('Storing token:', authToken.substring(0, 50) + '...')
      localStorage.setItem('token', authToken)

      if (refresh_token) {
        localStorage.setItem('refreshToken', refresh_token)
      }
      localStorage.setItem('user', JSON.stringify(user))

      // Store user_id separately for easy access
      const userId = user?._id || user?.id || user?.user_id
      if (userId) {
        localStorage.setItem('user_id', userId)
        console.log('Stored user_id:', userId)
      }

      // Verify token is stored
      const storedToken = localStorage.getItem('token')
      console.log('Token stored successfully:', storedToken ? storedToken.substring(0, 50) + '...' : 'NOT FOUND')

      toast.success('Login successful!')
      router.push('/dashboard')
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Login failed'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Open Google OAuth in popup window
    const width = 500
    const height = 600
    const left = window.innerWidth / 2 - width / 2
    const top = window.innerHeight / 2 - height / 2

    const authUrl = authAPI.googleAuthUrl()
    const popup = window.open(
      authUrl,
      'Google Sign In',
      `width=${width},height=${height},left=${left},top=${top}`
    )

    // Listen for OAuth callback
    const handleMessage = (event) => {
      // Accept messages from backend or same origin
      const validOrigins = [
        window.location.origin,
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      ]

      if (!validOrigins.includes(event.origin)) {
        console.log('Invalid origin:', event.origin)
        return
      }

      if (event.data.type === 'OAUTH_SUCCESS' || event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        popup?.close()

        // Handle both old and new response formats
        const responseData = event.data.payload || event.data.data
        const { access_token, refresh_token, user } = responseData

        if (!access_token || !user) {
          toast.error('Invalid authentication response')
          window.removeEventListener('message', handleMessage)
          return
        }

        localStorage.setItem('token', access_token)
        if (refresh_token) {
          localStorage.setItem('refreshToken', refresh_token)
        }
        localStorage.setItem('user', JSON.stringify(user))

        // Store user_id separately for easy access
        const userId = user?._id || user?.id || user?.user_id
        if (userId) {
          localStorage.setItem('user_id', userId)
          console.log('Stored user_id (Google):', userId)
        }

        toast.success(`Welcome ${user.full_name || user.username}!`)
        router.push('/dashboard')
        window.removeEventListener('message', handleMessage)
      } else if (event.data.type === 'OAUTH_ERROR' || event.data.type === 'GOOGLE_AUTH_ERROR') {
        popup?.close()
        toast.error(event.data.error || 'Google login failed')
        window.removeEventListener('message', handleMessage)
      }
    }

    window.addEventListener('message', handleMessage)

    // Also check if popup was closed without completing
    const checkPopup = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(checkPopup)
        window.removeEventListener('message', handleMessage)
      }
    }, 1000)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background dark:bg-background flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          {/* Main Card */}
          <div className="bg-surface/90 dark:bg-surface/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10">
            {/* Productivity Illustration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8 text-center"
            >
              <div className="w-full h-32 flex items-center justify-center mb-4">
                {/* Simple illustration with icons */}
                <div className="relative w-48 h-32">
                  <motion.div
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-0 left-4 text-4xl"
                  >
                    ✅
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute top-2 right-4 text-3xl"
                  >
                    📝
                  </motion.div>
                  <motion.div
                    animate={{ rotate: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute bottom-0 left-8 text-3xl"
                  >
                    📅
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-2 right-8 text-4xl"
                  >
                    💡
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-center text-5xl">
                    💻
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-heading font-bold text-on-surface mb-2">Login</h1>
            </motion.div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="text-text-secondary" size={20} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-surface-hover/50 border border-border rounded-xl text-on-surface placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="text-text-secondary" size={20} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-surface-hover/50 border border-border rounded-xl text-on-surface placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Forgot Password */}
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline font-bold uppercase tracking-widest text-[10px]"
              >
                Forgot Password?
              </Link>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FiLogIn size={20} />
                    Login
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-surface dark:bg-surface text-text-secondary">OR</span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-surface-hover/30 dark:bg-surface border border-border text-on-surface font-medium py-3 px-4 rounded-xl hover:bg-surface-hover dark:hover:bg-zinc-900 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow"
              >
                <FcGoogle size={24} />
                Sign in with Google
              </button>
            </form>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:underline font-bold uppercase tracking-widest text-xs">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  )
}
