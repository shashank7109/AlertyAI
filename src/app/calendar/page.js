/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

*/

'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { FiChevronLeft, FiChevronRight, FiCalendar, FiCheck, FiClock, FiPackage } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { calendarAPI, taskAPI } from '@/lib/api'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, parseISO } from 'date-fns'
import toast from 'react-hot-toast'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEventsAndTasks()
  }, [currentDate])

  const fetchEventsAndTasks = async () => {
    try {
      setLoading(true)
      
      // Fetch tasks
      const tasksResponse = await taskAPI.getAll()
      const fetchedTasks = tasksResponse.data.tasks || tasksResponse.data || []
      setTasks(fetchedTasks)
      
      // Try to fetch calendar events
      try {
        const start = startOfMonth(currentDate)
        const end = endOfMonth(currentDate)
        const eventsResponse = await calendarAPI.getEvents(start.toISOString(), end.toISOString())
        setEvents(eventsResponse.data)
      } catch (error) {
        // Calendar events optional
        setEvents([])
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error)
      toast.error('Failed to load calendar data')
    } finally {
      setLoading(false)
    }
  }

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  })

  const startDay = startOfMonth(currentDate).getDay()
  const emptyDays = Array(startDay).fill(null)

  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(new Date(event.date), date))
  }

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = task.due_date || task.dueDate || task.deadline
      if (!taskDate) return false
      try {
        return isSameDay(parseISO(taskDate), date)
      } catch {
        return false
      }
    })
  }

  const selectedDateEvents = getEventsForDate(selectedDate)
  const selectedDateTasks = getTasksForDate(selectedDate)
  
  const getTaskColor = (task) => {
    if (task.status === 'completed') return 'bg-green-500'
    if (task.task_type === 'collect_task' || task.is_leader_task) return 'bg-blue-500'
    if (task.priority === 'urgent' || task.priority === 'high') return 'bg-red-500'
    if (task.priority === 'medium') return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  const getTaskIcon = (task) => {
    if (task.status === 'completed') return <FiCheck className="w-4 h-4" />
    if (task.task_type === 'collect_task' || task.is_leader_task) return <FiPackage className="w-4 h-4" />
    return <FiClock className="w-4 h-4" />
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold gradient-text font-display">Calendar 📅</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage your schedule
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 card p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={previousMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors text-sm font-medium"
                >
                  Today
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for alignment */}
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {/* Day cells */}
              {daysInMonth.map((date, index) => {
                const dayEvents = getEventsForDate(date)
                const dayTasks = getTasksForDate(date)
                const isSelected = isSameDay(date, selectedDate)
                const isCurrentDay = isToday(date)
                const totalItems = dayEvents.length + dayTasks.length
                
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(date)}
                    className={`aspect-square p-2 rounded-xl flex flex-col items-center justify-start transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-primary-500 to-purple-600 text-white shadow-lg'
                        : isCurrentDay
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className={`text-sm font-medium ${
                      isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {format(date, 'd')}
                    </span>
                    
                    {totalItems > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap justify-center">
                        {/* Show task dots */}
                        {dayTasks.slice(0, 2).map((task, idx) => (
                          <div
                            key={`task-${idx}`}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-white' : getTaskColor(task)
                            }`}
                            title={task.title}
                          />
                        ))}
                        {/* Show event dots */}
                        {dayEvents.slice(0, 1).map((event, idx) => (
                          <div
                            key={`event-${idx}`}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-white' : event.color
                            }`}
                          />
                        ))}
                        {/* Show count if more items */}
                        {totalItems > 3 && (
                          <span className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                            +{totalItems - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Tasks & Events for Selected Date */}
          <div className="card p-6 max-h-[600px] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {format(selectedDate, 'MMMM d, yyyy')}
            </h3>

            {selectedDateTasks.length === 0 && selectedDateEvents.length === 0 ? (
              <div className="text-center py-12">
                <FiCalendar className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400">
                  No tasks or events for this day
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Tasks Section */}
                {selectedDateTasks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                      <FiClock className="w-4 h-4" />
                      Tasks ({selectedDateTasks.length})
                    </h4>
                    
                    {/* Completed Tasks */}
                    {selectedDateTasks.filter(t => t.status === 'completed').length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">
                          ✅ Completed ({selectedDateTasks.filter(t => t.status === 'completed').length})
                        </p>
                        <div className="space-y-2">
                          {selectedDateTasks
                            .filter(t => t.status === 'completed')
                            .map((task) => (
                              <motion.div
                                key={task._id || task.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="text-green-600 dark:text-green-400 mt-0.5">
                                    {getTaskIcon(task)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-gray-900 dark:text-gray-100 line-through text-sm">
                                      {task.title}
                                    </h5>
                                    {task.team_name && (
                                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        Team: {task.team_name}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </div>
                    )}
                    
                    {/* To Do Tasks */}
                    {selectedDateTasks.filter(t => t.status !== 'completed').length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-2">
                          📋 To Do ({selectedDateTasks.filter(t => t.status !== 'completed').length})
                        </p>
                        <div className="space-y-2">
                          {selectedDateTasks
                            .filter(t => t.status !== 'completed')
                            .map((task) => (
                              <motion.div
                                key={task._id || task.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`mt-0.5 ${
                                    task.task_type === 'collect_task' || task.is_leader_task
                                      ? 'text-blue-600 dark:text-blue-400'
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`}>
                                    {getTaskIcon(task)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start gap-2">
                                      {(task.task_type === 'collect_task' || task.is_leader_task) && (
                                        <span className="text-sm">📥</span>
                                      )}
                                      <h5 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                        {task.title}
                                      </h5>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        task.priority === 'urgent' || task.priority === 'high'
                                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                          : task.priority === 'medium'
                                          ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                          : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                      }`}>
                                        {task.priority || 'medium'}
                                      </span>
                                      {task.team_name && (
                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                          {task.team_name}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 capitalize">
                                      {task.status?.replace('_', ' ')}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Events Section */}
                {selectedDateEvents.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                      <FiCalendar className="w-4 h-4" />
                      Events ({selectedDateEvents.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedDateEvents.map((event) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-3 h-3 rounded-full ${event.color} mt-1`} />
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                {event.title}
                              </h5>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {event.type}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

