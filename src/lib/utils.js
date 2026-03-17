/**
 * Copyright (c) 2026 AlertyAI
 * SPDX-License-Identifier: MIT
 */

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

export function formatTime(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit'
  })
}

export function getRelativeTime(date) {
  if (!date) return ''
  const now = new Date()
  const d = new Date(date)
  const diff = d - now
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  if (days < -1) return `${Math.abs(days)} days ago`
  if (days > 1) return `In ${days} days`
  
  return formatDate(date)
}

export function getPriorityColor(priority) {
  switch(priority?.toLowerCase()) {
    case 'high':
      return 'badge-high'
    case 'medium':
      return 'badge-medium'
    case 'low':
      return 'badge-low'
    default:
      return 'badge-medium'
  }
}

export function getStatusColor(status) {
  switch(status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    case 'in_progress':
    case 'in progress':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    case 'pending':
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
    case 'missed':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }
}

export function truncateText(text, maxLength = 50) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function extractInitials(name) {
  if (!name) return 'U'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name[0].toUpperCase()
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

