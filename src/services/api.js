import axios from "axios"

const API_BASE_URL ="http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/admin/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getCurrentUser: () => api.get("/auth/me"),
  changePassword: (passwords) => api.put("/auth/change-password", passwords),
}

// Sections API
export const sectionsAPI = {
  getAll: () => api.get("/sections"),
  getEnabled: () => api.get("/sections/enabled"),
  update: (name, data) => api.put(`/sections/${name}`, data),
  toggle: (name) => api.patch(`/sections/${name}/toggle`),
}

// Hero API
export const heroAPI = {
  get: () => api.get("/hero"),
  update: (data) => api.post("/hero", data),
}

// About API
export const aboutAPI = {
  get: () => api.get("/about"),
  update: (data) => api.post("/about", data),
}

// Experience API
export const experienceAPI = {
  getAll: () => api.get("/experience"),
  get: (id) => api.get(`/experience/${id}`),
  create: (data) => api.post("/experience", data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  delete: (id) => api.delete(`/experience/${id}`),
}

// Education API
export const educationAPI = {
  getAll: () => api.get("/education"),
  create: (data) => api.post("/education", data),
  update: (id, data) => api.put(`/education/${id}`, data),
  delete: (id) => api.delete(`/education/${id}`),
}

// Skills API
export const skillsAPI = {
  getAll: () => api.get("/skills"),
  create: (data) => api.post("/skills", data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
}

// Projects API
export const projectsAPI = {
  getAll: () => api.get("/projects"),
  getFeatured: () => api.get("/projects/featured"),
  create: (data) => api.post("/projects", data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
}

// Volunteer API
export const volunteerAPI = {
  getAll: () => api.get("/volunteer"),
  create: (data) => api.post("/volunteer", data),
  update: (id, data) => api.put(`/volunteer/${id}`, data),
  delete: (id) => api.delete(`/volunteer/${id}`),
}

// Publications API
export const publicationsAPI = {
  getAll: () => api.get("/publications"),
  create: (data) => api.post("/publications", data),
  update: (id, data) => api.put(`/publications/${id}`, data),
  delete: (id) => api.delete(`/publications/${id}`),
}

// Patents API
export const patentsAPI = {
  getAll: () => api.get("/patents"),
  create: (data) => api.post("/patents", data),
  update: (id, data) => api.put(`/patents/${id}`, data),
  delete: (id) => api.delete(`/patents/${id}`),
}

// Awards API
export const awardsAPI = {
  getAll: () => api.get("/awards"),
  create: (data) => api.post("/awards", data),
  update: (id, data) => api.put(`/awards/${id}`, data),
  delete: (id) => api.delete(`/awards/${id}`),
}

// Test Scores API
export const testScoresAPI = {
  getAll: () => api.get("/testscores"),
  create: (data) => api.post("/testscores", data),
  update: (id, data) => api.put(`/testscores/${id}`, data),
  delete: (id) => api.delete(`/testscores/${id}`),
}

// Languages API
export const languagesAPI = {
  getAll: () => api.get("/languages"),
  create: (data) => api.post("/languages", data),
  update: (id, data) => api.put(`/languages/${id}`, data),
  delete: (id) => api.delete(`/languages/${id}`),
}

// Certifications API
export const certificationsAPI = {
  getAll: () => api.get("/certifications"),
  create: (data) => api.post("/certifications", data),
  update: (id, data) => api.put(`/certifications/${id}`, data),
  delete: (id) => api.delete(`/certifications/${id}`),
}

// Courses API
export const coursesAPI = {
  getAll: () => api.get("/courses"),
  create: (data) => api.post("/courses", data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
}

// Contact API
export const contactAPI = {
  submit: (data) => api.post("/contact", data),
  getAll: () => api.get("/contact"),
  markAsRead: (id) => api.patch(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
}

export default api
