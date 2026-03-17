/**
 * Copyright (c) 2026 AlertyAI
 * SPDX-License-Identifier: MIT
 */

'use client'

import { useState } from 'react'
import { FiCheck, FiUpload, FiPackage } from 'react-icons/fi'
import { teamAPI, taskAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export default function TaskActionButtons({ task, onUpdate }) {
  const [submitting, setSubmitting] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [note, setNote] = useState('')

  const isCollectTask = task.task_type === 'collect_task' || task.is_leader_task
  const isSubmitTask = !isCollectTask
  const isTeamTask = task.is_team_task || task.team_id
  const isPersonalTask = !isTeamTask
  const isCompleted = task.status === 'completed' || task.completed
  
  const canSubmit = isSubmitTask && ['accepted', 'in_progress'].includes(task.status)
  const canCollect = isCollectTask && (task.status === 'pending_review' || task.status === 'submitted')
  const canComplete = !isCompleted && (
    isPersonalTask || // Personal tasks can always be completed
    (isTeamTask && !canSubmit && !canCollect && task.status !== 'pending') // Team tasks that are not pending/submit/collect
  )

  const handleSubmit = async () => {
    if (!task.team_id) {
      toast.error('Team information missing')
      return
    }

    setSubmitting(true)
    try {
      await teamAPI.submitTask(task.team_id, task._id || task.id, note)
      toast.success('✅ Task submitted successfully!')
      setShowNoteInput(false)
      setNote('')
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error submitting task:', error)
      toast.error(error.response?.data?.detail || 'Failed to submit task')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCollect = async () => {
    if (!task.team_id) {
      toast.error('Team information missing')
      return
    }

    setSubmitting(true)
    try {
      await teamAPI.collectTask(task.team_id, task._id || task.id, note)
      toast.success('✅ Task collected successfully!')
      setShowNoteInput(false)
      setNote('')
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error collecting task:', error)
      toast.error(error.response?.data?.detail || 'Failed to collect task')
    } finally {
      setSubmitting(false)
    }
  }

  const handleComplete = async () => {
    setCompleting(true)
    try {
      if (isTeamTask && task.team_id) {
        // For team tasks, use team API
        await teamAPI.completeTask(task.team_id, task._id || task.id)
        toast.success('✅ Task marked as completed!')
      } else {
        // For personal tasks, use task API
        await taskAPI.complete(task._id || task.id)
        toast.success('✅ Task marked as completed!')
      }
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error completing task:', error)
      toast.error(error.response?.data?.detail || 'Failed to complete task')
    } finally {
      setCompleting(false)
    }
  }

  // Don't show anything if task is already completed
  if (isCompleted && !canSubmit && !canCollect) {
    return null
  }

  // Don't show anything if no actions are available
  if (!canSubmit && !canCollect && !canComplete) {
    return null
  }

  return (
    <div className="mt-3 space-y-2">
      {/* Submit/Collect buttons for team tasks */}
      {(canSubmit || canCollect) && (
        <>
          {!showNoteInput ? (
            <button
              onClick={() => setShowNoteInput(true)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                canSubmit
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {canSubmit ? (
                <>
                  <FiUpload size={18} />
                  <span>Submit Task</span>
                </>
              ) : (
                <>
                  <FiPackage size={18} />
                  <span>Collect Task</span>
                </>
              )}
            </button>
          ) : (
            <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={canSubmit ? "Add a note about your submission (optional)..." : "Add review notes (optional)..."}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowNoteInput(false)
                    setNote('')
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={canSubmit ? handleSubmit : handleCollect}
                  disabled={submitting}
                  className={`flex-1 px-3 py-2 rounded-lg font-semibold transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    canSubmit
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {submitting ? 'Processing...' : (canSubmit ? '📤 Submit' : '📥 Collect')}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Mark as Complete button */}
      {canComplete && (
        <button
          onClick={handleComplete}
          disabled={completing}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {completing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Completing...</span>
            </>
          ) : (
            <>
              <FiCheck size={18} />
              <span>Mark as Complete</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}

