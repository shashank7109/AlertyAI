'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import LaterBoxModal from '@/components/modals/LaterBoxModal'
import { FiPlus, FiStar, FiImage, FiFileText, FiLink, FiMoreVertical } from 'react-icons/fi'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { laterBoxAPI } from '@/lib/api'

export default function LaterBoxPage() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const response = await laterBoxAPI.getAll()
      const fetchedItems = response.data.items || response.data || []
      setItems(fetchedItems)
    } catch (error) {
      console.error('Error fetching laterbox items:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
      } else {
        toast.error('Failed to load later box items')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = () => {
    setSelectedItem(null)
    setIsModalOpen(true)
  }

  const handleEditItem = (item) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const convertToTask = async (itemId) => {
    try {
      await laterBoxAPI.convertToTask(itemId)
      toast.success('Converted to task!')
      fetchItems()
    } catch (error) {
      console.error('Error converting to task:', error)
      toast.error('Failed to convert to task')
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'idea':
        return <FiStar className="text-yellow-500" size={28} />
      case 'image':
        return <FiImage className="text-green-500" size={28} />
      case 'form':
        return <FiFileText className="text-blue-500" size={28} />
      case 'link':
        return <FiLink className="text-purple-500" size={28} />
      default:
        return <FiFileText className="text-gray-500" size={28} />
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'idea':
        return '💡'
      case 'image':
        return '🖼️'
      case 'form':
        return '📋'
      case 'link':
        return '🔗'
      default:
        return '📄'
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Saved for Later</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Save ideas, links, forms, and inspiration to revisit later
              </p>
            </div>
            <button
              onClick={handleAddItem}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <FiPlus size={20} />
              Add Item
            </button>
          </div>

          {/* Filter Tags */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium whitespace-nowrap">
              All
            </button>
            <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
              💡 Ideas
            </button>
            <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
              🖼️ Images
            </button>
            <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
              📋 Forms
            </button>
            <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
              🔗 Links
            </button>
          </div>
        </motion.div>

        {/* Grid Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {items.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Nothing saved yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start saving ideas, links, and inspiration for later
              </p>
              <button
                onClick={handleAddItem}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Add Your First Item
              </button>
            </div>
          ) : (
            items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => handleEditItem(item)}
              >
                {/* Icon and Menu */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-4xl">
                    {getTypeLabel(item.type)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <FiMoreVertical className="text-gray-600 dark:text-gray-400" size={18} />
                  </button>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {item.content}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <FiFileText size={14} />
                    <span>{item.date}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      convertToTask(item.id)
                    }}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Convert to Task
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Mobile View - List Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:hidden space-y-4 mt-6"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 p-4"
              onClick={() => handleEditItem(item)}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl flex-shrink-0">
                  {getTypeLabel(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {item.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.date}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        convertToTask(item.id)
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400"
                    >
                      Convert to Task
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Later Box Modal */}
      <LaterBoxModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedItem(null)
        }}
        item={selectedItem}
        onSave={fetchItems}
      />
    </DashboardLayout>
  )
}
