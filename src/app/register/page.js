'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiMail, FiLock, FiUser, FiUserPlus } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import api, { authAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      
      if (response.data.requires_verification) {
        setRegisteredEmail(formData.email)
        setShowOtpVerification(true)
        toast.success('Registration successful! Please check your email for OTP code.')
      } else {
        toast.success('Account created successfully! Please login.')
        router.push('/login')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Registration failed'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setOtpLoading(true)

    try {
      const response = await authAPI.verifyOtp(registeredEmail, otp)
      
      // Store token and user data
      const token = response.data.access_token || response.data.token
      const user = response.data.user
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      // Store user_id separately for easy access
      const userId = user?._id || user?.id || user?.user_id
      if (userId) {
        localStorage.setItem('user_id', userId)
      }
      
      toast.success('Email verified successfully! Welcome to Smaran AI!')
      router.push('/dashboard')
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'OTP verification failed'
      toast.error(errorMsg)
    } finally {
      setOtpLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setOtpLoading(true)
    try {
      await authAPI.resendOtp(registeredEmail)
      toast.success('OTP has been resent to your email. Please check your inbox.')
      setOtp('')
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Failed to resend OTP'
      toast.error(errorMsg)
    } finally {
      setOtpLoading(false)
    }
  }

  const handleGoogleRegister = () => {
    // Open Google OAuth in popup window
    const width = 500
    const height = 600
    const left = window.innerWidth / 2 - width / 2
    const top = window.innerHeight / 2 - height / 2
    
    const authUrl = authAPI.googleAuthUrl()
    const popup = window.open(
      authUrl,
      'Google Sign Up',
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
        const { access_token, refresh_token, user, is_new_user } = responseData
        
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
        }
        
        if (is_new_user) {
          toast.success(`Welcome to Smaran AI, ${user.full_name || user.username}!`)
        } else {
          toast.success(`Welcome back, ${user.full_name || user.username}!`)
        }
        router.push('/dashboard')
        window.removeEventListener('message', handleMessage)
      } else if (event.data.type === 'OAUTH_ERROR' || event.data.type === 'GOOGLE_AUTH_ERROR') {
        popup?.close()
        toast.error(event.data.error || 'Google sign up failed')
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
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Main Card */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-400">Join your AI Second Brain</p>
          </motion.div>

          {/* OTP Verification Form */}
          {showOtpVerification ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <FiMail className="text-blue-600 dark:text-blue-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify Your Email</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  We've sent a 6-digit OTP code to <strong>{registeredEmail}</strong>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Please check your inbox and enter the code below
                </p>
              </motion.div>

              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={otpLoading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-6"
              >
                {otpLoading ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Verify Email'
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={otpLoading}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                >
                  Didn't receive the code? Resend OTP
                </button>
              </div>

              {/* Back to Registration */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpVerification(false)
                    setOtp('')
                    setRegisteredEmail('')
                  }}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                >
                  ← Back to registration
                </button>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" size={20} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" size={20} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiUserPlus size={20} />
                  Create Account
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">OR</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow"
            >
              <FcGoogle size={24} />
              Sign up with Google
            </button>
          </form>
          )}

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
    <Footer />
    </>
  )
}
