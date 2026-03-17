/**
 * Copyright (c) 2026 AlertyAI
 * SPDX-License-Identifier: MIT
 */

import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      // Debug logging (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] Request to ${config.url}: Token ${token ? 'present' : 'missing'} (${token ? token.substring(0, 30) + '...' : 'none'})`)
      }
    } else {
      console.warn(`[API] Request to ${config.url}: No token found in localStorage`)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  // Use OAuth2 password flow for login
  login: (credentials) => {
    const formData = new FormData()
    formData.append('username', credentials.email)
    formData.append('password', credentials.password)
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
  },
  register: (userData) => api.post('/auth/register', userData),
  verifyOtp: (email, otp) => api.post('/auth/verify-otp', null, {
    params: { email, otp }
  }),
  resendOtp: (email) => api.post('/auth/resend-otp', null, {
    params: { email }
  }),
  // Google OAuth endpoints
  googleAuthUrl: () => `${API_URL}/api/oauth/google/login`,
  googleCallback: (code) => api.get(`/oauth/google/callback?code=${code}`),
  completeOAuthRegistration: (data) => api.post('/oauth/complete-registration', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refresh_token: refreshToken }),
}

// Task APIs
export const taskAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  complete: (id) => api.post(`/tasks/${id}/complete`),
  createFromVoice: (audioBlob) => {
    const formData = new FormData()
    formData.append('audio', audioBlob)
    return api.post('/tasks/voice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  createFromScreenshot: (imageFile) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    return api.post('/tasks/screenshot', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}

// Later Box APIs
export const laterBoxAPI = {
  getAll: () => api.get('/laterbox'),
  create: (data) => api.post('/laterbox', data),
  update: (id, data) => api.put(`/laterbox/${id}`, data),
  delete: (id) => api.delete(`/laterbox/${id}`),
  convertToTask: (id) => api.post(`/laterbox/${id}/convert`),
}

// Opportunity APIs
export const opportunityAPI = {
  getAll: (params) => api.get('/opportunities', { params }),
  getById: (id) => api.get(`/opportunities/${id}`),
  create: (data) => api.post('/opportunities', data),
  update: (id, data) => api.put(`/opportunities/${id}`, data),
  delete: (id) => api.delete(`/opportunities/${id}`),
  updateStatus: (id, status) => api.patch(`/opportunities/${id}/status`, { status }),
}

// AI Assistant APIs (Unified - uses v2 endpoints)
export const aiAPI = {
  // Chat
  chat: (message) => api.post('/v2/chat', null, { params: { message } }),

  // Weekly plan
  getWeeklyPlan: () => api.get('/v2/tasks/weekly-plan'),

  // Task analysis
  analyzeTask: (taskId) => api.post(`/v2/tasks/${taskId}/breakdown`),

  // Text extraction
  extractFromText: (text) => api.post('/v2/tasks/from-text', null, {
    params: { content: text, language: 'en' }
  }),

  // Image extraction (extract only, don't create task)
  extractFromImage: (imageFile, language = 'en') => {
    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('language', language)
    formData.append('extract_only', 'true')
    return api.post('/v2/tasks/from-screenshot', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Suggestions (basic analytics from dashboard data)
  getSuggestions: () => api.get('/tasks'), // Use task list instead
}

// AI V2 APIs - Advanced AI Features
export const aiV2API = {
  // Task creation from text/voice
  createTaskFromText: (content, language = 'en') =>
    api.post('/v2/tasks/from-text', null, {
      params: { content, language }
    }),

  // Task creation from screenshot with OCR
  createTaskFromScreenshot: (imageFile, language = 'en') => {
    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('language', language)
    return api.post('/v2/tasks/from-screenshot', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Voice input (multilingual)
  createTaskFromVoice: (audioFile, language = 'en') => {
    const formData = new FormData()
    formData.append('audio', audioFile)
    formData.append('language', language)
    return api.post('/v2/tasks/from-voice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Batch task creation
  batchCreateTasks: (contents, language = 'en') =>
    api.post('/v2/tasks/batch', { contents, language }),

  // Task breakdown
  breakdownTask: (taskId) =>
    api.post(`/v2/tasks/${taskId}/breakdown`),

  // Weekly plan
  getWeeklyPlan: () =>
    api.get('/v2/tasks/weekly-plan'),

  // Later Box
  saveLaterBox: (content, url = null, file_path = null) =>
    api.post('/v2/later-box', null, {
      params: { content, url, file_path }
    }),

  convertLaterBoxToTask: (itemId) =>
    api.post(`/v2/later-box/${itemId}/convert-to-task`),

  // Opportunities
  extractOpportunity: (content) =>
    api.post('/v2/opportunities/extract', null, {
      params: { content }
    }),

  extractOpportunityFromScreenshot: (imageFile) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    return api.post('/v2/opportunities/from-screenshot', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Team
  createTeamTask: (teamId, taskTitle, description) =>
    api.post(`/v2/teams/${teamId}/tasks`, null, {
      params: { team_id: teamId, task_title: taskTitle, description }
    }),

  getTeamAnalytics: (teamId) =>
    api.get(`/v2/teams/${teamId}/analytics`),

  // AI Chat
  aiChat: (message) =>
    api.post('/v2/chat', null, { params: { message } }),

  // Health check
  healthCheck: () =>
    api.get('/v2/health')
}

// Calendar APIs
export const calendarAPI = {
  getEvents: (startDate, endDate) => api.get('/calendar/events', {
    params: { startDate, endDate }
  }),
  getTodayTasks: () => api.get('/calendar/today'),
  getUpcoming: () => api.get('/calendar/upcoming'),
}

// Reminder & Notification APIs
export const reminderAPI = {
  // Reminders
  create: (data) => api.post('/reminders', data),
  getAll: (params) => api.get('/reminders', { params }),
  getById: (id) => api.get(`/reminders/${id}`),
  update: (id, data) => api.patch(`/reminders/${id}`, data),
  delete: (id) => api.delete(`/reminders/${id}`),

  // Devices
  registerDevice: (data) => api.post('/reminders/devices/register', data),
  getDevices: () => api.get('/reminders/devices'),
  unregisterDevice: (deviceId) => api.delete(`/reminders/devices/${deviceId}`),

  // Preferences
  getPreferences: () => api.get('/reminders/preferences'),
  updatePreferences: (data) => api.post('/reminders/preferences', data),

  // Logs
  getLogs: (params) => api.get('/reminders/logs', { params }),
}

// Team APIs
export const teamAPI = {
  // Teams
  getAll: () => api.get('/teams'),
  getById: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post('/teams', data),
  update: (id, data) => api.put(`/teams/${id}`, data),
  delete: (id) => api.delete(`/teams/${id}`),

  // Members
  inviteMembers: (teamId, emails, phones) =>
    api.post(`/teams/${teamId}/members/invite`, { emails, phones }),
  joinTeam: (inviteToken) => api.post(`/teams/join/${inviteToken}`),
  joinTeamByCode: (code) => {
    const formData = new FormData();
    formData.append('code', code);
    return api.post(`/teams/join/code`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  getJoinCode: (teamId) => api.get(`/teams/${teamId}/join-code`),
  regenerateJoinCode: (teamId) => api.post(`/teams/${teamId}/join-code/regenerate`),
  removeMember: (teamId, userId) =>
    api.delete(`/teams/${teamId}/members/${userId}`),
  promoteToLeader: (teamId, userId) =>
    api.patch(`/teams/${teamId}/members/${userId}/role`, { role: 'leader' }),
  demoteToMember: (teamId, userId) =>
    api.patch(`/teams/${teamId}/members/${userId}/role`, { role: 'member' }),

  // Pending invitations (for invited users)
  getMyPendingInvitations: () => api.get('/teams/invitations/pending'),
  acceptInvitation: (invitationId) => api.post(`/teams/invitations/${invitationId}/accept`),
  declineInvitation: (invitationId) => api.post(`/teams/invitations/${invitationId}/decline`),

  // Tasks
  getPendingTasks: () => api.get('/teams/tasks/pending'),
  createTask: (teamId, data) => api.post(`/teams/${teamId}/tasks`, data),
  acceptTask: (teamId, taskId) =>
    api.post(`/teams/${teamId}/tasks/${taskId}/accept`),
  rejectTask: (teamId, taskId, reason) =>
    api.post(`/teams/${teamId}/tasks/${taskId}/reject`, { reason }),
  updateProgress: (teamId, taskId, percentage, note) =>
    api.patch(`/teams/${teamId}/tasks/${taskId}/progress`, { percentage, note }),
  addComment: (teamId, taskId, text) =>
    api.post(`/teams/${teamId}/tasks/${taskId}/comments`, { text }),
  completeTask: (teamId, taskId) =>
    api.post(`/teams/${teamId}/tasks/${taskId}/complete`),
  submitTask: (teamId, taskId, note = "", files = []) => {
    const formData = new FormData();
    formData.append('note', note || '');
    files.forEach((file) => formData.append('files', file));
    return api.post(`/teams/${teamId}/tasks/${taskId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  collectTask: (teamId, taskId, note = "") => {
    const formData = new FormData();
    formData.append('note', note || '');
    return api.post(`/teams/${teamId}/tasks/${taskId}/collect`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // AI
  getAISuggestions: (teamId) => api.get(`/teams/${teamId}/ai-suggestions`),
  getAISummary: (teamId, period = 'daily') =>
    api.get(`/teams/${teamId}/ai-summary?period=${period}`),
  getTaskBreakdown: (teamId, taskId) =>
    api.post(`/teams/${teamId}/tasks/${taskId}/ai-breakdown`),

  // Analytics
  getAnalytics: (teamId) => api.get(`/teams/${teamId}/analytics`),

  // Chat
  getChatHistory: (teamId) => {
    const token = localStorage.getItem('token')
    return api.get(`/chat/history/${teamId}`, { params: { token } })
  },
  getMentionSuggestions: (teamId) => api.get(`/chat/mentions/${teamId}`),
  getChatWSUrl: (teamId) => {
    const token = localStorage.getItem('token')
    const wsBase = API_URL.replace(/^http/, 'ws')
    return `${wsBase}/api/chat/ws/chat/${teamId}?token=${token}`
  },
}

// Admin APIs (only accessible by alertyai.07@gmail.com)
export const adminAPI = {
  // Users
  getAllUsers: (skip = 0, limit = 100) =>
    api.get('/admin/users', { params: { skip, limit } }),
  getUserById: (userId) =>
    api.get(`/admin/users/${userId}`),
  deleteUser: (userId) =>
    api.delete(`/admin/users/${userId}`),

  // Stats
  getStats: () =>
    api.get('/admin/stats'),
}

export default api

