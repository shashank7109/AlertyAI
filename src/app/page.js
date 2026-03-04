'use client'

import Link from 'next/link'
import { FiCheckCircle, FiMic, FiTarget, FiCalendar, FiMessageCircle, FiMoon, FiPlus } from 'react-icons/fi'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F2F2F6] dark:bg-black">
      <Navbar />

      {/* ── Hero ─────────────────────────────── */}
      <section className="pt-28 pb-10 px-5 text-center">
        <div className="max-w-lg mx-auto">
          <p className="text-sm font-semibold text-blue-500 mb-3 tracking-wide">
            Your AI second brain
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 leading-tight">
            Never forget.<br />
            <span className="text-blue-500">Always achieve.</span>
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            AlertyAI keeps your tasks, reminders, and goals organised — built for daily use on mobile.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-colors text-sm">
              Get Started — It's Free
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-[#2C2C2E] text-gray-700 dark:text-gray-200 font-semibold rounded-full border border-gray-200 dark:border-gray-700 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-[#3A3A3C]">
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* ── Live Preview ─────────────────────── */}
      <section className="px-5 pb-10">
        <div className="max-w-sm mx-auto bg-white dark:bg-[#1C1C1E] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="px-5 pt-5 pb-3 flex justify-between items-center">
            <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Today</span>
            <span className="text-xs text-gray-400">3 tasks</span>
          </div>
          {/* Tasks */}
          <div className="px-5 space-y-3 pb-3">
            {[
              { label: 'Buy groceries', done: true, tag: null },
              { label: 'Call mom', done: false, tag: 'High', tagColor: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
              { label: 'Prepare slides', done: false, tag: 'Tomorrow', tagColor: 'text-gray-400 bg-gray-100 dark:bg-gray-800' },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${t.done ? 'bg-blue-500 border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                    {t.done && <FiCheckCircle className="text-white" size={12} />}
                  </div>
                  <span className={`text-sm ${t.done ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>{t.label}</span>
                </div>
                {t.tag && <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${t.tagColor}`}>{t.tag}</span>}
              </div>
            ))}
          </div>
          {/* Add button */}
          <div className="px-5 py-4 flex justify-end">
            <div className="w-11 h-11 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
              <FiPlus className="text-white" size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────── */}
      <section className="px-5 py-10">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Everything you need</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: FiCheckCircle, title: 'Tasks', desc: 'Clean, fast, organised.' },
              { icon: FiMic, title: 'Voice Input', desc: 'Speak to add tasks.' },
              { icon: FiTarget, title: 'Smart Alerts', desc: 'Never miss a deadline.' },
              { icon: FiMoon, title: 'Dark Mode', desc: 'Easy on the eyes.' },
              { icon: FiCalendar, title: 'Calendar', desc: 'See your week at a glance.' },
              { icon: FiMessageCircle, title: 'AI Chat', desc: 'Your built-in assistant.' },
            ].map((f, i) => (
              <div key={i} className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                <f.icon className="text-blue-500 mb-3" size={22} />
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">{f.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="px-5 py-10">
        <div className="max-w-lg mx-auto bg-gray-900 dark:bg-[#1C1C1E] rounded-3xl px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Start with AlertyAI</h2>
          <p className="text-gray-400 text-sm mb-6">Free forever. No credit card.</p>
          <Link href="/register" className="inline-block px-8 py-3 bg-white text-gray-900 font-semibold rounded-full text-sm hover:bg-gray-100 transition-colors">
            Create Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
