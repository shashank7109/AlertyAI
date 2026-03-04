'use client'

import Sidebar from './Sidebar'
import Navbar from './Navbar'
import FloatingActionButton from '../common/FloatingActionButton'
import { useUIStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children }) {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      
      <div
        className={cn(
          'transition-all duration-300',
          sidebarOpen ? 'lg:ml-80' : 'lg:ml-0'
        )}
      >
        <Navbar />
        
        <main className="p-6 lg:p-8 animate-fadeIn">
          {children}
        </main>
      </div>

      <FloatingActionButton />
    </div>
  )
}

