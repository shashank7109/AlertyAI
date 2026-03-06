'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { teamAPI } from '@/lib/api'
import toast from 'react-hot-toast'

const purposes = [
  { value: 'hackathon', label: 'Hackathon', emoji: '💻', desc: 'Coding competitions' },
  { value: 'college_project', label: 'College Project', emoji: '🎓', desc: 'Academic work' },
  { value: 'office_work', label: 'Office Work', emoji: '💼', desc: 'Professional tasks' },
  { value: 'startup', label: 'Startup', emoji: '🚀', desc: 'Business ventures' },
  { value: 'freelance', label: 'Freelance', emoji: '💰', desc: 'Client projects' },
  { value: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦', desc: 'Household tasks' },
  { value: 'ngo', label: 'NGO', emoji: '🤝', desc: 'Social work' },
  { value: 'farmers_group', label: 'Farmers', emoji: '🌾', desc: 'Agriculture' },
  { value: 'shop_staff', label: 'Shop Staff', emoji: '🏪', desc: 'Retail work' },
  { value: 'construction', label: 'Construction', emoji: '🏗️', desc: 'Building projects' },
  { value: 'event_management', label: 'Events', emoji: '🎉', desc: 'Event planning' },
  { value: 'other', label: 'Other', emoji: '📋', desc: 'Custom purpose' },
]

export default function CreateTeamPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    purpose: 'other',
    member_emails: [],
    member_phones: []
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Please enter a team name')
      return
    }

    setLoading(true)
    try {
      const response = await teamAPI.create(formData)
      const teamId = response.data?.id || response.data?._id
      toast.success(`Team created! Share code: ${response.data?.join_code || ''}`)
      router.push(`/teams/${teamId}`)
    } catch (error) {
      console.error('Error creating team:', error)
      toast.error(error.response?.data?.detail || 'Failed to create team')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <FiArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Team
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Set up your team — a join code will be generated automatically for others to join.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Team Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Hackathon Team Alpha"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </motion.div>

          {/* Purpose Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Team Purpose
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {purposes.map((purpose) => (
                <button
                  key={purpose.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, purpose: purpose.value })}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${formData.purpose === purpose.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                >
                  <div className="text-2xl mb-1">{purpose.emoji}</div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                    {purpose.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
                    {purpose.desc}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your team's goals and activities..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              💡 After creating your team, share the generated 6-digit join code with members so they can join.
            </p>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3"
          >
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </motion.div>
        </form>
      </div>
    </DashboardLayout>
  )
}
