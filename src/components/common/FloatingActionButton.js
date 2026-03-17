/**
 * Copyright (c) 2026 AlertyAI
 * SPDX-License-Identifier: MIT
 */

'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiCheckCircle, FiTarget, FiUsers, FiMic, FiX, FiImage, FiMessageCircle } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { aiV2API } from '@/lib/api'
import { cn } from '@/lib/utils'

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
      label: 'Assistant',
      color: 'text-purple-500',
      action: () => router.push('/ai-assistant'),
    },
    {
      icon: FiCheckCircle,
      label: 'New Task',
      color: 'text-blue-500',
      action: () => router.push('/tasks'),
    },
    {
      icon: FiImage,
      label: 'Scan Image',
      color: 'text-pink-500',
      action: () => fileInputRef.current?.click(),
    },
    {
      icon: FiTarget,
      label: 'Opportunity',
      color: 'text-indigo-500',
      action: () => router.push('/opportunities'),
    },
    {
      icon: FiUsers,
      label: 'Team',
      color: 'text-green-500',
      action: () => router.push('/teams'),
    },
    {
      icon: FiMic,
      label: isRecording ? 'STOP' : 'VOICE',
      color: 'text-red-500',
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
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 20 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300, delay: index * 0.05 }}
                  onClick={() => handleAction(action.action)}
                  className="flex items-center gap-4 bg-surface dark:bg-zinc-900/40 rounded-[1.25rem] shadow-xl hover:shadow-2xl transition-all px-5 py-3.5 group border border-border clay-card"
                >
                  <action.icon className={cn("transition-colors", action.color)} size={20} />
                  <span className="text-xs font-black tracking-widest text-gray-700 dark:text-gray-200 whitespace-nowrap uppercase">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Button - Clay Styled */}
        <motion.button
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-16 h-16 md:w-20 md:h-20 rounded-[2.25rem] flex items-center justify-center text-white transition-all shadow-2xl",
            isRecording ? "bg-red-500 animate-pulse" : "btn-clay btn-clay-primary shadow-blue-500/30"
          )}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            {isOpen ? <FiX size={32} /> : <FiPlus size={32} />}
          </motion.div>
        </motion.button>
      </div>
    </>
  )
}
