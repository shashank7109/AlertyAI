/**
 * Copyright (c) 2026 AlertyAI
 * SPDX-License-Identifier: MIT
 */

'use client'

import { useState, useEffect } from 'react'
import { FiX, FiMic, FiCalendar, FiAlertCircle, FiUpload, FiImage, FiPlus, FiTrash2, FiCheck } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { aiAPI, taskAPI } from '@/lib/api'

export default function TaskModal({ isOpen, task, onClose, onSave, extractedData }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'Work',
    dueDate: '',
    dueTime: '',
    subtasks: [],
  })
  const [newSubtask, setNewSubtask] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [extracting, setExtracting] = useState(false)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        category: task.category || 'Work',
        dueDate: task.dueDate || (task.due_date ? task.due_date.split('T')[0] : ''),
        dueTime: task.dueTime || (task.due_date && task.due_date.includes('T') ? task.due_date.split('T')[1].slice(0, 5) : ''),
        subtasks: task.subtasks || [],
      })
    } else if (extractedData) {
      // Pre-fill with extracted data
      setFormData({
        title: extractedData.title || '',
        description: extractedData.description || '',
        priority: extractedData.priority || 'medium',
        category: extractedData.category || 'Work',
        dueDate: extractedData.dueDate || '',
        dueTime: extractedData.dueTime || '',
        subtasks: extractedData.subtasks || [],
      })
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'Work',
        dueDate: '',
        dueTime: '',
        subtasks: [],
      })
    }
  }, [task, extractedData])

  if (!isOpen) return null

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    setLoading(true)
    try {
      // Prepare task data
      const taskData = {
        title: formData.title,
        description: formData.description || '',
        priority: formData.priority,
        category: formData.category,
        subtasks: formData.subtasks || [],
      }

      // Add due_date if date or time is provided
      if (formData.dueDate || formData.dueTime) {
        const dateStr = formData.dueDate || new Date().toISOString().split('T')[0]
        const timeStr = formData.dueTime || '00:00'
        taskData.due_date = `${dateStr}T${timeStr}:00`
      }

      // Call API
      if (task) {
        // Update existing task
        await taskAPI.update(task._id || task.id, taskData)
        toast.success('Task updated!')
      } else {
        // Create new task
        await taskAPI.create(taskData)
        toast.success('Task created!')
      }

      // Refresh task list and close modal
      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving task:', error)
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Failed to save task'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceInput = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      toast('🎤 Listening... (Voice input coming soon!)', { duration: 3000 })
      // Simulate recording
      setTimeout(() => {
        setIsRecording(false)
        toast.success('Voice processed! (Demo)')
      }, 3000)
    }
  }

  const toggleVoiceInput = () => {
    setShowVoiceInput(!showVoiceInput)
  }

  const toggleImageUpload = () => {
    setShowImageUpload(!showImageUpload)
    setUploadedImage(null)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (PNG, JPG, JPEG, WEBP)')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB')
      return
    }

    setUploadedImage(file)
    setExtracting(true)

    try {
      toast.loading('Extracting task information from image...', { id: 'extract' })

      // Extract data only (doesn't create task yet)
      const response = await aiAPI.extractFromImage(file)

      // Backend returns: {success: true, extracted: true, task_data: {...}, message: "..."}
      if (response.data.success && response.data.task_data) {
        const taskData = response.data.task_data
        // Populate form with extracted data (user can edit before saving)
        setFormData({
          title: taskData.title || '',
          description: taskData.description || '',
          priority: (taskData.priority || 'medium').toLowerCase(),
          category: taskData.category || formData.category,
          dueDate: taskData.deadline ? taskData.deadline.split('T')[0] : (taskData.date || ''),
          dueTime: taskData.deadline && taskData.deadline.includes('T') ? taskData.deadline.split('T')[1].slice(0, 5) : (taskData.time || ''),
          subtasks: taskData.subtasks || [],
        })

        toast.success('Task information extracted! You can edit before saving.', { id: 'extract' })
        setShowImageUpload(false)
      } else {
        toast.error('Could not extract task information', { id: 'extract' })
      }
    } catch (error) {
      console.error('Error extracting from image:', error)
      toast.error('Failed to extract task information. Please try again.', { id: 'extract' })
    } finally {
      setExtracting(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-surface dark:bg-background rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-on-surface">
              {task ? 'Edit Task' : 'Add New Task'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiX className="text-gray-600 dark:text-gray-400" size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Task Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Task Name
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter task name"
                required
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  name="dueTime"
                  value={formData.dueTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Ideas">Ideas</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['low', 'medium', 'high'].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority })}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${formData.priority === priority
                      ? priority === 'high'
                        ? 'bg-red-600 text-white'
                        : priority === 'medium'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* AI-Powered Input Options */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                🤖 AI-Powered Input (Alternative)
              </h3>

              {/* Image Upload Section */}
              <div>
                <button
                  type="button"
                  onClick={toggleImageUpload}
                  className="w-full text-left text-sm font-semibold text-on-surface mb-2 flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <FiImage className="text-primary" size={16} />
                  Upload Image
                </button>

                {showImageUpload && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                  >
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-8 text-center">
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer block"
                      >
                        <div className="w-24 h-24 mx-auto rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all">
                          {extracting ? (
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
                          ) : (
                            <FiUpload className="text-white" size={40} />
                          )}
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={extracting}
                        />
                      </label>
                      <p className="text-white font-semibold mt-4">
                        {extracting ? 'Extracting...' : uploadedImage ? uploadedImage.name : 'Click to Upload'}
                      </p>
                      <p className="text-purple-100 text-sm mt-2">
                        Upload screenshots, notes, or any image with task info
                      </p>
                      <p className="text-purple-200 text-xs mt-1">
                        Supports PNG, JPG, JPEG, WEBP (Max 10MB)
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Voice Input Section */}
              <div>
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className="w-full text-left text-sm font-semibold text-on-surface mb-2 flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <FiMic className="text-primary" size={16} />
                  Voice Input
                </button>

                {showVoiceInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                  >
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-center">
                      <button
                        type="button"
                        onClick={handleVoiceInput}
                        className={`w-24 h-24 mx-auto rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all ${isRecording ? 'animate-pulse' : ''
                          }`}
                      >
                        <FiMic className="text-white" size={40} />
                      </button>
                      <p className="text-white font-semibold mt-4">
                        {isRecording ? 'Listening...' : 'Tap to Speak'}
                      </p>
                      <p className="text-blue-100 text-sm mt-2">
                        Add tasks in any Indian language
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Add notes or details..."
              />
            </div>

            {/* Subtasks */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Subtasks
              </label>
              <div className="space-y-2">
                {/* Existing Subtasks */}
                {formData.subtasks && formData.subtasks.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.subtasks.map((subtask, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-surface-hover/50 rounded-lg"
                      >
                        <FiCheck className="text-primary flex-shrink-0" size={16} />
                        <span className="flex-1 text-sm text-on-surface">
                          {subtask}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newSubtasks = formData.subtasks.filter((_, i) => i !== index)
                            setFormData({ ...formData, subtasks: newSubtasks })
                          }}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                        >
                          <FiTrash2 className="text-red-500" size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Subtask */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newSubtask.trim()) {
                        e.preventDefault()
                        setFormData({
                          ...formData,
                          subtasks: [...(formData.subtasks || []), newSubtask.trim()]
                        })
                        setNewSubtask('')
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a subtask..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newSubtask.trim()) {
                        setFormData({
                          ...formData,
                          subtasks: [...(formData.subtasks || []), newSubtask.trim()]
                        })
                        setNewSubtask('')
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Saving...' : task ? 'Update Task' : 'Save Task'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence >
  )
}
