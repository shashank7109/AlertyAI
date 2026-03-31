/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */


'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiMenu, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const DOCS_URL = 'https://docs.alertyai.com'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/40 dark:bg-background/40 backdrop-blur-xl border-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
        <div className="flex items-center justify-between">
          {/* Logo - Bold & Minimal */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center group-hover:scale-105 transition-transform h-12 md:h-14">
              <img src="/logo.png?v=3.0" alt="AlertyAI logo" className="h-full w-auto filter invert dark:invert-0" />
            </div>
            <div className="h-5 md:h-6 flex items-center">
              <img src="/text.png?v=3.0" alt="AlertyAI Typography" className="h-full w-auto object-contain filter invert dark:invert-0" />
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">

            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors tracking-widest uppercase">
                Home
              </Link>
              <Link href="/about" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors tracking-widest uppercase">
                About
              </Link>
              <Link href="/faqs" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors tracking-widest uppercase">
                FAQs
              </Link>
              <Link href="/privacy" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors tracking-widest uppercase">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors tracking-widest uppercase">
                Terms
              </Link>
              <Link href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors tracking-widest uppercase">
                Docs
              </Link>
              <Link href="https://drive.google.com/drive/folders/16RRMXxunPGTLXdCM8bse5LbS4GFuX4bS?usp=sharing" target="_blank" rel="noopener noreferrer" className="btn-clay btn-clay-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest">
                Download App
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-surface-hover transition-colors text-on-surface"
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
                <Link href="/" className="block text-lg font-medium text-on-surface" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                <Link href="/about" className="block text-lg font-medium text-on-surface" onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>
                <Link href="/faqs" className="block text-lg font-medium text-on-surface" onClick={() => setIsMenuOpen(false)}>
                  FAQs
                </Link>
                <Link href="/privacy" className="block text-lg font-medium text-on-surface" onClick={() => setIsMenuOpen(false)}>
                  Privacy
                </Link>
                <Link href="/terms" className="block text-lg font-medium text-on-surface" onClick={() => setIsMenuOpen(false)}>
                  Terms
                </Link>
                <Link href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="block text-lg font-medium text-on-surface" onClick={() => setIsMenuOpen(false)}>
                  Docs
                </Link>
                <Link href="https://drive.google.com/drive/folders/16RRMXxunPGTLXdCM8bse5LbS4GFuX4bS?usp=sharing" target="_blank" rel="noopener noreferrer" className="block text-lg font-medium text-primary" onClick={() => setIsMenuOpen(false)}>
                  Download App
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

