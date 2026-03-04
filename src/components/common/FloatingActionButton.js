'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiCheckCircle, FiTarget, FiUsers, FiMic, FiX, FiImage, FiMessageCircle } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { aiV2API } from '@/lib/api'

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const router = useRouter()
  const fileInputRef = useRef(null)
  const mediaRecorderRef = useRef(null)

  const handleVoiceInput = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error('Voice input not supported in your browser')
      return
    }

    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
      toast.success('Voice recording stopped')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const chunks = []
      
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data)
      }
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        
        try {
          const audioFile = new File([blob], 'voice.webm', { type: 'audio/webm' })
          const response = await aiV2API.createTaskFromVoice(audioFile, 'en')
          
          if (response.data.success) {
            toast.success('Task created from voice! 🎤')
            router.push('/tasks')
          } else {
            toast.info('Voice feature coming soon!')
          }
        } catch (error) {
          console.error('Voice processing error:', error)
          toast.info('Voice feature coming soon!')
        } finally {
          stream.getTracks().forEach(track => track.stop())
        }
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      toast.success('Recording... Click again to stop')
      setIsOpen(false)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      toast.error('Could not access microphone')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    
    const loadingToast = toast.loading('Extracting task from image...')
    
    try {
      const response = await aiV2API.createTaskFromScreenshot(file, 'en')
      toast.dismiss(loadingToast)
      
      if (response.data.success) {
        toast.success('Task created from image! 🎉')
        // Refresh the page to show the new task
        if (window.location.pathname === '/tasks') {
          // If already on tasks page, reload to show new task
          window.location.reload()
        } else {
          // Navigate to tasks page
          router.push('/tasks')
          // Force a refresh after navigation
          setTimeout(() => {
            router.refresh()
          }, 100)
        }
      } else {
        toast.error('Failed to extract task from image')
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      console.error('Image upload error:', error)
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Failed to process image'
      toast.error(errorMsg)
    }
  }

  const actions = [
    {
      icon: FiMessageCircle,
      label: 'AI Assistant',
      color: 'from-purple-500 to-pink-500',
      action: () => router.push('/ai-assistant'),
    },
    {
      icon: FiCheckCircle,
      label: 'Add Task',
      color: 'from-blue-500 to-cyan-500',
      action: () => router.push('/tasks'),
    },
    {
      icon: FiImage,
      label: 'Upload Image',
      color: 'from-pink-500 to-rose-500',
      action: () => fileInputRef.current?.click(),
    },
    {
      icon: FiTarget,
      label: 'Add Opportunity',
      color: 'from-indigo-500 to-purple-500',
      action: () => router.push('/opportunities'),
    },
    {
      icon: FiUsers,
      label: 'Create Team',
      color: 'from-green-500 to-emerald-500',
      action: () => router.push('/teams'),
    },
    {
      icon: FiMic,
      label: isRecording ? 'Stop Recording' : 'Voice Input',
      color: isRecording ? 'from-red-500 to-red-600' : 'from-orange-500 to-red-500',
      action: handleVoiceInput,
    },
  ]

  const handleAction = (actionFn) => {
    actionFn()
    setIsOpen(false)
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute bottom-16 md:bottom-20 right-0 space-y-2 md:space-y-3"
            >
              {actions.map((action, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleAction(action.action)}
                  className="flex items-center gap-2 md:gap-3 bg-white dark:bg-gray-900 rounded-full shadow-lg hover:shadow-xl transition-all px-3 md:px-4 py-2 md:py-3 group"
                >
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg ${isRecording && action.icon === FiMic ? 'animate-pulse' : ''}`}>
                    <action.icon className="text-white" size={18} />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white pr-1 md:pr-2 whitespace-nowrap">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${isRecording ? 'from-red-600 to-red-700' : 'from-blue-600 to-purple-600'} shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all ${isRecording ? 'animate-pulse' : ''}`}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <FiX size={24} /> : <FiPlus size={24} />}
          </motion.div>
        </motion.button>
      </div>
    </>
  )
}
