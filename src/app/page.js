'use client'

import Link from 'next/link'
import { FiCheckCircle, FiMic, FiTarget, FiCalendar, FiMessageCircle, FiMoon, FiPlus } from 'react-icons/fi'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F172A] selection:bg-blue-100 dark:selection:bg-blue-900/40">
      <Navbar />

      {/* ── Hero ─────────────────────────────── */}
      <section className="pt-40 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-black tracking-[0.2em] uppercase mb-8"
          >
            Digital Second Brain
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white mb-8 leading-[0.95]">
            NEVER FORGET.<br />
            <span className="text-blue-600 dark:text-sky-400">ALWAYS ACHIEVE.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto font-medium">
            A minimalist workspace for your tasks, reminders, and professional goals. Built to feel as light as air.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-clay btn-clay-primary px-10 py-5 text-base shadow-2xl shadow-blue-500/20">
              CREATE YOUR FREE BRAIN
            </Link>
          </div>
        </div>
      </section>

      {/* ── Live Preview ─────────────────────── */}
      <section className="px-6 pb-20">
        <div className="max-w-md mx-auto clay-card bg-white dark:bg-slate-800 p-8 border-none overflow-hidden scale-105">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <span className="font-black text-gray-900 dark:text-white text-xl tracking-tight">Today</span>
            <div className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-lg text-[10px] font-black uppercase text-gray-500">3 ACTIVE</div>
          </div>
          {/* Tasks */}
          <div className="space-y-4 mb-8">
            {[
              { label: 'Review product strategy', done: true },
              { label: 'Sync with design team @10am', done: false, priority: 'URGENT' },
              { label: 'Weekly retrospective', done: false },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-xl border-none flex items-center justify-center transition-all ${t.done ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'bg-gray-100 dark:bg-slate-700 inner-shadow'}`}>
                    {t.done && <FiCheckCircle className="text-white" size={14} />}
                  </div>
                  <span className={`text-base font-bold tracking-tight ${t.done ? 'line-through text-gray-300 dark:text-gray-600' : 'text-gray-800 dark:text-gray-200'}`}>{t.label}</span>
                </div>
                {t.priority && <span className="text-[10px] font-black text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-md">{t.priority}</span>}
              </div>
            ))}
          </div>
          {/* Action button */}
          <div className="flex justify-end">
            <div className="w-14 h-14 btn-clay btn-clay-primary rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FiPlus className="text-white" size={24} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────── */}
      <section className="px-6 py-20 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">ESSENTIALS</h2>
            <div className="w-12 h-1.5 bg-blue-600 mt-2 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FiCheckCircle, title: 'TASKS', desc: 'Minimalist organization system designed for high performance.' },
              { icon: FiMic, title: 'VOICE-ONLY', desc: 'Capture thoughts instantly without lifting a finger.' },
              { icon: FiTarget, title: 'GOALS', desc: 'Visual milestones to keep your long-term vision clear.' },
              { icon: FiMoon, title: 'NIGHT OWL', desc: 'Perfectly balanced dark mode for focus-heavy sessions.' },
              { icon: FiCalendar, title: 'PLANNER', desc: 'A bird’s-eye view of your upcoming commitments.' },
              { icon: FiMessageCircle, title: 'ASSISTANT', desc: 'Your personal AI sidekick for planning and reasoning.' },
            ].map((f, i) => (
              <div key={i} className="clay-card hover:-translate-y-2 group">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-sky-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <f.icon size={24} />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="px-6 py-32 text-center">
        <div className="max-w-3xl mx-auto clay-card bg-gray-900 dark:bg-slate-800 p-16 border-none shadow-blue-500/10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">READY TO UPGRADE?</h2>
          <p className="text-gray-400 text-lg mb-10 font-bold tracking-tight">Free forever. Minimalist by design.</p>
          <Link href="/register" className="btn-clay bg-white text-gray-900 px-12 py-5 text-base hover:scale-105 active:scale-95">
            JOIN 10,000+ THINKERS
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
