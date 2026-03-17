/**
 * Copyright (c) 2026 AlertyAI
 * SPDX-License-Identifier: MIT
 */

/**
 * ReminderForm Component
 * Form for creating and editing reminders
 */
'use client'
import { useState, useEffect } from 'react'
import { useReminders } from '@/hooks/useReminders'
import { useNotifications } from '@/hooks/useNotifications'

export default function ReminderForm({ reminder = null, onClose, onSuccess }) {
  const { createReminder, updateReminder } = useReminders()
  const { fcmToken } = useNotifications()

  const [formData, setFormData] = useState({
    title: reminder?.title || '',
    description: reminder?.description || '',
    reminder_time: reminder?.reminder_time 
      ? new Date(reminder.reminder_time).toISOString().slice(0, 16)
      : '',
    channels: reminder?.channels?.map(c => typeof c === 'string' ? c : c.value) || ['push'],
    tone: reminder?.tone || 'casual',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const reminderData = {
        ...formData,
        reminder_time: new Date(formData.reminder_time).toISOString(),
        channels: formData.channels,
        fcm_token: fcmToken,
      }

      if (reminder) {
        await updateReminder(reminder.id, reminderData)
      } else {
        await createReminder(reminderData)
      }

      onSuccess?.()
      onClose?.()
    } catch (error) {
      console.error('Error saving reminder:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleChannel = (channel) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Reminder title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Optional description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Reminder Time *</label>
        <input
          type="datetime-local"
          required
          value={formData.reminder_time}
          onChange={(e) => setFormData(prev => ({ ...prev, reminder_time: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          min={new Date().toISOString().slice(0, 16)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Notification Channels *</label>
        <div className="space-y-2">
          {['push', 'email', 'sms', 'alarm'].map(channel => (
            <label key={channel} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.channels.includes(channel)}
                onChange={() => toggleChannel(channel)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="capitalize">{channel}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Message Tone</label>
        <select
          value={formData.tone}
          onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="casual">Casual</option>
          <option value="urgent">Urgent</option>
          <option value="motivational">Motivational</option>
          <option value="formal">Formal</option>
        </select>
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : reminder ? 'Update' : 'Create'} Reminder
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

