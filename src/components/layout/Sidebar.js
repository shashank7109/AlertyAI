/**
 * Copyright (c) 2026 AlertyAI
 * SPDX-License-Identifier: MIT
 */

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

      {/* Sidebar - Clay & Minimal */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -320,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          'fixed left-0 top-0 h-screen w-72 z-50 pt-16',
          'bg-surface dark:bg-background',
          'flex flex-col shadow-2xl border-none',
          'shadow-[10px_0_30px_-10px_rgba(0,0,0,0.1)]'
        )}
      >
        {/* Header - Simple */}
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden dark:bg-white dark:p-1 dark:rounded-lg">
              <img src="/logo.png" alt="AlertyAI" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-semibold tracking-tight text-on-surface">AlertyAI</span>
          </Link>
          <p className="text-[10px] font-semibold mt-1 text-primary uppercase tracking-[0.2em]">Assistant</p>
        </div>

        {/* Navigation - Clay List */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
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
                  'nav-item',
                  isActive && 'active'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5',
                  isActive ? 'text-primary' : 'text-text-secondary'
                )} />
                <span className="text-[14px] font-semibold">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Action Button - Clay Pill */}
        <div className="p-6">
          <Link
            href="/ai-assistant"
            className="btn-clay btn-clay-primary w-full py-4 text-sm"
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

