'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiUsers, FiUser, FiCalendar, FiFlag, FiBell, FiCheck } from 'react-icons/fi'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { teamAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export default function AssignTaskPage() {
  const router = useRouter()
  const params = useParams()
  const teamId = params.id

  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: [], // Can be multiple members or 'all'
    assignToAll: false,
    priority: 'medium',
    deadline: '',
    reminder_frequency: 'daily',
    reminder_time: '09:00'
  })

  useEffect(() => {
    fetchTeam()
  }, [teamId])

  const fetchTeam = async () => {
    try {
      const response = await teamAPI.getById(teamId)
      setTeam(response.data)
    } catch (error) {
      console.error('Error fetching team:', error)
      toast.error('Failed to load team')
      router.push('/teams')
    } finally {
      setLoading(false)
    }
  }

  const handleMemberSelect = (userId) => {
    if (formData.assignToAll) return
    
    setFormData(prev => ({
      ...prev,
      assigned_to: prev.assigned_to.includes(userId)
        ? prev.assigned_to.filter(id => id !== userId)
        : [...prev.assigned_to, userId]
    }))
  }

  const handleAssignToAll = () => {
    setFormData(prev => ({
      ...prev,
      assignToAll: !prev.assignToAll,
      assigned_to: !prev.assignToAll 
        ? team.members.filter(m => m.role !== 'leader').map(m => m.user_id)
        : []
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Please enter a task title')
      return
    }
    
    if (formData.assigned_to.length === 0 && !formData.assignToAll) {
      toast.error('Please select at least one member')
      return
    }

    setSubmitting(true)
    
    try {
      // If assign to all, get all non-leader member IDs
      const assignees = formData.assignToAll 
        ? team.members.filter(m => m.role !== 'leader').map(m => m.user_id)
        : formData.assigned_to

      // Create task for each assignee
      let successCount = 0
      for (const userId of assignees) {
        try {
          await teamAPI.createTask(teamId, {
            title: formData.title,
            description: formData.description,
            assigned_to: userId,
            priority: formData.priority,
            deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
            reminder_frequency: formData.reminder_frequency,
            reminder_time: formData.reminder_time
          })
          successCount++
        } catch (err) {
          console.error(`Failed to assign task to ${userId}:`, err)
        }
      }

      if (successCount > 0) {
        toast.success(`Task assigned to ${successCount} member(s)!`)
        router.push(`/teams/${teamId}`)
      } else {
        toast.error('Failed to assign task')
      }
    } catch (error) {
      console.error('Error assigning task:', error)
      toast.error(error.response?.data?.detail || 'Failed to assign task')
    } finally {
      setSubmitting(false)
    }
  }

  const getMemberInitial = (name) => {
    return name?.charAt(0).toUpperCase() || '?'
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        </div>
      </DashboardLayout>
    )
  }

  const nonLeaderMembers = team?.members?.filter(m => m.role !== 'leader') || []

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <FiArrowLeft size={20} />
            <span>Back to {team?.name}</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Assign New Task
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Assign a task to team members and set deadlines
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Task Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Complete UI design"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  placeholder="Describe the task in detail..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Assign To */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <FiUsers className="inline mr-2" />
              Assign To
            </h3>

            {/* Assign to All Toggle */}
            <button
              type="button"
              onClick={handleAssignToAll}
              className={`w-full mb-4 p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                formData.assignToAll
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FiUsers className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Assign to All Members
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {nonLeaderMembers.length} members will receive this task
                  </div>
                </div>
              </div>
              {formData.assignToAll && (
                <FiCheck className="text-blue-600 dark:text-blue-400" size={24} />
              )}
            </button>

            {/* Individual Member Selection */}
            {!formData.assignToAll && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Or select individual members:
                </p>
                {nonLeaderMembers.length === 0 ? (
                  <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No team members to assign. Invite members first!
                  </p>
                ) : (
                  nonLeaderMembers.map((member) => (
                    <button
                      key={member.user_id}
                      type="button"
                      onClick={() => handleMemberSelect(member.user_id)}
                      className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                        formData.assigned_to.includes(member.user_id)
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                          {getMemberInitial(member.name)}
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {member.email}
                          </div>
                        </div>
                      </div>
                      {formData.assigned_to.includes(member.user_id) && (
                        <FiCheck className="text-green-600 dark:text-green-400" size={20} />
                      )}
                    </button>
                  ))
                )}
              </div>
            )}

            {formData.assigned_to.length > 0 && !formData.assignToAll && (
              <p className="mt-3 text-sm text-blue-600 dark:text-blue-400">
                {formData.assigned_to.length} member(s) selected
              </p>
            )}
          </motion.div>

          {/* Priority & Deadline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Priority & Deadline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiFlag className="inline mr-1" /> Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🟠 High</option>
                  <option value="urgent">🔴 Urgent</option>
                </select>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiCalendar className="inline mr-1" /> Deadline
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Reminder Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <FiBell className="inline mr-2" /> Reminder Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reminder Frequency
                </label>
                <select
                  value={formData.reminder_frequency}
                  onChange={(e) => setFormData({ ...formData, reminder_frequency: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="once">Once (before deadline)</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reminder Time
                </label>
                <input
                  type="time"
                  value={formData.reminder_time}
                  onChange={(e) => setFormData({ ...formData, reminder_time: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting ? 'Assigning...' : 'Assign Task'}
            </button>
          </motion.div>
        </form>
      </div>
    </DashboardLayout>
  )
}

