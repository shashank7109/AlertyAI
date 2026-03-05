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

      toast.success('Email verified successfully! Welcome to AlertyAI!')
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
          toast.success(`Welcome to AlertyAI, ${user.full_name || user.username}!`)
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
      <div className="min-h-screen bg-background dark:bg-background flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          {/* Main Card */}
          <div className="bg-surface/90 dark:bg-surface/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <span className="text-on-primary font-bold text-2xl">A</span>
              </div>
              <h1 className="text-3xl font-heading font-bold text-on-surface mb-2">Create Account</h1>
              <p className="text-text-secondary">Get started with AlertyAI</p>
            </motion.div>

            {/* OTP Verification Form */}
            {showOtpVerification ? (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-6"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-soft flex items-center justify-center">
                    <FiMail className="text-primary" size={32} />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-on-surface mb-2">Verify Your Email</h2>
                  <p className="text-text-secondary font-medium">
                    We've sent a 6-digit OTP code to <strong>{registeredEmail}</strong>
                  </p>
                  <p className="text-sm text-text-secondary/60 mt-2">
                    Please check your inbox and enter the code below
                  </p>
                </motion.div>

                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase tracking-widest mb-2">
                    Enter OTP Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-4 bg-surface-hover/30 dark:bg-zinc-900/40 border border-border rounded-xl text-on-surface placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all text-center text-2xl tracking-widest font-mono shadow-sm"
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
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={otpLoading}
                  className="text-sm text-primary hover:underline disabled:opacity-50 font-bold uppercase tracking-widest text-[10px]"
                >
                  Didn't receive the code? Resend OTP
                </button>

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
                  <label className="block text-sm font-bold text-text-secondary uppercase tracking-widest mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiUser className="text-text-secondary" size={20} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-surface-hover/50 border border-border rounded-xl text-on-surface placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase tracking-widest mb-2">
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
                  <label className="block text-sm font-bold text-text-secondary uppercase tracking-widest mb-2">
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
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase tracking-widest mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="text-text-secondary" size={20} />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-surface-hover/50 border border-border rounded-xl text-on-surface placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-on-primary font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
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
                    <span className="px-4 bg-surface dark:bg-surface text-text-secondary">OR</span>
                  </div>
                </div>

                {/* Google Sign Up */}
                <button
                  type="button"
                  onClick={handleGoogleRegister}
                  className="w-full bg-surface-hover/30 dark:bg-surface border border-border text-on-surface font-medium py-3 px-4 rounded-xl hover:bg-surface-hover dark:hover:bg-zinc-900 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow"
                >
                  <FcGoogle size={24} />
                  Sign up with Google
                </button>
              </form>
            )}

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-bold uppercase tracking-widest text-xs">
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
