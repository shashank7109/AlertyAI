/**
 * Copyright (c) 2026 AlertyAI
 * SPDX-License-Identifier: MIT
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCheck, FiAlertCircle, FiClock, FiUser, FiCalendar } from 'react-icons/fi'
import { teamAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export default function TaskAcceptDialog({ task, onClose, onUpdate }) {
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAccept = async () => {
    setLoading(true)
    try {
      await teamAPI.acceptTask(task.team_id, task.task_id)
      toast.success('✅ Task accepted! Reminder created.')
      onUpdate?.()
      onClose()
    } catch (error) {
      console.error('Error accepting task:', error)
      toast.error(error.response?.data?.detail || 'Failed to accept task')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    setLoading(true)
    try {
      await teamAPI.rejectTask(task.team_id, task.task_id, reason)
      toast.success('Task rejected. Leader has been notified.')
      onUpdate?.()
      onClose()
    } catch (error) {
      console.error('Error rejecting task:', error)
      toast.error(error.response?.data?.detail || 'Failed to reject task')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
      high: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
      medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
      low: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
    }
    return colors[priority] || colors.medium
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  New Task Assigned
                </h2>
                <p className="text-blue-100 text-sm">
                  Please review and respond
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Task Title */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {task.description}
                </p>
              )}
            </div>

            {/* Task Details */}
            <div className="space-y-3">
              {/* Assigned By */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <FiUser className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Assigned by</div>
                  <div className="font-semibold text-gray-900 dark:text-white truncate">
                    {task.assigned_by_name}
                  </div>
                </div>
              </div>

              {/* Team */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <FiUser className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Team</div>
                  <div className="font-semibold text-gray-900 dark:text-white truncate">
                    {task.team_name}
                  </div>
                </div>
              </div>

              {/* Deadline */}
              {task.deadline && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                    <FiCalendar className="text-orange-600 dark:text-orange-400" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Deadline</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatDate(task.deadline)}
                    </div>
                  </div>
                </div>
              )}

              {/* Priority */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <FiAlertCircle className="text-red-600 dark:text-red-400" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Priority</div>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getPriorityColor(task.priority)}`}>
                    {task.priority?.toUpperCase() || 'MEDIUM'}
                  </span>
                </div>
              </div>
            </div>

            {/* Rejection Form */}
            {rejecting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Why are you rejecting this task? *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., I'm currently overloaded with other tasks..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  autoFocus
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your team leader will be notified immediately
                </p>
              </motion.div>
            )}

            {/* Info Box */}
            {!rejecting && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex gap-3">
                  <FiAlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <p className="font-semibold mb-1">What happens next?</p>
                    <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                      <li>✓ Accept: You'll get daily reminders until completion</li>
                      <li>✓ Reject: Your leader will be notified to reassign</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 p-6 rounded-b-2xl border-t border-gray-200 dark:border-gray-700">
            {!rejecting ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setRejecting(true)}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-red-500 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                >
                  Reject Task
                </button>
                <button
                  onClick={handleAccept}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Accepting...</span>
                    </>
                  ) : (
                    <>
                      <FiCheck size={20} />
                      <span>Accept Task</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setRejecting(false)}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={loading || !reason.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Rejecting...</span>
                    </>
                  ) : (
                    <>
                      <FiX size={20} />
                      <span>Confirm Reject</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

