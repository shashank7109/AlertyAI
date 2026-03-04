'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { FiUser, FiBell, FiGlobe, FiMoon, FiSun, FiShield, FiCheck } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    name: 'Demo User',
    email: 'user@example.com',
    language: 'en',
    notifications: {
      taskReminders: true,
      deadlines: true,
      teamUpdates: true,
      aiSuggestions: true,
      email: true,
      push: false,
    },
  })

  const handleSave = () => {
    toast.success('Settings Saved')
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Control Center</h1>
          <p className="text-xs font-black text-gray-400 tracking-[0.2em] uppercase mt-2">
            Configure your workspace experience
          </p>
        </div>

        {/* Settings Sections */}
        <div className="grid gap-8">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="clay-card border-none bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-[2.5rem]"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 inner-shadow">
                <FiUser size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  Identity
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Personal profile details</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl text-[11px] font-black tracking-widest uppercase focus:ring-2 focus:ring-blue-500 outline-none transition-all inner-shadow border-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl text-[11px] font-black tracking-widest uppercase focus:ring-2 focus:ring-blue-500 outline-none transition-all inner-shadow border-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="clay-card border-none bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-[2.5rem]"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 inner-shadow">
                <FiMoon size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  Visuals
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customize your theme</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { value: 'light', label: 'BRIGHT', icon: FiSun },
                { value: 'dark', label: 'NIGHT', icon: FiMoon },
                { value: 'system', label: 'AUTO', icon: FiShield },
              ].map((option) => {
                const Icon = option.icon
                const isActive = theme === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      "p-8 rounded-[2rem] border-none transition-all flex flex-col items-center gap-4 group",
                      isActive
                        ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20 scale-105"
                        : "bg-gray-50 dark:bg-slate-900/50 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-900 inner-shadow"
                    )}
                  >
                    <Icon className={cn("w-8 h-8", isActive ? "text-white" : "text-gray-400 group-hover:text-blue-500")} />
                    <span className="text-[11px] font-black tracking-widest uppercase">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="clay-card border-none bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-[2.5rem]"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 inner-shadow">
                <FiBell size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  Alerts
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Manage signal preferences</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { key: 'taskReminders', label: 'Action Alerts', description: 'Upcoming task signals' },
                { key: 'deadlines', label: 'Deadline Watch', description: 'Critical time warnings' },
                { key: 'teamUpdates', label: 'Comm Channel', description: 'Team collaboration pings' },
                { key: 'aiSuggestions', label: 'AI Strategy', description: 'Smart intelligence tips' },
                { key: 'email', label: 'Direct Relay', description: 'Email notification stream' },
                { key: 'push', label: 'Neural Link', description: 'In-browser transmissions' },
              ].map((option) => (
                <div key={option.key} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-900/50 rounded-2xl inner-shadow">
                  <div className="flex-1">
                    <h3 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{option.label}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase opacity-60">{option.description}</p>
                  </div>
                  <button
                    onClick={() => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, [option.key]: !settings.notifications[option.key] }
                    })}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      settings.notifications[option.key] ? "bg-green-500" : "bg-gray-300 dark:bg-slate-700"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                      settings.notifications[option.key] ? "left-7" : "left-1"
                    )}></div>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Language */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="clay-card border-none bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-[2.5rem]"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 inner-shadow">
                <FiGlobe size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  Localization
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Regional input language</p>
              </div>
            </div>

            <div className="space-y-2 max-w-sm">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Voice Relay Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl text-[11px] font-black tracking-widest uppercase focus:ring-2 focus:ring-blue-500 outline-none transition-all inner-shadow border-none appearance-none"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
              </select>
            </div>
          </motion.div>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <button
              onClick={handleSave}
              className="btn-clay btn-clay-primary px-12 py-5 text-sm tracking-widest uppercase"
            >
              Update Core
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

