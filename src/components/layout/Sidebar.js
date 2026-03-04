'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  FiHome, FiCheckSquare, FiInbox, FiTarget,
  FiUsers, FiCalendar, FiMessageCircle, FiSettings,
  FiX, FiMenu
} from 'react-icons/fi'
import { useUIStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const menuItems = [
  { name: 'Dashboard', icon: FiHome, href: '/dashboard' },
  { name: 'My Tasks', icon: FiCheckSquare, href: '/tasks' },
  { name: 'Later Box', icon: FiInbox, href: '/laterbox' },
  { name: 'Opportunities', icon: FiTarget, href: '/opportunities' },
  { name: 'Teams', icon: FiUsers, href: '/teams' },
  { name: 'Calendar', icon: FiCalendar, href: '/calendar' },
  { name: 'Assistant', icon: FiMessageCircle, href: '/ai-assistant' },
  { name: 'Settings', icon: FiSettings, href: '/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Soft & Minimal */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -320,
        }}
        transition={{ type: 'tween', duration: 0.2 }}
        className={cn(
          'fixed left-0 top-0 h-screen w-72 z-50 pt-16',
          'bg-white dark:bg-[#1C1C1E] border-r border-gray-100 dark:border-gray-800',
          'flex flex-col shadow-sm'
        )}
      >
        {/* Header - Simple */}
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">AlertyAI</span>
          </Link>
          <p className="text-xs font-semibold mt-1 text-gray-400 dark:text-gray-500 tracking-wider">Your Second Brain</p>
        </div>

        {/* Navigation - Soft List */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleSidebar()
                  }
                }}
                className={cn(
                  'sidebar-item group',
                  isActive && 'active'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5 transition-none',
                  isActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400 dark:text-gray-500'
                )} />
                <span className="text-[15px] font-medium tracking-wide">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Action Button - Pill shape via globals */}
        <div className="p-6 border-t border-gray-50 dark:border-gray-800">
          <Link
            href="/ai-assistant"
            className="btn-primary w-full text-center"
          >
            Ask Assistant
          </Link>
        </div>
      </motion.aside>

      {/* Toggle Button for Desktop - Soft */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:block fixed left-4 top-4 z-40 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <FiMenu size={24} />
      </button>
    </>
  )
}

