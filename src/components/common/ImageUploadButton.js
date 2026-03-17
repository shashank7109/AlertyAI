/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

*/

'use client'

import { useState } from 'react'
import { FiImage, FiUpload } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { aiAPI } from '@/lib/api'

export default function ImageUploadButton({ onTaskExtracted }) {
  const [isOpen, setIsOpen] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)

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
      toast.loading('🔍 Extracting task information from image...', { id: 'extract' })
      
      // Extract data only (doesn't create task yet)
      const response = await aiAPI.extractFromImage(file)
      
      // Backend returns: {success: true, extracted: true, task_data: {...}, message: "..."}
      if (response.data.success && response.data.task_data) {
        const taskData = response.data.task_data
        toast.success('✅ Task information extracted!', { id: 'extract' })
        
        // Pass extracted data to parent (which will open TaskModal)
        if (onTaskExtracted) {
          onTaskExtracted({
            title: taskData.title || '',
            description: taskData.description || '',
            priority: (taskData.priority || 'medium').toLowerCase(),
            category: taskData.category || 'Work',
            dueDate: taskData.deadline || taskData.date ? 
              (taskData.deadline || taskData.date).split('T')[0] : '',
            dueTime: taskData.deadline || taskData.time ? 
              (taskData.deadline ? new Date(taskData.deadline).toTimeString().slice(0, 5) : taskData.time) : '',
            subtasks: taskData.subtasks || [],
          })
        }
        
        setIsOpen(false)
        setUploadedImage(null)
      } else {
        toast.error('❌ Could not extract task information', { id: 'extract' })
      }
    } catch (error) {
      console.error('Error extracting from image:', error)
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Failed to extract task information'
      toast.error(`❌ ${errorMsg}`, { id: 'extract' })
    } finally {
      setExtracting(false)
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
      >
        <FiImage size={20} />
        Upload Image
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => !extracting && setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FiImage className="text-purple-600" />
                  Upload Task Image
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Upload a screenshot or image containing task information. Our AI will extract and create a task for you.
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-12 text-center">
                  <label
                    htmlFor="quick-image-upload"
                    className="cursor-pointer block"
                  >
                    <div className="w-32 h-32 mx-auto rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all">
                      {extracting ? (
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent" />
                      ) : (
                        <FiUpload className="text-white" size={48} />
                      )}
                    </div>
                    <input
                      id="quick-image-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={extracting}
                    />
                  </label>
                  <p className="text-white font-semibold mt-6 text-lg">
                    {extracting ? 'Extracting Task Info...' : uploadedImage ? uploadedImage.name : 'Click to Upload Image'}
                  </p>
                  <p className="text-purple-100 text-sm mt-3">
                    Upload screenshots, notes, or any image with task details
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-purple-200 text-xs">
                      Supported formats: PNG, JPG, JPEG, WEBP
                    </p>
                    <p className="text-purple-200 text-xs">
                      Maximum size: 10MB
                    </p>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="mt-6 space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <p className="text-sm text-blue-900 dark:text-blue-300 font-medium">
                      💡 What can I extract?
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                      Task titles, descriptions, deadlines, priorities, and categories from any image with text
                    </p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <p className="text-sm text-green-900 dark:text-green-300 font-medium">
                      ✨ Examples
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                      Meeting notes, whiteboard photos, sticky notes, email screenshots, handwritten notes
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => !extracting && setIsOpen(false)}
                  disabled={extracting}
                  className="w-full mt-6 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {extracting ? 'Processing...' : 'Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

