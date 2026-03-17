/**
 * Copyright (c) 2026 AlertyAI
 * SPDX-License-Identifier: MIT
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import OpportunityModal from '@/components/modals/OpportunityModal'
import { FiPlus, FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { opportunityAPI } from '@/lib/api'

export default function OpportunitiesPage() {
  const router = useRouter()
  const [opportunities, setOpportunities] = useState({
    upcoming: [],
    in_progress: [],
    completed: [],
  })
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const [expandedColumns, setExpandedColumns] = useState({
    upcoming: true,
    in_progress: true,
    completed: true,
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchOpportunities()
  }, [])

  const fetchOpportunities = async () => {
    setLoading(true)
    try {
      const response = await opportunityAPI.getAll()
      const fetchedOps = response.data.opportunities || response.data || []
      
      // Group by status
      const grouped = {
        upcoming: fetchedOps.filter(op => op.status === 'upcoming' || op.status === 'pending'),
        in_progress: fetchedOps.filter(op => op.status === 'in_progress' || op.status === 'active'),
        completed: fetchedOps.filter(op => op.status === 'completed'),
      }
      
      setOpportunities(grouped)
    } catch (error) {
      console.error('Error fetching opportunities:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
      } else {
        toast.error('Failed to load opportunities')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddOpportunity = () => {
    setSelectedOpportunity(null)
    setIsModalOpen(true)
  }

  const handleEditOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity)
    setIsModalOpen(true)
  }

  const toggleColumn = (columnId) => {
    setExpandedColumns({
      ...expandedColumns,
      [columnId]: !expandedColumns[columnId],
    })
  }

  const getColumnColor = (columnId) => {
    switch (columnId) {
      case 'upcoming':
        return 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
      case 'in_progress':
        return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800'
      case 'completed':
        return 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }
  }

  const getColumnHeaderColor = (columnId) => {
    switch (columnId) {
      case 'upcoming':
        return 'text-blue-700 dark:text-blue-400'
      case 'in_progress':
        return 'text-yellow-700 dark:text-yellow-400'
      case 'completed':
        return 'text-green-700 dark:text-green-400'
      default:
        return 'text-gray-700 dark:text-gray-400'
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-3 md:px-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 md:mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">
                Opportunity Pipeline
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                Track hackathons, jobs, exams, and important deadlines
              </p>
            </div>
            <button
              onClick={handleAddOpportunity}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <FiPlus size={18} />
              <span>Add Opportunity</span>
            </button>
          </div>
        </motion.div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Upcoming Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-2xl border-2 ${getColumnColor('upcoming')} overflow-hidden`}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-blue-200 dark:border-blue-800">
              <button
                onClick={() => toggleColumn('upcoming')}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <h2 className={`text-lg font-bold ${getColumnHeaderColor('upcoming')}`}>
                    Upcoming
                  </h2>
                  <span className="bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-full">
                    {opportunities.upcoming.length}
                  </span>
                </div>
                {expandedColumns.upcoming ? (
                  <FiChevronUp className="text-blue-600 dark:text-blue-400" />
                ) : (
                  <FiChevronDown className="text-blue-600 dark:text-blue-400" />
                )}
              </button>
            </div>

            {/* Cards */}
            {expandedColumns.upcoming && (
              <div className="p-4 space-y-3">
                {opportunities.upcoming.map((opp, index) => (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleEditOpportunity(opp)}
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {opp.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <FiCalendar size={14} />
                      <span>{opp.date}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {opp.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* In Progress Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl border-2 ${getColumnColor('in_progress')} overflow-hidden`}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-yellow-200 dark:border-yellow-800">
              <button
                onClick={() => toggleColumn('in_progress')}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <h2 className={`text-lg font-bold ${getColumnHeaderColor('in_progress')}`}>
                    In Progress
                  </h2>
                  <span className="bg-yellow-200 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 text-xs font-bold px-2 py-1 rounded-full">
                    {opportunities.in_progress.length}
                  </span>
                </div>
                {expandedColumns.in_progress ? (
                  <FiChevronUp className="text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <FiChevronDown className="text-yellow-600 dark:text-yellow-400" />
                )}
              </button>
            </div>

            {/* Cards */}
            {expandedColumns.in_progress && (
              <div className="p-4 space-y-3">
                {opportunities.in_progress.map((opp, index) => (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleEditOpportunity(opp)}
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {opp.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <FiCalendar size={14} />
                      <span>{opp.date}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {opp.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-md text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Completed Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl border-2 ${getColumnColor('completed')} overflow-hidden`}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-green-200 dark:border-green-800">
              <button
                onClick={() => toggleColumn('completed')}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <h2 className={`text-lg font-bold ${getColumnHeaderColor('completed')}`}>
                    Completed
                  </h2>
                  <span className="bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-1 rounded-full">
                    {opportunities.completed.length}
                  </span>
                </div>
                {expandedColumns.completed ? (
                  <FiChevronUp className="text-green-600 dark:text-green-400" />
                ) : (
                  <FiChevronDown className="text-green-600 dark:text-green-400" />
                )}
              </button>
            </div>

            {/* Cards */}
            {expandedColumns.completed && (
              <div className="p-4 space-y-3">
                {opportunities.completed.map((opp, index) => (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleEditOpportunity(opp)}
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {opp.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <FiCalendar size={14} />
                      <span>{opp.date}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {opp.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Opportunity Modal */}
      <OpportunityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedOpportunity(null)
        }}
        opportunity={selectedOpportunity}
        onSave={fetchOpportunities}
      />
    </DashboardLayout>
  )
}
