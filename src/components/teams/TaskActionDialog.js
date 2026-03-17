/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

*/

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCheck, FiUpload, FiFileText, FiClock, FiUser, FiCalendar, FiAlertCircle, FiSend, FiDownload, FiMessageSquare } from 'react-icons/fi'
import { teamAPI } from '@/lib/api'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function TaskActionDialog({ task, onClose, onUpdate, isLeader, currentUserId, allTasks = [] }) {
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState('')
  const [files, setFiles] = useState([])
  const [showSubmitForm, setShowSubmitForm] = useState(false)

  // Determine task status and user role
  const isPending = task.status === 'pending'
  const isAccepted = task.status === 'accepted' || task.status === 'in_progress'
  const isSubmitted = task.status === 'submitted'
  const isPendingReview = task.status === 'pending_review'
  const isCompleted = task.status === 'completed'
  const isCollectTask = task.task_type === 'collect_task'
  const isAssignedToMe = String(task.assigned_to) === String(currentUserId)

  // Find linked submit task for collect tasks
  const linkedSubmitTask = isCollectTask && task.linked_task_id
    ? allTasks.find(t => (t.id || t._id) === task.linked_task_id)
    : null

  // Get comments and files from linked submit task (for collect tasks) or current task
  const displayComments = isCollectTask && linkedSubmitTask
    ? (linkedSubmitTask.comments || [])
    : (task.comments || [])

  const displayFiles = isCollectTask && linkedSubmitTask
    ? (linkedSubmitTask.files || [])
    : (task.files || [])

  // For members: show submit/complete options if task is accepted
  // For leaders: show collect/complete options if task is pending_review (submitted by member)
  const canSubmit = !isLeader && isAssignedToMe && isAccepted && !isCollectTask
  const canCollect = isLeader && isCollectTask && (isPendingReview || isSubmitted)
  const canComplete = isCompleted

  const handleSubmit = async () => {
    if (!showSubmitForm) {
      setShowSubmitForm(true)
      return
    }

    setLoading(true)
    try {
      await teamAPI.submitTask(task.team_id, task.task_id, note, files)
      toast.success('✅ Task submitted! Leader has been notified.')
      onUpdate?.()
      onClose()
    } catch (error) {
      console.error('Error submitting task:', error)
      toast.error(error.response?.data?.detail || 'Failed to submit task')
    } finally {
      setLoading(false)
    }
  }

  const handleCollect = async () => {
    setLoading(true)
    try {
      await teamAPI.collectTask(task.team_id, task.task_id, note)
      toast.success('✅ Task collected! Project marked as complete.')
      onUpdate?.()
      onClose()
    } catch (error) {
      console.error('Error collecting task:', error)
      toast.error(error.response?.data?.detail || 'Failed to collect task')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      await teamAPI.completeTask(task.team_id, task.task_id)
      toast.success('✅ Task marked as complete!')
      onUpdate?.()
      onClose()
    } catch (error) {
      console.error('Error completing task:', error)
      toast.error(error.response?.data?.detail || 'Failed to complete task')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)
  }

  const handleDownloadFile = async (file) => {
    try {
      // Extract the file path from the URL
      // URL format: http://localhost:8000/api/files/team_id/task_id/filename
      const url = new URL(file.file_url)
      const pathParts = url.pathname.split('/')
      const fileIndex = pathParts.indexOf('files')

      if (fileIndex === -1 || pathParts.length < fileIndex + 4) {
        toast.error('Invalid file URL')
        return
      }

      const teamId = pathParts[fileIndex + 1]
      const taskId = pathParts[fileIndex + 2]
      const filename = pathParts[fileIndex + 3]

      // Fetch file with authentication
      const response = await api.get(
        `/teams/files/${teamId}/${taskId}/${filename}`,
        {
          responseType: 'blob'
        }
      )

      // Create blob URL and trigger download
      const blob = new Blob([response.data])
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = file.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)

      toast.success('File downloaded successfully')
    } catch (error) {
      console.error('Error downloading file:', error)
      toast.error(error.response?.data?.detail || 'Failed to download file')
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

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      accepted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      submitted: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    }
    return colors[status] || colors.pending
  }

  // Determine dialog title and content based on status
  const getDialogTitle = () => {
    if (isPending) return 'New Task'
    if (isAccepted && !isLeader) return 'Task Progress'
    if ((isPendingReview || isSubmitted) && isLeader && isCollectTask) return 'Task Review'
    if (isCompleted) return 'Task Completed'
    return 'Task Details'
  }

  const getDialogSubtitle = () => {
    if (isPending) return 'Please review and accept'
    if (isAccepted && !isLeader) return 'Work on this task and complete when done'
    if ((isPendingReview || isSubmitted) && isLeader && isCollectTask) return 'Please review and complete.'
    if (isCompleted) return 'This task has been completed'
    return 'View task details'
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
          className="bg-surface dark:bg-background rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 p-6 rounded-t-2xl bg-surface border-b border-border">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-heading font-bold text-on-surface mb-1">
                  {getDialogTitle()}
                </h2>
                <p className="text-text-secondary text-sm">
                  {getDialogSubtitle()}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-on-surface transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Task Title */}
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-2">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-text-secondary leading-relaxed">
                  {task.description}
                </p>
              )}
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(task.status)}`}>
                {task.status?.replace('_', ' ').toUpperCase()}
              </span>
              {isCollectTask && (
                <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-primary-soft text-primary">
                  TEAM TASK
                </span>
              )}
            </div>

            {/* Task Details */}
            <div className="space-y-3">
              {/* Assigned By/To */}
              {!isCollectTask ? (
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
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <FiUser className="text-purple-600 dark:text-purple-400" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-text-secondary">Submitted by</div>
                    <div className="font-semibold text-on-surface truncate">
                      {task.assigned_to_name}
                    </div>
                  </div>
                </div>
              )}

              {/* Team */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <FiUser className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-text-secondary">Team</div>
                  <div className="font-semibold text-on-surface truncate">
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
                  <div className="text-xs text-text-secondary">Priority</div>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getPriorityColor(task.priority)}`}>
                    {task.priority?.toUpperCase() || 'MEDIUM'}
                  </span>
                </div>
              </div>
            </div>

            {/* Comments and Files Section - Show for leaders reviewing submitted tasks */}
            {((isPendingReview || isSubmitted) && isLeader && isCollectTask) && (
              <div className="space-y-4">
                {/* Comments */}
                <div>
                  <h4 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
                    <FiMessageSquare size={18} />
                    <span>Comments ({displayComments.length})</span>
                  </h4>
                  {displayComments.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {displayComments.map((comment, idx) => (
                        <div key={comment.id || idx} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                              {comment.user_name || 'Member'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {comment.created_at
                                ? new Date(comment.created_at).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                                : ''}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                            {comment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      No comments provided
                    </p>
                  )}
                </div>

                {/* Files */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FiFileText size={18} />
                    <span>Submitted Files ({displayFiles.length})</span>
                  </h4>
                  {displayFiles.length > 0 ? (
                    <div className="space-y-2">
                      {displayFiles.map((file, idx) => (
                        <div key={file.id || idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                              <FiFileText className="text-blue-600 dark:text-blue-400" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {file.filename}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Uploaded by {file.uploaded_by_name || 'Member'} • {file.uploaded_at
                                  ? new Date(file.uploaded_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                  : ''}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownloadFile(file)}
                            className="ml-3 p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Download file"
                          >
                            <FiDownload size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      No files uploaded
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Form */}
            {showSubmitForm && canSubmit && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <label className="block text-sm font-semibold text-on-surface">
                  Notes (Optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add any notes..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface-hover/50 text-on-surface focus:ring-2 focus:ring-primary outline-none resize-none"
                />
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Attach Files (Optional)
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {files.length > 0 && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {files.length} file(s) selected
                  </div>
                )}
              </motion.div>
            )}

            {/* Info Box */}
            {isAccepted && !isLeader && !showSubmitForm && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div className="flex gap-3">
                  <FiCheck className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-green-900 dark:text-green-100">
                    <p className="font-semibold mb-1">Task Accepted!</p>
                    <p className="text-green-800 dark:text-green-200">
                      Work on this task and submit when you're done. You can add notes and attach files.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {((isPendingReview || isSubmitted) && isLeader && isCollectTask) && (
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                <div className="flex gap-3">
                  <FiUpload className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-purple-900 dark:text-purple-100">
                    <p className="font-semibold mb-1">Task Submitted!</p>
                    <p className="text-purple-800 dark:text-purple-200">
                      The member has submitted this task. Please review and collect to mark it as complete.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 bg-surface dark:bg-background p-6 rounded-b-2xl border-t border-border">
            {isPending && !isLeader && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Please accept or reject this task first
              </div>
            )}

            {canSubmit && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full px-6 py-4 bg-primary text-on-primary rounded-xl font-bold shadow-lg hover:translate-y-[-2px] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : showSubmitForm ? (
                  <>
                    <FiSend size={20} />
                    <span>Submit Task</span>
                  </>
                ) : (
                  <>
                    <FiUpload size={20} />
                    <span>Submit Task</span>
                  </>
                )}
              </button>
            )}

            {canCollect && (
              <div className="space-y-3">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add review notes (optional)..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <button
                  onClick={handleCollect}
                  disabled={loading}
                  className="w-full px-6 py-4 bg-primary text-on-primary rounded-xl font-bold shadow-lg hover:translate-y-[-2px] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Collecting...</span>
                    </>
                  ) : (
                    <>
                      <FiCheck size={20} />
                      <span>Complete Task</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {isCompleted && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
                  <FiCheck size={20} />
                  <span className="font-semibold">Task Completed</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

