/**
 * Copyright (c) 2026 AlertyAI
 * SPDX-License-Identifier: MIT
 */

/**
 * Notification Preferences Page
 * Manage user notification settings and preferences
 */
'use client'
import { useState, useEffect } from 'react'
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences'

export default function NotificationPreferencesPage() {
  const { preferences, isLoading, updatePreferences } = useNotificationPreferences()
  const [formData, setFormData] = useState({
    push_enabled: true,
    email_enabled: true,
    sms_enabled: false,
    alarm_enabled: true,
    do_not_disturb: false,
    quiet_hours: {
      start_time: '22:00',
      end_time: '08:00',
      timezone: 'UTC',
    },
    preferred_channels: ['push'],
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (preferences) {
      setFormData({
        push_enabled: preferences.push_enabled ?? true,
        email_enabled: preferences.email_enabled ?? true,
        sms_enabled: preferences.sms_enabled ?? false,
        alarm_enabled: preferences.alarm_enabled ?? true,
        do_not_disturb: preferences.do_not_disturb ?? false,
        quiet_hours: preferences.quiet_hours || {
          start_time: '22:00',
          end_time: '08:00',
          timezone: 'UTC',
        },
        preferred_channels: preferences.preferred_channels?.map(c => typeof c === 'string' ? c : c.value) || ['push'],
      })
    }
  }, [preferences])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updatePreferences(formData)
      alert('Preferences updated successfully!')
    } catch (error) {
      console.error('Error updating preferences:', error)
      alert('Failed to update preferences')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleChannel = (channel) => {
    setFormData(prev => ({
      ...prev,
      preferred_channels: prev.preferred_channels.includes(channel)
        ? prev.preferred_channels.filter(c => c !== channel)
        : [...prev.preferred_channels, channel]
    }))
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading preferences...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Notification Preferences</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Channel Toggles */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Notification Channels</h2>
          <div className="space-y-3">
            {[
              { key: 'push_enabled', label: 'Push Notifications', desc: 'Receive push notifications on your devices' },
              { key: 'email_enabled', label: 'Email Notifications', desc: 'Receive reminders via email' },
              { key: 'sms_enabled', label: 'SMS Notifications', desc: 'Receive reminders via SMS (requires phone number)' },
              { key: 'alarm_enabled', label: 'Device Alarms', desc: 'Set device alarms for reminders' },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData[key]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium">{label}</div>
                  <div className="text-sm text-gray-500">{desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Quiet Hours</h2>
          <p className="text-sm text-gray-600 mb-4">
            No notifications will be sent during these hours
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="time"
                value={formData.quiet_hours.start_time}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  quiet_hours: { ...prev.quiet_hours, start_time: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="time"
                value={formData.quiet_hours.end_time}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  quiet_hours: { ...prev.quiet_hours, end_time: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Do Not Disturb */}
        <div className="border rounded-lg p-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.do_not_disturb}
              onChange={(e) => setFormData(prev => ({ ...prev, do_not_disturb: e.target.checked }))}
              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <div>
              <div className="font-medium">Do Not Disturb</div>
              <div className="text-sm text-gray-500">
                Temporarily disable all notifications
              </div>
            </div>
          </label>
        </div>

        {/* Preferred Channels */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Preferred Channels</h2>
          <p className="text-sm text-gray-600 mb-4">
            Select default channels for new reminders
          </p>
          <div className="space-y-2">
            {['push', 'email', 'sms', 'alarm'].map(channel => (
              <label key={channel} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferred_channels.includes(channel)}
                  onChange={() => toggleChannel(channel)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="capitalize">{channel}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  )
}

