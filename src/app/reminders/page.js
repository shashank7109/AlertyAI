/**
 * Reminders Page
 * Main page for managing reminders and notifications
 */
'use client'
import { useState } from 'react'
import { useReminders } from '@/hooks/useReminders'
import { useNotifications } from '@/hooks/useNotifications'
import ReminderForm from '@/components/reminders/ReminderForm'

export default function RemindersPage() {
  const { reminders, isLoading, deleteReminder, filters, setFilters } = useReminders()
  const { permission, requestPermission, isGranted } = useNotifications()
  const [showForm, setShowForm] = useState(false)
  const [selectedReminder, setSelectedReminder] = useState(null)

  const handleDelete = async (reminderId) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      await deleteReminder(reminderId)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      dismissed: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || colors.pending
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reminders</h1>
        <div className="flex space-x-2">
          {!isGranted && (
            <button
              onClick={requestPermission}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Enable Notifications
            </button>
          )}
          <button
            onClick={() => {
              setSelectedReminder(null)
              setShowForm(true)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Create Reminder
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex space-x-2">
        <select
          value={filters.status || ''}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || null }))}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Reminders List */}
      {isLoading ? (
        <div className="text-center py-8">Loading reminders...</div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No reminders found. Create your first reminder!
        </div>
      ) : (
        <div className="grid gap-4">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{reminder.title}</h3>
                  {reminder.description && (
                    <p className="text-gray-600 mt-1">{reminder.description}</p>
                  )}
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>⏰ {formatDate(reminder.reminder_time)}</span>
                    <span className={`px-2 py-1 rounded ${getStatusColor(reminder.status)}`}>
                      {reminder.status}
                    </span>
                    <span>📢 {reminder.channels.join(', ')}</span>
                  </div>
                  {reminder.ai_generated_message && (
                    <p className="mt-2 text-sm italic text-gray-500">
                      "{reminder.ai_generated_message}"
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedReminder(reminder)
                      setShowForm(true)
                    }}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(reminder.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reminder Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {selectedReminder ? 'Edit Reminder' : 'Create Reminder'}
            </h2>
            <ReminderForm
              reminder={selectedReminder}
              onClose={() => {
                setShowForm(false)
                setSelectedReminder(null)
              }}
              onSuccess={() => {
                setShowForm(false)
                setSelectedReminder(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

