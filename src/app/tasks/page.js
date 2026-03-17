/**
 * Copyright (c) 2026 AlertyAI
 * SPDX-License-Identifier: MIT
 */

'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import TaskModal from '@/components/modals/TaskModal'
import ImageUploadButton from '@/components/common/ImageUploadButton'
import TaskActionButtons from '@/components/tasks/TaskActionButtons'
import {
  FiCheck, FiFilter, FiPlus, FiCalendar, FiList, FiArchive,
  FiActivity, FiClock, FiChevronLeft, FiChevronRight
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { taskAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

// --- Auxiliary Component: Calendar Cell ---
const CalendarDay = ({ date, tasks, isCurrentMonth, onClick }) => {
  return (
    <div
      onClick={() => onClick(date)}
      className={`min-h-[100px] border border-border dark:border-zinc-800 p-2 transition-colors hover:bg-surface-hover/50 dark:hover:bg-zinc-800/50 cursor-pointer ${!isCurrentMonth ? 'bg-surface-hover/20 dark:bg-zinc-950/50 text-text-secondary' : 'bg-surface dark:bg-zinc-900/40'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-sm font-semibold ${date.toDateString() === new Date().toDateString() ? 'bg-primary text-on-primary w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
          {date.getDate()}
        </span>
        {tasks.length > 0 && (
          <span className="text-xs text-gray-400">{tasks.length}</span>
        )}
      </div>
      <div className="space-y-1">
        {tasks.slice(0, 3).map((task) => (
          <div key={task._id || task.id} className={`text-[10px] px-1 py-0.5 rounded truncate ${task.completed ? 'line-through opacity-50' : ''
            } ${task.task_type === 'collect_task'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}>
            {task.title}
          </div>
        ))}
        {tasks.length > 3 && (
          <div className="text-[10px] text-gray-400 pl-1">+{tasks.length - 3} more</div>
        )}
      </div>
    </div>
  )
}

export default function TasksPage() {
  const router = useRouter()
  // --- Core State ---
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  // --- View State (New) ---
  const [viewMode, setViewMode] = useState('list') // 'list', 'calendar', 'later'
  const [showActivityLog, setShowActivityLog] = useState(false)
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date())

  // --- Filter State ---
  const [filter, setFilter] = useState('all')
  const [taskTypeFilter, setTaskTypeFilter] = useState('all')
  const [extractedTaskData, setExtractedTaskData] = useState(null)

  // --- Mock Activity Logs (Since API is missing logs) ---
  const [activities] = useState([
    { id: 1, text: "System synced 3 tasks", time: "2m ago", type: "system" },
    { id: 2, text: "You completed 'Update Documentation'", time: "1h ago", type: "user" },
    { id: 3, text: "New Collect Task assigned from Leader", time: "3h ago", type: "alert" },
  ])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchTasks()
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') fetchTasks()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // --- WebSocket for Real-time Task Sync ---
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    let userId = localStorage.getItem('user_id')

    if (!userId && userStr) {
      try {
        const userObj = JSON.parse(userStr)
        userId = userObj._id || userObj.id
      } catch (e) { }
    }

    if (!token || !userId) return

    let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    // Remove /api if present at the end of API_URL
    if (API_URL.endsWith('/api')) {
      API_URL = API_URL.slice(0, -4)
    }
    const wsBase = API_URL.replace('http', 'ws')
    const wsUrl = `${wsBase}/ws/user/${userId}?token=${token}`

    console.log('[Tasks WS] Connecting to:', wsUrl)
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log('[Tasks WS] Connected')
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('[Tasks WS] Message received:', data)
        if (data.type === 'task_created' && data.task) {
          setTasks(prev => {
            // Avoid duplicates
            const existingId = data.task._id || data.task.id
            if (prev.some(t => (t._id || t.id) === existingId || t.title === data.task.title)) {
              return prev
            }
            return [data.task, ...prev]
          })
          toast.success(`New task: ${data.task.title}`)
        }
      } catch (err) {
        console.error('[Tasks WS] Error parsing message:', err)
      }
    }

    ws.onclose = () => {
      console.log('[Tasks WS] Disconnected')
    }

    return () => {
      ws.close()
    }
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await taskAPI.getAll()
      const fetchedTasks = response.data.tasks || response.data || []
      setTasks(fetchedTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
      } else {
        toast.error('Failed to load tasks')
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleTaskCompletion = async (taskId) => {
    try {
      await taskAPI.complete(taskId)
      setTasks(tasks.map(task =>
        task.id === taskId || task._id === taskId
          ? { ...task, completed: !task.completed, status: task.completed ? 'pending' : 'completed' }
          : task
      ))
      toast.success('Task updated!')
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleAddTask = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleTaskExtracted = (taskData) => {
    setExtractedTaskData(taskData)
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  // --- Helpers ---
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
      case 'medium': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'low': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Work': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      'Personal': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      'Meeting': 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      'Ideas': 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    }
    return colors[category] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  }

  const isCollectTask = (task) => task.task_type === 'collect_task'

  // --- Filtering Logic ---
  const getFilteredTasks = () => {
    let filtered = tasks

    // 1. Filter by Task Type
    if (taskTypeFilter === 'my_work') filtered = tasks.filter(task => !isCollectTask(task))
    else if (taskTypeFilter === 'to_collect') filtered = tasks.filter(task => isCollectTask(task))

    // 2. Filter by View Mode Specifics
    if (viewMode === 'later') {
      // "Later" logic: Tasks with NO due date or explicitly low priority
      return filtered.filter(task => {
        const hasDate = task.due_date || task.dueDate || task.deadline
        return !hasDate
      })
    }

    // 3. Filter by Time
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (filter === 'past') {
      filtered = filtered.filter(task => {
        const taskDate = task.due_date || task.dueDate || task.deadline
        if (!taskDate) return false
        try {
          const date = new Date(taskDate)
          date.setHours(0, 0, 0, 0)
          return date < today && !task.completed && task.status !== 'completed'
        } catch { return false }
      })
    } else if (filter === 'today') {
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      filtered = filtered.filter(task => {
        const taskDate = task.due_date || task.dueDate || task.deadline
        if (!taskDate) return false
        try {
          const date = new Date(taskDate)
          date.setHours(0, 0, 0, 0)
          return date >= today && date < tomorrow
        } catch { return false }
      })
    } else if (filter === 'weekly') {
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 7)
      filtered = filtered.filter(task => {
        const taskDate = task.due_date || task.dueDate || task.deadline
        if (!taskDate) return false
        try {
          const date = new Date(taskDate)
          date.setHours(0, 0, 0, 0)
          return date >= startOfWeek && date < endOfWeek
        } catch { return false }
      })
    } else if (filter === 'monthly') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      filtered = filtered.filter(task => {
        const taskDate = task.due_date || task.dueDate || task.deadline
        if (!taskDate) return false
        try {
          const date = new Date(taskDate)
          date.setHours(0, 0, 0, 0)
          return date >= startOfMonth && date <= endOfMonth
        } catch { return false }
      })
    }

    return filtered
  }

  const finalTasks = getFilteredTasks()

  // --- Calendar Logic ---
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []

    // Padding days
    for (let i = 0; i < firstDay.getDay(); i++) {
      const d = new Date(year, month, 0 - i) // Previous month days
      days.unshift({ date: d, isCurrentMonth: false })
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }

    // Next month padding (to fill grid to 35 or 42)
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }

    return days
  }

  const changeMonth = (offset) => {
    const newDate = new Date(currentCalendarDate.setMonth(currentCalendarDate.getMonth() + offset))
    setCurrentCalendarDate(new Date(newDate))
  }

  // --- Main Render Components ---

  const TaskListItem = ({ task }) => {
    const taskId = task._id || task.id
    const isCompleted = task.status === 'completed' || task.completed
    const isCollectTaskType = isCollectTask(task)
    const taskTitle = task.title || task.name
    const displayTitle = taskTitle?.startsWith('Collect:') ? taskTitle.replace(/^Collect:\s*/i, '').trim() : taskTitle
    const dueDate = task.due_date || task.dueDate || task.deadline
    const formattedDate = dueDate ? new Date(dueDate).toLocaleDateString() : 'No Date'

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "group relative flex flex-col sm:flex-row gap-5 p-5 rounded-[1.75rem] transition-all hover:-translate-y-1 clay-card border-none",
          isCollectTaskType ? "bg-primary-soft/50 dark:bg-zinc-800/40" : "bg-surface dark:bg-zinc-900/40"
        )}
        onClick={() => handleEditTask(task)}
      >
        {isCollectTaskType && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />}

        <div className="flex items-center gap-5 flex-1">
          <button
            onClick={(e) => { e.stopPropagation(); toggleTaskCompletion(taskId); }}
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${isCompleted
              ? 'bg-primary shadow-lg'
              : 'bg-background border border-border inner-shadow'
              }`}
          >
            {isCompleted && <FiCheck className="text-on-primary" size={14} />}
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`text-base font-semibold tracking-tight ${isCompleted ? 'line-through text-gray-300 dark:text-gray-600' : 'text-gray-800 dark:text-gray-100'}`}>
                {displayTitle}
              </h3>
              {isCollectTaskType && <span className="text-[10px] font-semibold px-2 py-0.5 bg-primary-soft text-primary rounded uppercase tracking-widest">ASSIGNED</span>}
            </div>

            <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              <span className="flex items-center gap-1.5"><FiCalendar size={12} /> {formattedDate}</span>
              <span className={cn("px-2.5 py-1 rounded-lg", getPriorityColor(task.priority))}>
                {task.priority?.toUpperCase() || 'MEDIUM'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions - visible on hover on desktop, always on mobile if needed */}
        <div className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
          <TaskActionButtons task={task} onUpdate={fetchTasks} />

          {/* Explicit Edit Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[#F8F9FC] dark:bg-slate-900/50 text-gray-400 hover:text-blue-500 hover:shadow-md transition-all inner-shadow"
            title="Edit Task"
          >
            <FiEdit size={16} />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 pb-10 flex gap-6 relative">

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 min-w-0">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-heading font-semibold text-on-surface tracking-tighter uppercase">Tasks</h1>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-text-secondary uppercase mt-1">Manage your work</p>
            </div>

            <div className="flex items-center gap-4">
              <ImageUploadButton onTaskExtracted={handleTaskExtracted} />
              <button
                onClick={handleAddTask}
                className="btn-clay btn-clay-primary px-8 py-3 text-xs tracking-widest uppercase mb-4"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowActivityLog(!showActivityLog)}
                className="w-11 h-11 flex items-center justify-center text-text-secondary bg-surface dark:bg-zinc-900 rounded-2xl shadow-sm border border-border hover:shadow-md transition-all"
              >
                <FiActivity size={18} />
              </button>
            </div>
          </div>

          {/* View Switcher & Filters */}
          <div className="clay-card border-none bg-surface dark:bg-surface p-2 mb-10 flex flex-col sm:flex-row gap-6 items-center justify-between">

            {/* View Tabs */}
            <div className="flex bg-surface-hover/30 dark:bg-zinc-900/50 p-1.5 rounded-[1.25rem] w-full sm:w-auto inner-shadow">
              {[
                { id: 'list', icon: FiList, label: 'LIST' },
                { id: 'calendar', icon: FiCalendar, label: 'SCHEDULE' },
                { id: 'later', icon: FiArchive, label: 'LATER' }
              ].map(view => (
                <button
                  key={view.id}
                  onClick={() => {
                    setViewMode(view.id)
                    setFilter('all') // Reset date filters when changing view
                  }}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all flex-1 sm:flex-none justify-center",
                    viewMode === view.id
                      ? "bg-surface text-primary shadow-md"
                      : "text-text-secondary hover:text-primary"
                  )}
                >
                  <view.icon size={14} /> {view.label}
                </button>
              ))}
            </div>

            {/* Filters (Only show relevant filters for List view) */}
            {viewMode === 'list' && (
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
                <select
                  value={taskTypeFilter}
                  onChange={(e) => setTaskTypeFilter(e.target.value)}
                  className="text-sm border-none bg-transparent font-medium text-gray-600 dark:text-gray-300 focus:ring-0 cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="my_work">My Work</option>
                  <option value="to_collect">To Collect</option>
                </select>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 self-center mx-1"></div>
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                  {['all', 'past', 'today', 'weekly', 'monthly'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${filter === f
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CONTENT RENDERER */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">

              {/* 1. LIST VIEW */}
              {viewMode === 'list' && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {loading ? (
                    <div className="text-center py-12"><div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                  ) : finalTasks.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                      <p className="text-gray-500">No tasks found for this filter.</p>
                    </div>
                  ) : (
                    finalTasks.map(task => <TaskListItem key={task._id || task.id} task={task} />)
                  )}
                </motion.div>
              )}

              {/* 2. CALENDAR VIEW */}
              {viewMode === 'calendar' && (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-surface dark:bg-zinc-900/20 rounded-xl border border-border overflow-hidden shadow-sm"
                >
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="font-semibold text-lg">
                      {currentCalendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="flex gap-1">
                      <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"><FiChevronLeft /></button>
                      <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"><FiChevronRight /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="py-2">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 bg-gray-200 dark:bg-gray-800 gap-px">
                    {getDaysInMonth(currentCalendarDate).map((dayObj, i) => {
                      // Find tasks for this day
                      const dayTasks = tasks.filter(t => {
                        const d = t.due_date || t.dueDate || t.deadline
                        if (!d) return false
                        return new Date(d).toDateString() === dayObj.date.toDateString()
                      })
                      return (
                        <CalendarDay
                          key={i}
                          date={dayObj.date}
                          isCurrentMonth={dayObj.isCurrentMonth}
                          tasks={dayTasks}
                          onClick={(date) => {
                            console.log("Clicked date", date)
                            // Could open a "Add task for this date" modal here
                          }}
                        />
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* 3. LATER BOX VIEW */}
              {viewMode === 'later' && (
                <motion.div
                  key="later"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 p-4 rounded-xl mb-6">
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-500 flex items-center gap-2">
                      <FiArchive /> The Later Box
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-600 mt-1">
                      Tasks here have no due dates. Drag them to the calendar or assign a date when you're ready.
                    </p>
                  </div>
                  <div className="space-y-3">
                    {finalTasks.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Your Later Box is empty!</p>
                    ) : (
                      finalTasks.map(task => <TaskListItem key={task._id || task.id} task={task} />)
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* ACTIVITY LOG SIDEBAR (Collapsible) */}
        <AnimatePresence>
          {showActivityLog && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:block border-l border-gray-200 dark:border-gray-800 pl-6 overflow-hidden"
            >
              <div className="w-[280px]">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiActivity className="text-blue-500" /> Activity Log
                </h3>
                <div className="space-y-6 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-2 top-2 bottom-0 w-px bg-gray-200 dark:bg-gray-800"></div>

                  {activities.map((activity, i) => (
                    <div key={activity.id} className="relative pl-6">
                      <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${activity.type === 'system' ? 'bg-gray-400' : activity.type === 'alert' ? 'bg-red-400' : 'bg-blue-500'
                        }`}></div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{activity.text}</p>
                      <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <FiClock size={10} /> {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTask(null)
          setExtractedTaskData(null)
        }}
        extractedData={extractedTaskData}
        task={selectedTask}
        onSave={fetchTasks}
      />
    </DashboardLayout>
  )
}