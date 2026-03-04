'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiUsers, FiCheckCircle, FiClock, FiTrendingUp, FiMoreVertical, FiLink } from 'react-icons/fi'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { teamAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export default function TeamsPage() {
  const router = useRouter()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('grid') // grid or list
  const [copiedTeamId, setCopiedTeamId] = useState(null)
  const [pendingInvitations, setPendingInvitations] = useState([])
  const [processingInvite, setProcessingInvite] = useState(null)

  useEffect(() => {
    fetchTeams()
    fetchPendingInvitations()
  }, [])

  const fetchPendingInvitations = async () => {
    try {
      const response = await teamAPI.getMyPendingInvitations()
      setPendingInvitations(response.data || [])
    } catch (error) {
      console.error('Error fetching invitations:', error)
    }
  }

  const handleAcceptInvitation = async (invitationId) => {
    setProcessingInvite(invitationId)
    try {
      await teamAPI.acceptInvitation(invitationId)
      toast.success('Joined team successfully!')
      fetchTeams()
      fetchPendingInvitations()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to accept invitation')
    }
    setProcessingInvite(null)
  }

  const handleDeclineInvitation = async (invitationId) => {
    setProcessingInvite(invitationId)
    try {
      await teamAPI.declineInvitation(invitationId)
      toast.success('Invitation declined')
      fetchPendingInvitations()
    } catch (error) {
      toast.error('Failed to decline invitation')
    }
    setProcessingInvite(null)
  }

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const response = await teamAPI.getAll()
      setTeams(response.data || [])
    } catch (error) {
      console.error('Error fetching teams:', error)
      toast.error('Failed to load teams')
    } finally {
      setLoading(false)
    }
  }

  const getTeamStats = (team) => {
    const tasks = team.tasks || []
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed').length
    const pending = tasks.filter(t => t.status === 'pending').length
    const inProgress = tasks.filter(t => t.status === 'in_progress').length
    
    return { total, completed, pending, inProgress }
  }

  const getPurposeEmoji = (purpose) => {
    const emojiMap = {
      hackathon: '💻',
      college_project: '🎓',
      office_work: '💼',
      startup: '🚀',
      freelance: '💰',
      family: '👨‍👩‍👧‍👦',
      ngo: '🤝',
      farmers_group: '🌾',
      shop_staff: '🏪',
      construction: '🏗️',
      event_management: '🎉',
      other: '📋'
    }
    return emojiMap[purpose] || '📋'
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Teams
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Collaborate with your team members on tasks and projects
            </p>
          </div>
          <button
            onClick={() => router.push('/teams/create')}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <FiPlus size={20} />
            <span>Create Team</span>
          </button>
        </div>
      </div>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 sm:p-6"
        >
          <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-100 mb-4 flex items-center gap-2">
            📬 Pending Invitations ({pendingInvitations.length})
          </h3>
          <div className="space-y-3">
            {pendingInvitations.map((invitation) => (
              <div
                key={invitation._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
              >
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {invitation.team_name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Invited by {invitation.invited_by_name}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeclineInvitation(invitation._id)}
                    disabled={processingInvite === invitation._id}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAcceptInvitation(invitation._id)}
                    disabled={processingInvite === invitation._id}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50"
                  >
                    {processingInvite === invitation._id ? 'Joining...' : 'Accept'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && teams.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 sm:py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
        >
          <div className="mb-6">
            <FiUsers size={64} className="mx-auto text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Teams Yet
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 px-4">
            Create your first team to start collaborating with others
          </p>
          <button
            onClick={() => router.push('/teams/create')}
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            <FiPlus size={20} />
            Create Your First Team
          </button>
        </motion.div>
      )}

      {/* Teams Grid */}
      {!loading && teams.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence>
            {teams.map((team, index) => {
              const stats = getTeamStats(team)
              const completionRate = stats.total > 0 ? (stats.completed / stats.total * 100).toFixed(0) : 0
              const isLeader = team.leader_id === localStorage.getItem('user_id')
              const inviteLink = team.invite_token ? `${window.location.origin}/teams/join/${team.invite_token}` : null
              
              const copyInviteLink = (e) => {
                e.stopPropagation()
                if (inviteLink) {
                  navigator.clipboard.writeText(inviteLink)
                  setCopiedTeamId(team.id || team._id)
                  toast.success('Invite link copied! Share it with your team members.')
                  setTimeout(() => setCopiedTeamId(null), 3000)
                }
              }
              
              return (
                <motion.div
                  key={team.id || team._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => router.push(`/teams/${team.id || team._id}`)}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-3xl sm:text-4xl flex-shrink-0">
                        {getPurposeEmoji(team.purpose)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors truncate">
                          {team.name}
                        </h3>
                        {isLeader && (
                          <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded mt-1">
                            Leader
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {team.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {team.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2 sm:p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <FiUsers size={14} className="text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        {team.members?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Members
                      </div>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-2 sm:p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <FiCheckCircle size={14} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                        {stats.completed}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Done
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-2 sm:p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <FiClock size={14} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.pending + stats.inProgress}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Active
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Completion</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {completionRate}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionRate}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        Updated {new Date(team.updated_at).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        {isLeader && inviteLink && (
                          <button
                            onClick={copyInviteLink}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                              copiedTeamId === (team.id || team._id)
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200'
                            }`}
                          >
                            <FiLink size={12} />
                            <span>{copiedTeamId === (team.id || team._id) ? 'Copied!' : 'Invite'}</span>
                          </button>
                        )}
                        <div className="flex items-center gap-1">
                          <FiTrendingUp size={12} />
                          <span className="font-medium">
                            {stats.total} tasks
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </DashboardLayout>
  )
}
