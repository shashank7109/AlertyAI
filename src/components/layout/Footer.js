'use client'

import Link from 'next/link'
import { FiMail, FiTwitter, FiGithub, FiLinkedin } from 'react-icons/fi'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-background dark:bg-background border-t border-border">
      <div className="max-w-lg mx-auto px-5 py-10">
        {/* Brand */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center shadow-lg shadow-primary/10 overflow-hidden p-1 border border-border/50">
              <img src="/logo.png" alt="AlertyAI" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-heading font-bold text-on-surface uppercase tracking-tight italic">AlertyAI</span>
          </div>
          <p className="text-sm text-text-secondary">
            Your personal assistant for a clear mind.
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
          <div className="space-y-3">
            <p className="font-bold text-on-surface text-[10px] uppercase tracking-widest mb-1">Product</p>
            <Link href="/dashboard" className="block text-text-secondary hover:text-primary transition-colors">Home</Link>
            <Link href="/tasks" className="block text-text-secondary hover:text-primary transition-colors">Tasks</Link>
            <Link href="/reminders" className="block text-text-secondary hover:text-primary transition-colors">Reminders</Link>
            <Link href="/ai-assistant" className="block text-text-secondary hover:text-primary transition-colors">Assistant</Link>
          </div>
          <div className="space-y-3">
            <p className="font-bold text-on-surface text-[10px] uppercase tracking-widest mb-1">Support</p>
            <Link href="/help" className="block text-text-secondary hover:text-primary transition-colors">Help</Link>
            <Link href="/privacy" className="block text-text-secondary hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="block text-text-secondary hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>

        {/* Social + Copyright */}
        <div className="flex items-center justify-between border-t border-border pt-6">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">© {year} AlertyAI</p>
          <div className="flex items-center gap-3">
            <a href="#" className="text-text-secondary hover:text-primary transition-colors"><FiTwitter size={16} /></a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors"><FiGithub size={16} /></a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors"><FiLinkedin size={16} /></a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors"><FiMail size={16} /></a>
          </div>
        </div>
      </div>
    </footer >
  )
}
