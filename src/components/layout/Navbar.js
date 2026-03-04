'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { FiMenu, FiX, FiSun, FiMoon, FiLogOut } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function Navbar() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      setIsAuthenticated(true)
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
    toast.success('Logged out successfully')
    router.push('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Soft Text */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">AlertyAI</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
            )}

            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors" title="Logout">
                    <FiLogOut size={20} />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors">
                    Log in
                  </Link>
                  <Link href="/register" className="btn-primary">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Minimalist */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-white dark:bg-[#1C1C1E]"
            >
              <div className="pt-6 pb-6 space-y-4 px-2">
                <Link href="/dashboard" className="block text-lg font-medium text-gray-800 dark:text-gray-200" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/tasks" className="block text-lg font-medium text-gray-800 dark:text-gray-200" onClick={() => setIsMenuOpen(false)}>
                  Tasks
                </Link>
                <Link href="/settings" className="block text-lg font-medium text-gray-800 dark:text-gray-200" onClick={() => setIsMenuOpen(false)}>
                  Settings
                </Link>
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                  {isAuthenticated ? (
                    <button onClick={handleLogout} className="w-full text-left text-lg font-medium text-red-500">
                      Log out
                    </button>
                  ) : (
                    <>
                      <Link href="/login" className="block text-lg font-medium text-gray-800 dark:text-gray-200" onClick={() => setIsMenuOpen(false)}>
                        Log in
                      </Link>
                      <Link href="/register" className="btn-primary w-full text-center" onClick={() => setIsMenuOpen(false)}>
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

