import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false // Explicitly disable credentials for CORS
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Ensure CORS headers are properly set
    config.headers['Access-Control-Allow-Origin'] = '*';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor with better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Network errors
    if (!error.response) {
      console.error('Network Error:', error);
      return Promise.reject(new Error('Network error occurred. Please check your connection.'));
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Recipe services
export const recipeService = {
  getAllRecipes: (params) => api.get('/recipes', { params }),
  getRecipeById: (id) => api.get(`/recipes/${id}`),
  createRecipe: (recipeData) => api.post('/recipes', recipeData),
  updateRecipe: (id, recipeData) => api.put(`/recipes/${id}`, recipeData),
  deleteRecipe: (id) => api.delete(`/recipes/${id}`),
  toggleLike: (id) => api.post(`/recipes/${id}/like`),
};

// AI Recipe services
export const aiService = {
  suggestRecipes: (ingredients) => api.post('/ai/suggest', { ingredients }),
  getDetailedRecipe: (recipeData) => api.post('/ai/detail', recipeData),
};

export default api;