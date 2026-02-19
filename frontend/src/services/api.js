import axios from 'axios'


const API_BASE_URL = 'http://127.0.0.1:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    const response = await api.post('/auth/refresh', null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    })
    return response.data
  }
}

// ============================================
// PATTERNS ENDPOINTS
// ============================================

export const patternsAPI = {
  // Get all patterns with filters
  getPatterns: async (params = {}) => {
    const response = await api.get('/patterns', { params })
    return response.data
  },

  // Get single pattern by ID
  getPattern: async (id) => {
    const response = await api.get(`/patterns/${id}`)
    return response.data
  },

  // Create new pattern
  createPattern: async (patternData) => {
    const response = await api.post('/patterns', patternData)
    return response.data
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/patterns/categories')
    return response.data
  },

  // Get difficulty levels
  getDifficulties: async () => {
    const response = await api.get('/patterns/difficulties')
    return response.data
  },

  // Search patterns
  searchPatterns: async (query, options = {}) => {
    const response = await api.get('/patterns/search', {
      params: { q: query, ...options }
    })
    return response.data
  }
}

// ============================================
// RECOMMENDATIONS ENDPOINTS
// ============================================

export const recommendationsAPI = {
  // Get recommendations for a specific pattern
  getPatternRecommendations: async (patternId, limit = 4) => {
    const response = await api.get(`/recommendations/pattern/${patternId}`, {
      params: { limit }
    })
    return response.data
  },

  // Get personalized recommendations for current user
  getPersonalRecommendations: async (limit = 10) => {
    const response = await api.get('/recommendations/for-me', {
      params: { limit }
    })
    return response.data
  },

  // Get popular patterns
  getPopularPatterns: async (limit = 10) => {
    const response = await api.get('/recommendations/popular', {
      params: { limit }
    })
    return response.data
  }
}

// ============================================
// ADMIN ENDPOINTS
// ============================================

export const adminAPI = {
  // Get pending patterns
  getPendingPatterns: async (page = 1) => {
    const response = await api.get('/admin/patterns/pending', {
      params: { page }
    })
    return response.data
  },

  // Approve pattern
  approvePattern: async (patternId) => {
    const response = await api.post(`/admin/patterns/${patternId}/approve`)
    return response.data
  },

  // Reject pattern
  rejectPattern: async (patternId) => {
    const response = await api.post(`/admin/patterns/${patternId}/reject`)
    return response.data
  },

  // Get all users
  getUsers: async (page = 1) => {
    const response = await api.get('/admin/users', {
      params: { page }
    })
    return response.data
  },

  // Get platform statistics
  getStats: async () => {
    const response = await api.get('/admin/stats')
    return response.data
  }
}

// ============================================
// FILE UPLOAD ENDPOINTS
// ============================================

export const uploadAPI = {
  // Upload pattern PDF
  uploadPatternFile: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/upload/pattern-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Upload pattern image
  uploadPatternImage: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/upload/pattern-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export default api