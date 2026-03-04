'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { FiCheckCircle, FiClock, FiTarget, FiUsers, FiPlus, FiCheck } from 'react-icons/fi'
import { motion } from 'framer-motion'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { taskAPI, opportunityAPI, teamAPI, calendarAPI } from '@/lib/api'

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
      <div className="space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          {/* User Avatar */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {getGreeting()}, {userName}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </motion.div>

        {/* Today's Tasks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Today's Tasks</h2>
            <Link
              href="/tasks"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FiCheckCircle className="mx-auto mb-2" size={48} />
                <p>No tasks for today. You're all caught up! 🎉</p>
              </div>
            ) : (
              todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-600'
                    }`}
                  >
                    {task.completed && <FiCheck className="text-white" size={16} />}
                  </button>
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{task.due}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    task.priority === 'high'
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      : task.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Upcoming Deadlines Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Deadlines</h2>
            <Link
              href="/calendar"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingDeadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <FiClock className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{deadline.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{deadline.date}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  deadline.priority === 'high'
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {deadline.priority}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Opportunities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/opportunities" className="block">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">Opportunities</h3>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <FiTarget className="text-white" size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  {savedOpportunities.map((opp) => (
                    <div key={opp.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{opp.title}</span>
                      <span className="text-gray-500 dark:text-gray-400">{opp.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Team Updates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/teams" className="block">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">Team Updates</h3>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <FiUsers className="text-white" size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  {teamUpdates.map((update) => (
                    <div key={update.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{update.text}</span>
                      <span className="text-gray-500 dark:text-gray-400">{update.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>

          {/* AI Assistant Quick Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/ai-assistant" className="block">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">AI Assistant</h3>
                  <div className="text-3xl">🤖</div>
                </div>
                <p className="text-sm text-blue-100 mb-3">
                  Your personal productivity companion
                </p>
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-2 px-4 rounded-xl transition-all">
                  Chat Now
                </button>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
