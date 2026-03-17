/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

*/

'use client'

import { useState, useRef, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { FiSend, FiMic, FiPaperclip, FiCheck, FiExternalLink } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { aiAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function AIAssistantPage() {
  const router = useRouter()
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your AI assistant. I can help you manage tasks, create weekly plans, analyze your productivity, and much more. You can even create tasks just by chatting with me! Try saying 'Remind me to buy groceries tomorrow' or 'I need to finish the project report by Friday'. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!inputMessage.trim() || loading) return

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      const response = await aiAPI.chat(inputMessage)

      // Check if a task was created
      if (response.data.task_created && response.data.task) {
        const task = response.data.task
        toast.success(`✅ Task created: ${task.title || 'New task'}`, {
          duration: 4000,
          icon: '🎉',
        })
      }

      const aiMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: response.data.message || response.data.response || 'I can help you with tasks!',
        timestamp: new Date(),
        taskCreated: response.data.task_created || false,
        task: response.data.task || null,
      }
      setMessages(prev => [...prev, aiMessage])
      setLoading(false)
    } catch (error) {
      console.error('AI chat error:', error)
      // Fallback response
      const aiMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: generateMockResponse(inputMessage),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
      setLoading(false)
    }
  }

  const generateMockResponse = (query) => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes('task') || lowerQuery.includes('todo')) {
      return "I can help you manage your tasks! You can:\n\n1. Add a new task by clicking the + button\n2. Use voice commands to create tasks\n3. Break down large tasks into subtasks\n4. Set priorities and deadlines\n\nWould you like me to create a task for you?"
    }

    if (lowerQuery.includes('plan') || lowerQuery.includes('schedule')) {
      return "I'd be happy to help you create a plan! Based on your current tasks:\n\n📅 This Week:\n• Complete Project Report (High Priority)\n• Team Meeting on Wednesday\n• Buy Groceries (Low Priority)\n\nWould you like me to create a detailed weekly schedule?"
    }

    if (lowerQuery.includes('team') || lowerQuery.includes('collaborate')) {
      return "For team collaboration, I can help you:\n\n👥 Team Management:\n• Create new teams\n• Assign tasks to members\n• Track team progress\n• Send reminders to members\n\nWhat team would you like to work with?"
    }

    return "I understand you're asking about: " + query + "\n\nI can help you with:\n• Task management\n• Creating weekly plans\n• Team collaboration\n• Opportunity tracking\n• Smart reminders\n\nWhat would you like to know more about?"
  }

  const handleVoiceInput = () => {
    setIsRecording(!isRecording)
    toast('Voice input feature coming soon!', { icon: '🎤' })
  }

  const quickActions = [
    { text: 'Remind me to buy groceries tomorrow', icon: '🛒' },
    { text: 'Show my tasks', icon: '✅' },
    { text: 'Create weekly plan', icon: '📅' },
    { text: 'Team updates', icon: '👥' },
  ]

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-200px)] flex flex-col bg-surface dark:bg-background rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-xl md:text-2xl">💬</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-on-surface">AI Assistant</h1>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                Your intelligent productivity companion
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 bg-gray-50 dark:bg-gray-900/50">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[75%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1 ml-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs">
                        🤖
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">AI Assistant</span>
                    </div>
                  )}
                  <div
                    className={`p-3 md:p-4 rounded-2xl shadow-sm ${message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm border border-gray-200 dark:border-gray-700'
                      }`}
                  >
                    <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{message.content}</p>

                    {/* Show task creation confirmation */}
                    {message.taskCreated && message.task && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-start gap-2 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <FiCheck className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={18} />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
                              Task Created Successfully! ✅
                            </p>
                            <div className="text-xs text-green-700 dark:text-green-400 space-y-1">
                              <p><strong>Title:</strong> {message.task.title || 'Untitled'}</p>
                              {message.task.priority && (
                                <p><strong>Priority:</strong> {message.task.priority}</p>
                              )}
                              {message.task.category && (
                                <p><strong>Category:</strong> {message.task.category}</p>
                              )}
                              {message.task.subtasks && message.task.subtasks.length > 0 && (
                                <p><strong>Subtasks:</strong> {message.task.subtasks.length} created</p>
                              )}
                            </div>
                            <button
                              onClick={() => router.push('/tasks')}
                              className="mt-2 flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                            >
                              View Task <FiExternalLink size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-3 md:px-6 py-2 md:py-3 border-t border-border bg-surface dark:bg-background">
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(action.text)}
                className="flex-shrink-0 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap border border-blue-200 dark:border-blue-800"
              >
                <span className="mr-1.5">{action.icon}</span>
                {action.text}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-3 md:p-6 border-t border-border bg-surface dark:bg-background">
          <div className="flex gap-2 md:gap-3">
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 md:p-3 rounded-xl transition-all flex-shrink-0 ${isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-surface-hover/50 text-primary hover:scale-105 transition-all'
                }`}
            >
              <FiMic className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <div className="flex-1 flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-surface-hover/50 rounded-xl focus-within:ring-2 focus-within:ring-primary">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent outline-none text-sm md:text-base text-gray-900 dark:text-white placeholder-gray-500"
                disabled={loading}
              />
              <button
                type="button"
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiPaperclip className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all flex-shrink-0 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <FiSend className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

