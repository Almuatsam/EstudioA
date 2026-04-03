import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:5000/api'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/profile')
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
  }
}

// Patterns API
export const patternsAPI = {
  getPatterns: async (params = {}) => {
    const response = await apiClient.get('/patterns', { params })
    return response.data
  },

  getPattern: async (id) => {
    const response = await apiClient.get(`/patterns/${id}`)
    return response.data
  },

  createPattern: async (patternData) => {
    const response = await apiClient.post('/patterns', patternData)
    return response.data
  },

  getCategories: async () => {
    const response = await apiClient.get('/patterns/categories')
    return response.data
  },

  getDifficulties: async () => {
    const response = await apiClient.get('/patterns/difficulties')
    return response.data
  },

  searchPatterns: async (searchTerm) => {
    const response = await apiClient.get(`/patterns/search?q=${searchTerm}`)
    return response.data
  },

  getMyPatterns: async () => {
    const response = await apiClient.get('/patterns/my-patterns')
    return response.data
  }
}

// Upload API
export const uploadAPI = {
  uploadPatternFile: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await apiClient.post('/upload/pattern-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  uploadPatternImage: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await apiClient.post('/upload/pattern-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

// Admin API
export const adminAPI = {
  getStats: async () => {
    const response = await apiClient.get('/admin/stats')
    return response.data
  },

  getPendingPatterns: async () => {
    const response = await apiClient.get('/admin/patterns/pending')
    return response.data
  },

  approvePattern: async (patternId) => {
    const response = await apiClient.post(`/admin/patterns/${patternId}/approve`)
    return response.data
  },

  rejectPattern: async (patternId) => {
    const response = await apiClient.post(`/admin/patterns/${patternId}/reject`)
    return response.data
  },

  getUsers: async () => {
    const response = await apiClient.get('/admin/users')
    return response.data
  },

  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/admin/users/${userId}`)
    return response.data
  }
}

// Recommendations API
export const recommendationsAPI = {
  getPersonalRecommendations: async (limit = 6) => {
    const response = await apiClient.get(`/recommendations/personal?limit=${limit}`)
    return response.data
  },

  getPatternRecommendations: async (patternId, limit = 4) => {
    const response = await apiClient.get(`/recommendations/pattern/${patternId}?limit=${limit}`)
    return response.data
  }
}

// Favorites API
export const favoritesAPI = {
  getFavorites: async () => {
    const response = await apiClient.get('/favorites')
    return response.data
  },
  
  addFavorite: async (patternId) => {
    const response = await apiClient.post(`/favorites/${patternId}`)
    return response.data
  },
  
  removeFavorite: async (patternId) => {
    const response = await apiClient.delete(`/favorites/${patternId}`)
    return response.data
  },
  
  checkFavorite: async (patternId) => {
    const response = await apiClient.get(`/favorites/check/${patternId}`)
    return response.data
  }
}

// Downloads API
export const downloadsAPI = {
  getHistory: async (page = 1, perPage = 20) => {
    const response = await apiClient.get(`/downloads/history?page=${page}&per_page=${perPage}`)
    return response.data
  },
  
  trackDownload: async (patternId) => {
    const response = await apiClient.post(`/downloads/track/${patternId}`)
    return response.data
  }
}

// User Profile API
export const userAPI = {
  getProfile: async () => {
    const response = await apiClient.get('/user/profile')
    return response.data
  },
  
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/user/profile', profileData)
    return response.data
  },
  
  changePassword: async (passwordData) => {
    const response = await apiClient.post('/auth/change-password', passwordData)
    return response.data
  }
}

// Designer API
export const designerAPI = {
  getMyPatterns: async () => {
    const response = await apiClient.get('/patterns/my-patterns')
    return response.data
  },

  getStats: async () => {
    const response = await apiClient.get('/patterns/my-patterns')
    const patterns = response.data.patterns || []
    const stats = {
      total_patterns: patterns.length,
      approved_patterns: patterns.filter(p => p.is_approved).length,
      pending_patterns: patterns.filter(p => !p.is_approved).length,
      total_downloads: patterns.reduce((sum, p) => sum + (p.download_count || 0), 0)
    }
    return { stats }
  },

  deletePattern: async (patternId) => {
    const response = await apiClient.delete(`/patterns/${patternId}`)
    return response.data
  }
}

export default apiClient