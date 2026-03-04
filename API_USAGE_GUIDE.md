# 📡 API Usage Guide

## Understanding Exports in `lib/api.js`

The `api.js` file provides two types of exports:

### 1. Default Export (for direct axios instance)
```javascript
export default api
```

### 2. Named Exports (for organized API methods)
```javascript
export const authAPI = { ... }
export const taskAPI = { ... }
export const laterBoxAPI = { ... }
export const opportunityAPI = { ... }
export const teamAPI = { ... }
export const aiAPI = { ... }
export const calendarAPI = { ... }
```

---

## ✅ How to Import Correctly

### Import Only Named Exports (Recommended)
```javascript
import { authAPI, taskAPI } from '@/lib/api'

// Usage
await authAPI.login(credentials)
await taskAPI.getAll()
```

### Import Only Default Export
```javascript
import api from '@/lib/api'

// Usage (not recommended - use named exports instead)
await api.post('/auth/login', credentials)
```

### Import Both Default and Named
```javascript
import api, { authAPI, taskAPI } from '@/lib/api'

// Usage
await authAPI.login(credentials)  // Recommended
await api.post('/custom', data)    // For custom endpoints
```

---

## 🚫 Common Mistakes

### ❌ WRONG: Importing default as named
```javascript
import { api } from '@/lib/api'  // ERROR!
```
**Fix:** Remove the brackets
```javascript
import api from '@/lib/api'  // ✓ Correct
```

### ❌ WRONG: Using api instance directly when named export exists
```javascript
import api from '@/lib/api'
await api.post('/auth/login', data)  // Don't do this
```
**Fix:** Use the named export
```javascript
import { authAPI } from '@/lib/api'
await authAPI.login(data)  // ✓ Better
```

---

## 📚 Available API Methods

### 1. Authentication (`authAPI`)
```javascript
import { authAPI } from '@/lib/api'

// Login
await authAPI.login({ email, password })

// Register
await authAPI.register({ name, email, password })

// Google Login
await authAPI.googleLogin(token)

// Logout
await authAPI.logout()

// Get Profile
await authAPI.getProfile()

// Update Profile
await authAPI.updateProfile(data)
```

### 2. Tasks (`taskAPI`)
```javascript
import { taskAPI } from '@/lib/api'

// Get all tasks
await taskAPI.getAll(params)

// Get single task
await taskAPI.getById(id)

// Create task
await taskAPI.create(taskData)

// Update task
await taskAPI.update(id, taskData)

// Delete task
await taskAPI.delete(id)

// Complete task
await taskAPI.complete(id)

// Create from voice
await taskAPI.createFromVoice(audioBlob)

// Create from screenshot
await taskAPI.createFromScreenshot(imageFile)
```

### 3. Later Box (`laterBoxAPI`)
```javascript
import { laterBoxAPI } from '@/lib/api'

// Get all items
await laterBoxAPI.getAll()

// Create item
await laterBoxAPI.create(data)

// Update item
await laterBoxAPI.update(id, data)

// Delete item
await laterBoxAPI.delete(id)

// Convert to task
await laterBoxAPI.convertToTask(id)
```

### 4. Opportunities (`opportunityAPI`)
```javascript
import { opportunityAPI } from '@/lib/api'

// Get all opportunities
await opportunityAPI.getAll(params)

// Get single opportunity
await opportunityAPI.getById(id)

// Create opportunity
await opportunityAPI.create(data)

// Update opportunity
await opportunityAPI.update(id, data)

// Delete opportunity
await opportunityAPI.delete(id)

// Update status
await opportunityAPI.updateStatus(id, status)
```

### 5. Teams (`teamAPI`)
```javascript
import { teamAPI } from '@/lib/api'

// Get all teams
await teamAPI.getAll()

// Get single team
await teamAPI.getById(id)

// Create team
await teamAPI.create(data)

// Update team
await teamAPI.update(id, data)

// Delete team
await teamAPI.delete(id)

// Add member
await teamAPI.addMember(teamId, userId)

// Remove member
await teamAPI.removeMember(teamId, userId)

// Assign task
await teamAPI.assignTask(teamId, taskData)

// Accept task
await teamAPI.acceptTask(teamId, taskId)

// Complete task
await teamAPI.completeTask(teamId, taskId)
```

### 6. AI Assistant (`aiAPI`)
```javascript
import { aiAPI } from '@/lib/api'

// Chat with AI
await aiAPI.chat(message)

// Get weekly plan
await aiAPI.getWeeklyPlan()

// Get suggestions
await aiAPI.getSuggestions()

// Analyze task
await aiAPI.analyzeTask(taskData)

// Extract from text
await aiAPI.extractFromText(text)
```

### 7. Calendar (`calendarAPI`)
```javascript
import { calendarAPI } from '@/lib/api'

// Get events
await calendarAPI.getEvents(startDate, endDate)

// Get today's tasks
await calendarAPI.getTodayTasks()

// Get upcoming events
await calendarAPI.getUpcoming()
```

---

## 🔒 Authentication

The API client automatically handles authentication:

### Automatic Token Injection
```javascript
// Token is automatically added to headers
// No need to manually set Authorization header
await taskAPI.getAll()  // Token is included automatically
```

### How it works:
1. User logs in → Token saved to `localStorage`
2. Request interceptor reads token from `localStorage`
3. Token added to `Authorization: Bearer {token}` header
4. All requests are authenticated automatically

### Automatic Logout on 401
```javascript
// If any API returns 401 Unauthorized:
// - Token is removed from localStorage
// - User is redirected to /login
```

---

## 🎯 Best Practices

### 1. Always Use Named Exports
```javascript
// ✓ Good
import { taskAPI } from '@/lib/api'
await taskAPI.create(data)

// ✗ Avoid
import api from '@/lib/api'
await api.post('/tasks', data)
```

### 2. Handle Errors Properly
```javascript
try {
  const response = await taskAPI.create(data)
  toast.success('Task created!')
} catch (error) {
  toast.error(error.response?.data?.detail || 'Failed to create task')
}
```

### 3. Use Environment Variables
```javascript
// Create .env.local file:
NEXT_PUBLIC_API_URL=http://localhost:8000

// API will automatically use this URL
```

### 4. Type Safety (Future Enhancement)
```typescript
// Consider adding TypeScript for better autocomplete
import { TaskAPI } from '@/types/api'
const taskAPI: TaskAPI = { ... }
```

---

## 🧪 Example Usage in Components

### Login Component
```javascript
import { authAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

const handleLogin = async (formData) => {
  try {
    const response = await authAPI.login(formData)
    localStorage.setItem('token', response.data.access_token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    toast.success('Login successful!')
    router.push('/dashboard')
  } catch (error) {
    toast.error(error.response?.data?.detail || 'Login failed')
  }
}
```

### Task List Component
```javascript
import { taskAPI } from '@/lib/api'
import { useEffect, useState } from 'react'

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  
  useEffect(() => {
    fetchTasks()
  }, [])
  
  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getAll()
      setTasks(response.data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }
  
  return (
    // ... render tasks
  )
}
```

### Voice Input Component
```javascript
import { taskAPI } from '@/lib/api'

const VoiceInput = () => {
  const handleVoiceInput = async (audioBlob) => {
    try {
      const response = await taskAPI.createFromVoice(audioBlob)
      toast.success('Task created from voice!')
    } catch (error) {
      toast.error('Failed to process voice input')
    }
  }
  
  return (
    // ... voice input UI
  )
}
```

---

## 🔍 Troubleshooting

### Error: "Cannot find module '@/lib/api'"
**Solution:** Check `jsconfig.json` has correct path alias:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Error: "api is not a function"
**Solution:** Check your import statement:
```javascript
// Wrong
import { api } from '@/lib/api'

// Correct
import api from '@/lib/api'
```

### Error: "taskAPI is undefined"
**Solution:** Use named import:
```javascript
// Wrong
import api from '@/lib/api'
const tasks = await api.taskAPI.getAll()

// Correct
import { taskAPI } from '@/lib/api'
const tasks = await taskAPI.getAll()
```

### Network Error / 401 Unauthorized
**Solution:**
1. Check if backend is running
2. Check if token is valid
3. Check API_URL in environment variables

---

## 📝 Summary

✅ **Use named exports** for cleaner code  
✅ **Let interceptors handle** authentication  
✅ **Handle errors** with try-catch  
✅ **Use environment variables** for API URL  
✅ **Follow the examples** in this guide  

**Happy coding! 🚀**

