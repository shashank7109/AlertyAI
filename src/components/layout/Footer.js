'use client'

import Link from 'next/link'
import { FiMail, FiTwitter, FiGithub, FiLinkedin } from 'react-icons/fi'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-[#1C1C1E] border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-lg mx-auto px-5 py-10">
        {/* Brand */}
        <div className="mb-6">
          <span className="text-xl font-bold text-gray-900 dark:text-white">AlertyAI</span>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your AI-powered daily planner &amp; reminder app.
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
          <div className="space-y-3">
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider mb-1">Product</p>
            <Link href="/dashboard" className="block text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">Dashboard</Link>
            <Link href="/tasks" className="block text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">Tasks</Link>
            <Link href="/reminders" className="block text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">Reminders</Link>
            <Link href="/ai-assistant" className="block text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">AI Assistant</Link>
          </div>
          <div className="space-y-3">
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider mb-1">Support</p>
            <Link href="/help" className="block text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">Help Center</Link>
            <Link href="/privacy" className="block text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="block text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">Terms of Service</Link>
            <a href="mailto:support@alertyai.com" className="block text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">Contact</a>
          </div>
        </div>

        {/* Social + Copyright */}
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
          <p className="text-xs text-gray-400">© {year} AlertyAI</p>
          <div className="flex items-center gap-3">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors"><FiTwitter size={18} /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors"><FiGithub size={18} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors"><FiLinkedin size={18} /></a>
            <a href="mailto:support@alertyai.com" className="text-gray-400 hover:text-blue-500 transition-colors"><FiMail size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
