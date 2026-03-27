/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

'use client'

import Sidebar from './Sidebar'
import Navbar from './Navbar'
import FloatingActionButton from '../common/FloatingActionButton'
import { useUIStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children }) {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen pt-24 bg-background dark:bg-background">
      <Sidebar />

      <div
        className={cn(
          'transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'
        )}
      >
        <Navbar />

        <main className="p-6 md:p-10 max-w-[1600px] mx-auto fade-in">
          {children}
        </main>
      </div>

      <FloatingActionButton />
    </div>
  )
}

