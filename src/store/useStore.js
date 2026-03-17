/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

*/

import { create } from 'zustand'

// User Store
export const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))

// Task Store
export const useTaskStore = create((set) => ({
  tasks: [],
  loading: false,
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  })),
  setLoading: (loading) => set({ loading }),
}))

// Later Box Store
export const useLaterBoxStore = create((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(i => i.id === id ? { ...i, ...updates } : i)
  })),
  deleteItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id)
  })),
}))

// Opportunity Store
export const useOpportunityStore = create((set) => ({
  opportunities: [],
  setOpportunities: (opportunities) => set({ opportunities }),
  addOpportunity: (opp) => set((state) => ({ 
    opportunities: [...state.opportunities, opp] 
  })),
  updateOpportunity: (id, updates) => set((state) => ({
    opportunities: state.opportunities.map(o => 
      o.id === id ? { ...o, ...updates } : o
    )
  })),
  deleteOpportunity: (id) => set((state) => ({
    opportunities: state.opportunities.filter(o => o.id !== id)
  })),
}))

// Team Store
export const useTeamStore = create((set) => ({
  teams: [],
  currentTeam: null,
  setTeams: (teams) => set({ teams }),
  setCurrentTeam: (team) => set({ currentTeam: team }),
  addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
  updateTeam: (id, updates) => set((state) => ({
    teams: state.teams.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  deleteTeam: (id) => set((state) => ({
    teams: state.teams.filter(t => t.id !== id)
  })),
}))

// UI Store
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  activeModal: null,
  isRecording: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  setRecording: (isRecording) => set({ isRecording }),
}))

