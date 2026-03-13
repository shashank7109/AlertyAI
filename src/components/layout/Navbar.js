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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/40 dark:bg-background/40 backdrop-blur-xl border-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
        <div className="flex items-center justify-between">
          {/* Logo - Bold & Minimal */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden dark:bg-white dark:p-1 dark:rounded-lg">
              <img src="/logo.png" alt="AlertyAI" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-heading font-semibold tracking-tighter text-on-surface uppercase">AlertyAI</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface dark:bg-surface shadow-sm border border-border hover:shadow-md transition-all text-text-secondary"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
            )}

            <div className="hidden md:flex items-center gap-6">
              {isAuthenticated ? (
                <>
                  <Link href="https://drive.google.com/drive/folders/16RRMXxunPGTLXdCM8bse5LbS4GFuX4bS?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors tracking-widest uppercase">
                    Download App
                  </Link>
                  <Link href="/" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors tracking-widest uppercase">
                    Home
                  </Link>
                  <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center rounded-xl bg-danger/10 text-danger hover:bg-danger/20 transition-colors" title="Logout">
                    <FiLogOut size={18} />
                  </button>
                </>
              ) : (
                <>
                  <Link href="https://drive.google.com/drive/folders/16RRMXxunPGTLXdCM8bse5LbS4GFuX4bS?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors tracking-widest uppercase">
                    Download App
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
              className="md:hidden overflow-hidden bg-surface dark:bg-background"
            >
              <div className="pt-6 pb-6 space-y-4 px-2">
                <Link href="/" className="block text-lg font-medium text-gray-800 dark:text-gray-200" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                <Link href="https://drive.google.com/drive/folders/16RRMXxunPGTLXdCM8bse5LbS4GFuX4bS?usp=sharing" target="_blank" rel="noopener noreferrer" className="block text-lg font-medium text-primary" onClick={() => setIsMenuOpen(false)}>
                  Download App
                </Link>
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                  {isAuthenticated ? (
                    <button onClick={handleLogout} className="w-full text-left text-lg font-medium text-red-500">
                      Log out
                    </button>
                  ) : (
                    <>
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

