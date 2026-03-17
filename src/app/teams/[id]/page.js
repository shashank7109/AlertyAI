/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

*/

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
import TeamChat from '@/components/teams/TeamChat'
import { cn } from '@/lib/utils'

export default function TeamDashboardPage() {
  const router = useRouter()
  const params = useParams()
  const teamId = params.id

  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState(null)
  const [activeTab, setActiveTab] = useState('chat') // chat, tasks, members, analytics
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
      <div className="mb-10">
        <button
          onClick={() => router.push('/teams')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 text-[10px] font-black tracking-widest uppercase"
        >
          <FiArrowLeft size={16} />
          <span>BACK TO HUB</span>
        </button>

        <div className="bg-white dark:bg-slate-800 clay-card rounded-[2.5rem] p-8 sm:p-10 border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">{team.name}</h1>
                {isLeader && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-black rounded-lg uppercase tracking-widest">
                    LEADER
                  </span>
                )}
              </div>
              {team.description && (
                <p className="text-sm font-medium text-gray-500 max-w-2xl mb-6">{team.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
                <span className="flex items-center gap-2">
                  <FiUsers size={14} className="text-blue-500" />
                  {team.members?.length || 0} Members
                </span>
                <span className="flex items-center gap-2">
                  <FiCheckCircle size={14} className="text-green-500" />
                  {stats.completed} DONE
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              {isLeader && (
                <>
                  {team.join_code && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(team.join_code)
                        toast.success(`Join code copied: ${team.join_code}`)
                      }}
                      className="flex items-center gap-2 px-4 h-12 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-2xl inner-shadow hover:shadow-md transition-all font-mono font-bold tracking-widest text-sm"
                      title="Copy join code"
                    >
                      <span>{team.join_code}</span>
                      <span className="text-[10px] font-black text-gray-400 uppercase">Copy</span>
                    </button>
                  )}
                  <button
                    onClick={() => router.push(`/teams/${teamId}/assign-task`)}
                    className="btn-clay btn-clay-primary px-8 py-3.5 text-xs tracking-widest uppercase"
                  >
                    Add Action
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {[
          { label: 'TOTAL', val: stats.total, icon: FiFileText, col: 'blue' },
          { label: 'ACTIVE', val: stats.in_progress, icon: FiClock, col: 'yellow' },
          { label: 'DONE', val: stats.completed, icon: FiCheckCircle, col: 'green' },
          { label: 'PENDING', val: stats.pending, icon: FiAlertCircle, col: 'red' }
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-[1.75rem] p-5 shadow-sm clay-card border-none"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center inner-shadow",
                s.col === 'blue' ? "bg-blue-50 text-blue-500" :
                  s.col === 'yellow' ? "bg-amber-50 text-amber-500" :
                    s.col === 'green' ? "bg-green-50 text-green-500" :
                      "bg-red-50 text-red-500"
              )}>
                <s.icon size={20} />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{s.val}</div>
                <div className="text-[10px] font-black text-gray-400 tracking-widest uppercase">{s.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm mb-10 overflow-hidden clay-card border-none p-2">
        <div className="flex bg-[#F8F9FC] dark:bg-slate-900/50 p-1.5 rounded-[1.5rem] overflow-x-auto inner-shadow">
          {['chat', 'tasks', 'members', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 min-w-[100px] px-6 py-3 text-[10px] font-black tracking-widest uppercase transition-all rounded-xl",
                activeTab === tab
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-md"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="p-4 sm:p-6">
            <TeamChat teamId={teamId} currentUserId={currentUserId} />
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="p-4 sm:p-6">
            {/* Task Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {['all', 'pending', 'in_progress', 'completed'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTaskFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${taskFilter === filter
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
                    className="clay-card border-none bg-white dark:bg-slate-800 p-6 hover:-translate-y-1 transition-all cursor-pointer group"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-black text-gray-900 dark:text-white mb-2 truncate group-hover:text-blue-500 transition-colors">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs font-medium text-gray-500 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <span className={cn("px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest", getPriorityColor(task.priority))}>
                        {task.priority?.toUpperCase() || 'MED'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span className={cn("px-3 py-1 rounded-lg inner-shadow", getStatusColor(task.status))}>
                        {task.status?.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1.5"><FiUser size={12} /> {task.assigned_to_name}</span>
                      {task.deadline && (
                        <span className="flex items-center gap-1.5"><FiClock size={12} /> {formatDate(task.deadline)}</span>
                      )}
                      {task.progress_percentage > 0 && (
                        <div className="flex-1 flex items-center gap-3 ml-2">
                          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${task.progress_percentage}%` }}></div>
                          </div>
                          <span className="text-blue-500 italic">{task.progress_percentage}%</span>
                        </div>
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
            <div className="mb-10 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] border-none clay-card">
              <h4 className="text-[10px] font-black tracking-widest text-blue-800 dark:text-blue-300 uppercase mb-4">Command Center</h4>
              <div className="flex flex-wrap gap-3">
                {team.members?.filter(m => m.role === 'leader').map(leader => (
                  <span key={leader.user_id} className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-300 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {leader.name}
                  </span>
                ))}
              </div>
            </div>

            {isLeader && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="w-full mb-8 btn-clay btn-clay-primary py-4 text-xs tracking-widest uppercase"
              >
                Assemble More Members
              </button>
            )}

            <div className="space-y-3">
              {team.members?.map((member, index) => (
                <motion.div
                  key={member.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="clay-card border-none bg-white dark:bg-slate-800 p-6 hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl flex-shrink-0 italic shadow-lg shadow-blue-500/20">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-black text-gray-900 dark:text-white tracking-tight">
                      {member.name}
                    </div>
                    <div className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
                      {member.email}
                    </div>
                  </div>

                  {/* Role Badge */}
                  <span className={cn(
                    "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                    member.role === 'leader'
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300"
                  )}>
                    {member.role === 'leader' ? 'COMMAND' : 'OPERATIVE'}
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

