'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiUsers, FiCheck, FiX, FiLoader } from 'react-icons/fi'
import { teamAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export default function JoinTeamPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token

  const [loading, setLoading] = useState(false)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState(null)

  const handleJoin = async () => {
    setJoining(true)
    try {
      const response = await teamAPI.joinTeam(token)
      toast.success('Successfully joined the team!')
      router.push(`/teams/${response.data.id || response.data._id}`)
    } catch (error) {
      console.error('Error joining team:', error)
      const errorMsg = error.response?.data?.detail || 'Failed to join team'
      toast.error(errorMsg)
      setError(errorMsg)
    } finally {
      setJoining(false)
    }
  }

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to join the team')
      router.push(`/login?redirect=/teams/join/${params.token}`)
    }
  }, [params.token, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
      >
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <FiUsers className="text-blue-600 dark:text-blue-400" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Join Team
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You've been invited to join a team on AlertyAI
          </p>
        </div>

        {error ? (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <FiX className="mx-auto text-red-500 mb-2" size={24} />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <p className="text-blue-900 dark:text-blue-100 text-sm">
              Click the button below to join the team and start collaborating!
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleJoin}
            disabled={joining || error}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {joining ? (
              <>
                <FiLoader className="animate-spin" size={20} />
                Joining...
              </>
            ) : (
              <>
                <FiCheck size={20} />
                Join Team
              </>
            )}
          </button>

          <button
            onClick={() => router.push('/teams')}
            className="w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Go to My Teams
          </button>
        </div>
      </motion.div>
    </div>
  )
}

