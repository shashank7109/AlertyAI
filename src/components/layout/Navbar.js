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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
        <div className="flex items-center justify-between">
          {/* Logo - Bold & Minimal */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl italic">A</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">AlertyAI</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all text-gray-500 dark:text-gray-400"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
            )}

            <div className="hidden md:flex items-center gap-6">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
                    DASHBOARD
                  </Link>
                  <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors" title="Logout">
                    <FiLogOut size={18} />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors tracking-widest uppercase">
                    Login
                  </Link>
                  <Link href="/register" className="btn-clay btn-clay-primary px-8 py-3.5 shadow-xl shadow-blue-500/25">
                    Start Now
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

