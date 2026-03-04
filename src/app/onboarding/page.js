'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'

const steps = [
  {
    title: 'Welcome to Smaran AI! 👋',
    description: 'Your personal AI-powered productivity companion',
    content: (
      <div className="text-center space-y-6">
        <div className="text-9xl animate-float">🤖</div>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          We'll help you set up your account in just a few steps
        </p>
      </div>
    ),
  },
  {
    title: 'What best describes you?',
    description: 'Help us personalize your experience',
    content: (setData, data) => (
      <div className="grid grid-cols-2 gap-4">
        {[
          { value: 'student', label: 'Student', icon: '🎓' },
          { value: 'professional', label: 'Professional', icon: '💼' },
          { value: 'freelancer', label: 'Freelancer', icon: '🚀' },
          { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setData({ ...data, userType: option.value })}
            className={`p-6 rounded-xl border-2 transition-all ${
              data.userType === option.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
            }`}
          >
            <div className="text-4xl mb-2">{option.icon}</div>
            <div className="font-semibold">{option.label}</div>
          </button>
        ))}
      </div>
    ),
  },
  {
    title: 'Preferred language for voice input',
    description: 'Choose your primary language',
    content: (setData, data) => (
      <div className="space-y-3">
        {[
          { value: 'en', label: 'English' },
          { value: 'hi', label: 'हिंदी (Hindi)' },
          { value: 'ta', label: 'தமிழ் (Tamil)' },
          { value: 'te', label: 'తెలుగు (Telugu)' },
          { value: 'mr', label: 'मराठी (Marathi)' },
          { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setData({ ...data, language: option.value })}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              data.language === option.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option.label}</span>
              {data.language === option.value && (
                <FiCheck className="w-5 h-5 text-primary-600" />
              )}
            </div>
          </button>
        ))}
      </div>
    ),
  },
  {
    title: 'Enable notifications?',
    description: 'Never miss important tasks and deadlines',
    content: (setData, data) => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'taskReminders', label: 'Task Reminders', icon: '⏰', description: 'Get notified about upcoming tasks' },
            { key: 'deadlines', label: 'Deadline Alerts', icon: '🚨', description: 'Never miss a deadline' },
            { key: 'teamUpdates', label: 'Team Updates', icon: '👥', description: 'Stay updated with your team' },
            { key: 'aiSuggestions', label: 'AI Suggestions', icon: '🤖', description: 'Get smart productivity tips' },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setData({ ...data, notifications: { ...data.notifications, [option.key]: !data.notifications[option.key] } })}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                data.notifications[option.key]
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{option.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">{option.label}</span>
                    {data.notifications[option.key] && (
                      <FiCheck className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'All set! 🎉',
    description: 'Your account is ready to go',
    content: (
      <div className="text-center space-y-6">
        <div className="text-9xl animate-float">✨</div>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          You're all set to start your productivity journey with Smaran AI!
        </p>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-sm font-semibold">Add Tasks</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="text-3xl mb-2">🎤</div>
            <p className="text-sm font-semibold">Voice Input</p>
          </div>
          <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-sm font-semibold">Team Work</p>
          </div>
        </div>
      </div>
    ),
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState({
    userType: '',
    language: 'en',
    notifications: {
      taskReminders: true,
      deadlines: true,
      teamUpdates: true,
      aiSuggestions: true,
    },
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Save preferences and redirect to dashboard
      toast.success('Welcome to Smaran AI!')
      router.push('/dashboard')
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    if (currentStep === 1) return data.userType !== ''
    if (currentStep === 2) return data.language !== ''
    return true
  }

  const step = steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="h-2 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full"
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="card p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {step.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>

              {/* Step Content */}
              <div className="py-8">
                {typeof step.content === 'function' ? step.content(setData, data) : step.content}
              </div>

              {/* Navigation */}
              <div className="flex gap-4">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`${currentStep === 0 ? 'w-full' : 'flex-1'} btn-neon flex items-center justify-center gap-2`}
                >
                  {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
                  <FiArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

