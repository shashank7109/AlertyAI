/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

'use client'

import { useState } from 'react'
import { FiX, FiPlus, FiMail } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { teamAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export default function TeamModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    memberEmails: [],
  })
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Please enter a team name')
      return
    }

    setLoading(true)
    try {
      await teamAPI.create(formData)
      toast.success('Team created successfully!')
      onSave()
    } catch (error) {
      toast.error('Failed to create team')
    } finally {
      setLoading(false)
    }
  }

  const addEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (newEmail.trim() && emailRegex.test(newEmail)) {
      if (!formData.memberEmails.includes(newEmail)) {
        setFormData({
          ...formData,
          memberEmails: [...formData.memberEmails, newEmail.trim()]
        })
        setNewEmail('')
      } else {
        toast.error('Email already added')
      }
    } else {
      toast.error('Please enter a valid email')
    }
  }

  const removeEmail = (index) => {
    setFormData({
      ...formData,
      memberEmails: formData.memberEmails.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create New Team
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Team Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Hackathon Team Alpha"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What is this team working on?"
              rows="3"
              className="input resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Invite Members (Email)
            </label>
            <div className="flex gap-2 mb-3">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                <FiMail className="w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEmail())}
                  placeholder="member@example.com"
                  className="flex-1 bg-transparent outline-none"
                />
              </div>
              <button
                type="button"
                onClick={addEmail}
                className="px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
              </button>
            </div>
            
            {formData.memberEmails.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formData.memberEmails.length} member(s) to be invited
                </p>
                {formData.memberEmails.map((email, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{email}</span>
                    <button
                      type="button"
                      onClick={() => removeEmail(index)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 <strong>Tip:</strong> Team members will receive an invitation email to join this team.
              You'll be assigned as the team leader.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn-neon">
              {loading ? <div className="spinner mx-auto w-5 h-5 border-2" /> : 'Create Team'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

