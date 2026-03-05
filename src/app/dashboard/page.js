'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { FiCheckCircle, FiClock, FiTarget, FiUsers, FiPlus, FiCheck, FiMessageCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { taskAPI, opportunityAPI, teamAPI, calendarAPI } from '@/lib/api'
import { cn } from '@/lib/utils'

export default function Dashboard() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [userName, setUserName] = useState('User')
  const [loading, setLoading] = useState(true)
  const [todayTasks, setTodayTasks] = useState([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([])
  const [savedOpportunities, setSavedOpportunities] = useState([])
  const [teamUpdates, setTeamUpdates] = useState([])

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.full_name) {
      setUserName(user.full_name)
    } else if (user.username) {
      setUserName(user.username)
    } else if (user.name) {
      setUserName(user.name)
    }

    // Fetch dashboard data
    fetchDashboardData()

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Verify token exists before making requests
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found, redirecting to login')
        router.push('/login')
        return
      }

      // Fetch today's tasks
      const tasksRes = await calendarAPI.getTodayTasks()
      setTodayTasks(tasksRes.data?.tasks || tasksRes.data || [])

      // Fetch upcoming deadlines
      const upcomingRes = await calendarAPI.getUpcoming()
      setUpcomingDeadlines(upcomingRes.data?.tasks || upcomingRes.data || [])

      // Fetch opportunities
      const oppsRes = await opportunityAPI.getAll()
      const allOps = oppsRes.data.opportunities || oppsRes.data || []
      setSavedOpportunities(allOps.slice(0, 5)) // Limit to 5

      // Fetch team updates
      const teamsRes = await teamAPI.getAll()
      const allTeams = teamsRes.data.teams || teamsRes.data || []
      setTeamUpdates(allTeams.slice(0, 3).map(team => ({
        id: team._id || team.id,
        text: `${team.name} team activity`,
        time: 'Recently'
      })))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const toggleTask = async (taskId) => {
    try {
      await taskAPI.complete(taskId)
      setTodayTasks(todayTasks.map(task =>
        (task._id === taskId || task.id === taskId)
          ? { ...task, completed: !task.completed, status: task.completed ? 'pending' : 'completed' }
          : task
      ))
      toast.success('Task status updated!')
    } catch (error) {
      console.error('Error toggling task:', error)
      toast.error('Failed to update task')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-12 max-w-6xl mx-auto">
        {/* Welcome Header - Premium & Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-6">
            {/* User Avatar - Clay Circle */}
            <div className="w-20 h-20 rounded-[2rem] bg-surface-hover/50 dark:bg-zinc-900 flex items-center justify-center text-on-surface font-bold text-3xl shadow-xl border border-border clay-card">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase mb-1">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()} • {currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase()}
              </p>
              <h1 className="text-4xl font-heading font-bold text-on-surface tracking-tighter leading-none">
                {getGreeting().toUpperCase()}, {userName.split(' ')[0].toUpperCase()}
              </h1>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/tasks" className="btn-clay btn-clay-primary px-8 py-3 text-xs tracking-widest uppercase mb-4">
              Add Task
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Today's Tasks Section - Clay Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="clay-card bg-surface dark:bg-surface border-none"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-heading font-bold text-on-surface tracking-tight italic uppercase">Today</h2>
              <Link
                href="/tasks"
                className="text-[10px] font-bold text-text-secondary tracking-widest uppercase hover:text-primary transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {todayTasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Everything is completed</p>
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-5 p-4 rounded-[1.5rem] bg-surface-hover/30 dark:bg-zinc-900/30 inner-shadow transition-all group"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${task.completed
                        ? 'bg-primary shadow-lg'
                        : 'bg-background border border-border shadow-sm'
                        }`}
                    >
                      {task.completed && <FiCheck className="text-on-primary" size={14} />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-base font-bold tracking-tight ${task.completed ? 'line-through text-gray-300 dark:text-gray-600' : 'text-gray-800 dark:text-gray-100'}`}>
                        {task.title}
                      </p>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 group-hover:text-blue-500 transition-colors">
                      {task.priority?.toUpperCase() || 'NORMAL'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Upcoming Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="clay-card bg-surface dark:bg-surface border-none"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-heading font-bold text-on-surface tracking-tight italic uppercase">Upcoming</h2>
              <Link href="/calendar" className="text-[10px] font-bold text-text-secondary tracking-widest uppercase hover:text-primary transition-colors">
                Timeline
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingDeadlines.slice(0, 4).map((deadline) => (
                <div
                  key={deadline.id}
                  className="flex items-center justify-between p-4 rounded-[1.5rem] hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-soft dark:bg-zinc-800 flex items-center justify-center text-primary dark:text-white shadow-sm">
                      <FiClock size={18} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-800 dark:text-gray-200 tracking-tight">{deadline.title}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{deadline.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row - Minimalist Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'OPPORTUNITIES', count: savedOpportunities.length, color: 'text-purple-500', href: '/opportunities', icon: FiTarget },
            { title: 'TEAM UPDATES', count: teamUpdates.length, color: 'text-emerald-500', href: '/teams', icon: FiUsers },
            { title: 'AI ASSISTANT', desc: 'READY TO PLAN', color: 'text-blue-500', href: '/ai-assistant', icon: FiMessageCircle },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Link href={stat.href} className="block group">
                <div className="clay-card bg-surface dark:bg-surface border-none group-hover:-translate-y-1 transition-transform shadow-md">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn("w-10 h-10 rounded-xl bg-primary-soft dark:bg-zinc-800 flex items-center justify-center", "text-primary dark:text-white")}>
                      <stat.icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">{stat.title}</span>
                  </div>
                  {stat.count !== undefined ? (
                    <p className="text-3xl font-heading font-bold text-on-surface tracking-tighter">{stat.count}</p>
                  ) : (
                    <p className="text-sm font-bold text-primary tracking-widest uppercase">{stat.desc}</p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
