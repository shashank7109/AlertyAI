/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

*/

'use client'

import Link from 'next/link'
import { FiCheckCircle, FiMic, FiTarget, FiCalendar, FiMessageCircle, FiMoon, FiPlus } from 'react-icons/fi'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background dark:bg-background selection:bg-primary-soft dark:selection:bg-primary-soft/40">
      <Navbar />

      {/* ── Hero ─────────────────────────────── */}
      <section className="pt-40 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary-soft text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-8"
          >
            Personal Assistant
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter text-on-surface mb-8 leading-[0.95] uppercase">
            NEVER FORGET.<br />
            <span className="text-primary/60 dark:text-primary">ALWAYS ACHIEVE.</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-xl mx-auto font-medium">
            A minimalist workspace for your tasks, reminders, and professional plans. Built to feel as light as air.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register"
              className="btn-clay btn-clay-primary px-10 py-5 text-base uppercase tracking-widest transition-colors"
            >
              Get Started
            </Link>
            <Link 
              href="https://drive.google.com/drive/folders/16RRMXxunPGTLXdCM8bse5LbS4GFuX4bS?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full sm:w-auto px-10 py-5 text-base font-bold uppercase tracking-widest bg-surface/50 dark:bg-surface/20 hover:bg-surface dark:hover:bg-surface/30 border border-border rounded-2xl transition-all"
            >
              Download APK
            </Link>
          </div>
        </div>
      </section>

      {/* ── Live Preview ─────────────────────── */}
      <section className="px-6 pb-20">
        <div className="max-w-md mx-auto clay-card bg-surface dark:bg-surface p-8 border-none overflow-hidden hover:scale-100 shadow-xl">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <span className="font-heading font-bold text-on-surface text-xl tracking-tight">Today</span>
            <div className="px-3 py-1 bg-primary-soft rounded-lg text-[10px] font-bold uppercase text-text-secondary">3 ACTIVE</div>
          </div>
          {/* Tasks */}
          <div className="space-y-4 mb-8">
            {[
              { label: 'Review product strategy', done: true },
              { label: 'Sync with design team @10am', done: false, priority: 'HIGH' },
              { label: 'Weekly retrospective', done: false },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${t.done ? 'bg-primary border-primary' : 'bg-background border-border inner-shadow'}`}>
                    {t.done && <FiCheckCircle className="text-on-primary" size={14} />}
                  </div>
                  <span className={`text-base font-medium tracking-tight ${t.done ? 'line-through text-text-secondary/50' : 'text-on-surface'}`}>{t.label}</span>
                </div>
                {t.priority && <span className="text-[10px] font-bold text-danger bg-danger/10 px-2 py-1 rounded-md">{t.priority}</span>}
              </div>
            ))}
          </div>
          {/* Action button */}
          <div className="flex justify-end">
            <div className="w-12 h-12 btn-clay btn-clay-primary rounded-xl flex items-center justify-center">
              <FiPlus className="text-on-primary" size={24} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────── */}
      <section className="px-6 py-20 bg-surface-hover/30 dark:bg-surface-hover/10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h2 className="text-2xl font-heading font-bold text-on-surface tracking-tighter uppercase">Features</h2>
            <div className="w-12 h-1 bg-primary mt-2 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FiCheckCircle, title: 'TO-DOs', desc: 'Minimalist organization system designed for high performance.' },
              { icon: FiMic, title: 'VOICE CAPTURE', desc: 'Capture thoughts instantly without lifting a finger.' },
              { icon: FiTarget, title: 'PLANS', desc: 'Visual milestones to keep your vision clear.' },
              { icon: FiMoon, title: 'DARK MODE', desc: 'Perfectly balanced dark mode for focus-heavy sessions.' },
              { icon: FiCalendar, title: 'CALENDAR', desc: 'A bird’s-eye view of your commitments.' },
              { icon: FiMessageCircle, title: 'ASSISTANT', desc: 'Your personal AI sidekick for planning.' },
            ].map((f, i) => (
              <div key={i} className="clay-card bg-surface dark:bg-surface hover:-translate-y-1 transition-transform group border-none shadow-md">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary-soft dark:bg-zinc-800 text-primary dark:text-white mb-6 transition-all duration-300 group-hover:scale-110 shadow-sm">
                  <f.icon size={22} />
                </div>
                <h3 className="text-lg font-heading font-bold text-on-surface mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-text-secondary font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="px-6 py-32 text-center">
        <div className="max-w-3xl mx-auto clay-card bg-primary dark:bg-surface p-16 border-none text-on-primary dark:text-on-surface shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-current mb-6 tracking-tighter uppercase">Ready To Start?</h2>
          <p className="text-current/70 text-lg mb-10 font-medium tracking-tight">Free forever. Minimalist by design.</p>
          <Link href="https://drive.google.com/drive/folders/16RRMXxunPGTLXdCM8bse5LbS4GFuX4bS?usp=sharing" target="_blank" rel="noopener noreferrer" className="btn-clay bg-on-primary text-primary dark:bg-primary dark:text-on-primary px-12 py-5 text-base hover:scale-105 transition-transform uppercase font-bold tracking-widest">
            Download App Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
