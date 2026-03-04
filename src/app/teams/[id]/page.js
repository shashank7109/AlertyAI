'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiArrowLeft, FiUsers, FiCheckCircle, FiClock, FiAlertCircle,
  FiPlus, FiMoreVertical, FiTrendingUp, FiMail, FiPhone, FiLink,
  FiEdit, FiTrash2, FiMessageSquare, FiFileText
} from 'react-icons/fi'
import DashboardLayout from '@/components/layout/DashboardLayout'
import TaskAcceptDialog from '@/components/teams/TaskAcceptDialog'
import TaskActionDialog from '@/components/teams/TaskActionDialog'
import { teamAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export default function TeamDashboardPage() {
  const router = useRouter()
  const params = useParams()
  const teamId = params.id

  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState(null)
  const [activeTab, setActiveTab] = useState('tasks') // tasks, members, analytics
  const [taskFilter, setTaskFilter] = useState('all') // all, pending, in_progress, completed
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showMemberActions, setShowMemberActions] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [currentUserId, setCurrentUserId] = useState(null)
  
  // Check if current user is a leader (original leader, co-leader, or member with leader role)
  const isLeader = team && currentUserId && (
    team.leader_id === currentUserId ||
    team.co_leaders?.includes(currentUserId) ||
    team.members?.some(m => m.user_id === currentUserId && m.role === 'leader')
  )
  
  const [showInviteLinkModal, setShowInviteLinkModal] = useState(false)
  const inviteLink = team?.invite_link || (team?.invite_token ? `${typeof window !== 'undefined' ? window.location.origin : ''}/teams/join/${team.invite_token}` : null)

  useEffect(() => {
    // Get user ID from localStorage
    try {
      // First check if user_id is directly stored
      let userId = localStorage.getItem('user_id')
      
      // If not, try to extract from user object
      if (!userId) {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const user = JSON.parse(userStr)
          userId = user._id || user.id || user.user_id
          // Store for future use
          if (userId) {
            localStorage.setItem('user_id', userId)
          }
        }
      }
      
      console.log('Current user_id:', userId)
      setCurrentUserId(userId)
    } catch (e) {
      console.error('Error getting user_id from localStorage:', e)
    }
  }, [])

  useEffect(() => {
    if (teamId) {
      fetchTeam()
    }
  }, [teamId, currentUserId])

  const fetchTeam = async () => {
    try {
      setLoading(true)
      const response = await teamAPI.getById(teamId)
      const teamData = response.data
      console.log('Team data:', teamData)
      console.log('Leader ID:', teamData.leader_id)
      console.log('Co-leaders:', teamData.co_leaders)
      console.log('Current user ID:', currentUserId)
      console.log('Is leader check:', teamData.leader_id === currentUserId)
      setTeam(teamData)
    } catch (error) {
      console.error('Error fetching team:', error)
      toast.error('Failed to load team')
    } finally {
      setLoading(false)
    }
  }

  const getFilteredTasks = () => {
    if (!team?.tasks) return []
    
    // Safety filter: Members should only see tasks assigned to them
    // Leaders/co-leaders see all tasks (already filtered by backend, but double-check)
    let visibleTasks = team.tasks
    
    if (!isLeader && currentUserId) {
      // Members: Only see tasks assigned to them (submit_task type, not collect_task)
      visibleTasks = team.tasks.filter(t => 
        String(t.assigned_to) === String(currentUserId) && 
        t.task_type !== 'collect_task'
      )
    }
    
    // Apply status filter
    if (taskFilter === 'all') return visibleTasks
    return visibleTasks.filter(t => t.status === taskFilter)
  }

  const getTaskStats = () => {
    const tasks = team?.tasks || []
    
    // For members: only count their own tasks
    // For leaders: count all member tasks (submit_task type)
    let visibleTasks = tasks
    if (!isLeader && currentUserId) {
      visibleTasks = tasks.filter(t => 
        String(t.assigned_to) === String(currentUserId) && 
        t.task_type !== 'collect_task'
      )
    } else {
      // Leaders: only count SUBMIT_TASK (member tasks), not COLLECT_TASK (leader tasks)
      visibleTasks = tasks.filter(t => t.task_type !== 'collect_task')
    }
    
    return {
      total: visibleTasks.length,
      pending: visibleTasks.filter(t => t.status === 'pending').length,
      in_progress: visibleTasks.filter(t => t.status === 'in_progress' || t.status === 'accepted').length,
      completed: visibleTasks.filter(t => t.status === 'completed').length,
      overdue: visibleTasks.filter(t => t.status === 'overdue').length,
    }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    }
    return colors[priority] || colors.medium
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      accepted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    }
    return colors[status] || colors.pending
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline'
    const date = new Date(dateString)
    const now = new Date()
    const diff = date - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days < 0) return '⚠️ Overdue'
    if (days === 0) return '🔥 Today'
    if (days === 1) return '⏰ Tomorrow'
    if (days < 7) return `📅 ${days} days left`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const stats = getTaskStats()
  const filteredTasks = getFilteredTasks()

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!team) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Team not found</p>
          <button
            onClick={() => router.push('/teams')}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            Back to Teams
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/teams')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
        >
          <FiArrowLeft size={20} />
          <span>Back to Teams</span>
        </button>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{team.name}</h1>
              {team.description && (
                <p className="text-blue-100 mb-4">{team.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1">
                  <FiUsers size={16} />
                  {team.members?.length || 0} members
                </span>
                <span className="flex items-center gap-1">
                  <FiCheckCircle size={16} />
                  {stats.completed} completed
                </span>
                {isLeader && (
                  <span className="px-2 py-1 bg-white/20 rounded-lg font-semibold">
                    👑 Team Leader
                  </span>
                )}
              </div>
            </div>
            
            {/* Action Buttons - Show for leaders */}
            <div className="flex gap-2">
              {isLeader ? (
                <>
                  <button
                    onClick={() => {
                      if (inviteLink) {
                        navigator.clipboard.writeText(inviteLink)
                        toast.success('Invite link copied!')
                      }
                    }}
                    className="flex items-center gap-2 bg-white/20 text-white px-3 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition-colors"
                    title="Copy invite link"
                  >
                    <FiLink size={18} />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                  <button
                    onClick={() => router.push(`/teams/${teamId}/assign-task`)}
                    className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                  >
                    <FiPlus size={20} />
                    <span className="hidden sm:inline">Assign Task</span>
                    <span className="sm:hidden">Task</span>
                  </button>
                </>
              ) : (
                <span className="px-3 py-2 bg-white/10 rounded-xl text-sm">
                  Member
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FiFileText className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <FiClock className="text-yellow-600 dark:text-yellow-400" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.in_progress}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Active</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <FiCheckCircle className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Done</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FiAlertCircle className="text-red-600 dark:text-red-400" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-6 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {['tasks', 'members', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[100px] px-4 py-3 sm:py-4 font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="p-4 sm:p-6">
            {/* Task Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {['all', 'pending', 'in_progress', 'completed'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTaskFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    taskFilter === filter
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <FiFileText size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No tasks found</p>
                </div>
              ) : (
                filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold flex-shrink-0 ${getPriorityColor(task.priority)}`}>
                        {task.priority?.toUpperCase() || 'MED'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span className={`px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                        {task.status?.replace('_', ' ').toUpperCase()}
                      </span>
                      <span>👤 {task.assigned_to_name}</span>
                      {task.deadline && (
                        <span>{formatDate(task.deadline)}</span>
                      )}
                      {task.progress_percentage > 0 && (
                        <span className="flex items-center gap-1">
                          <FiTrendingUp size={12} />
                          {task.progress_percentage}%
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="p-4 sm:p-6">
            {/* Team Leaders Section */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Team Leaders</h4>
              <div className="flex flex-wrap gap-2">
                {team.members?.filter(m => m.role === 'leader').map(leader => (
                  <span key={leader.user_id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-lg text-sm">
                    👑 {leader.name}
                  </span>
                ))}
              </div>
            </div>

            {isLeader && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="w-full mb-4 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                <FiPlus size={20} />
                Invite More Members
              </button>
            )}

            <div className="space-y-3">
              {team.members?.map((member, index) => (
                <motion.div
                  key={member.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl relative"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white truncate">
                      {member.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {member.email}
                    </div>
                  </div>
                  
                  {/* Role Badge */}
                  <span className={`px-3 py-1 text-xs font-semibold rounded-lg flex-shrink-0 ${
                    member.role === 'leader' 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {member.role === 'leader' ? '👑 Leader' : 'Member'}
                  </span>

                  {/* Leader Actions Menu */}
                  {isLeader && member.user_id !== currentUserId && (
                    <div className="relative">
                      <button
                        onClick={() => setShowMemberActions(showMemberActions === member.user_id ? null : member.user_id)}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FiMoreVertical size={18} />
                      </button>
                      
                      {showMemberActions === member.user_id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10 overflow-hidden">
                          {member.role !== 'leader' && (
                            <button
                              onClick={async () => {
                                try {
                                  await teamAPI.promoteToLeader(teamId, member.user_id)
                                  toast.success(`${member.name} is now a leader!`)
                                  fetchTeam()
                                } catch (err) {
                                  toast.error('Failed to promote member')
                                }
                                setShowMemberActions(null)
                              }}
                              className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                              👑 Make Leader
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              if (confirm(`Remove ${member.name} from the team?`)) {
                                try {
                                  await teamAPI.removeMember(teamId, member.user_id)
                                  toast.success(`${member.name} removed from team`)
                                  fetchTeam()
                                } catch (err) {
                                  toast.error('Failed to remove member')
                                }
                              }
                              setShowMemberActions(null)
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                          >
                            <FiTrash2 size={16} /> Remove Member
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Delete Team Button */}
            {isLeader && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-500 text-red-600 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <FiTrash2 size={20} />
                  Delete Team
                </button>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="p-4 sm:p-6">
            <div className="text-center py-12">
              <FiTrendingUp size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">Analytics Coming Soon</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Track team productivity, completion rates, and more
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Task Dialogs */}
      {selectedTask && (
        <>
          {/* Show Accept/Reject dialog only for pending tasks */}
          {selectedTask.status === 'pending' && !isLeader && (
            <TaskAcceptDialog
              task={{
                ...selectedTask,
                team_id: teamId,
                task_id: selectedTask.id,
                team_name: team.name
              }}
              onClose={() => setSelectedTask(null)}
              onUpdate={fetchTeam}
            />
          )}
          
          {/* Show Action dialog for accepted/submitted/completed tasks */}
          {(selectedTask.status !== 'pending' || isLeader) && (
            <TaskActionDialog
              task={{
                ...selectedTask,
                team_id: teamId,
                task_id: selectedTask.id,
                team_name: team.name
              }}
              onClose={() => setSelectedTask(null)}
              onUpdate={fetchTeam}
              isLeader={isLeader}
              currentUserId={currentUserId}
              allTasks={team.tasks || []}
            />
          )}
        </>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal 
          teamId={teamId}
          inviteLink={inviteLink}
          onClose={() => setShowInviteModal(false)}
          onInvited={fetchTeam}
        />
      )}

      {/* Delete Team Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Team?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will permanently delete "{team.name}" and all its tasks. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setDeleting(true)
                  try {
                    await teamAPI.delete(teamId)
                    toast.success('Team deleted')
                    router.push('/teams')
                  } catch (err) {
                    toast.error('Failed to delete team')
                  }
                  setDeleting(false)
                }}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Team'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  )
}

// Invite Modal Component
function InviteModal({ teamId, inviteLink, onClose, onInvited }) {
  const [emails, setEmails] = useState('')
  const [sending, setSending] = useState(false)

  const handleInvite = async () => {
    const emailList = emails.split(',').map(e => e.trim()).filter(e => e)
    if (emailList.length === 0) {
      toast.error('Please enter at least one email')
      return
    }

    setSending(true)
    try {
      await teamAPI.inviteMembers(teamId, emailList, [])
      toast.success(`Invitation sent to ${emailList.length} email(s)`)
      onInvited()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to send invitations')
    }
    setSending(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Invite Members</h3>
        
        {/* Invite Link */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Share Invite Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inviteLink || ''}
              readOnly
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(inviteLink)
                toast.success('Link copied!')
              }}
              className="px-4 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Email Invites */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Invite by Email
          </label>
          <textarea
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="Enter emails separated by commas..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate multiple emails with commas
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            disabled={sending}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send Invites'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

