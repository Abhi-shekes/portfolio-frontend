import axios from "axios"

const API_BASE_URL = "http://localhost:4000/api"

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

// Talks API
export const talksAPI = {
  getAll: () => api.get("/talks"),
  create: (data) => api.post("/talks", data),
  update: (id, data) => api.put(`/talks/${id}`, data),
  delete: (id) => api.delete(`/talks/${id}`),
}

// Internships API
export const internshipsAPI = {
  getAll: () => api.get("/internships"),
  create: (data) => api.post("/internships", data),
  update: (id, data) => api.put(`/internships/${id}`, data),
  delete: (id) => api.delete(`/internships/${id}`),
}

// Workshops API
export const workshopsAPI = {
  getAll: () => api.get("/workshops"),
  getAttended: () => api.get("/workshops/attended"),
  getConducted: () => api.get("/workshops/conducted"),
  create: (data) => api.post("/workshops", data),
  update: (id, data) => api.put(`/workshops/${id}`, data),
  delete: (id) => api.delete(`/workshops/${id}`),
}

// Trainings API
export const trainingsAPI = {
  getAll: () => api.get("/trainings"),
  create: (data) => api.post("/trainings", data),
  update: (id, data) => api.put(`/trainings/${id}`, data),
  delete: (id) => api.delete(`/trainings/${id}`),
}

// Appreciations API
export const appreciationsAPI = {
  getAll: () => api.get("/appreciations"),
  create: (data) => api.post("/appreciations", data),
  update: (id, data) => api.put(`/appreciations/${id}`, data),
  delete: (id) => api.delete(`/appreciations/${id}`),
}

// Journal Papers API
export const journalPapersAPI = {
  getAll: () => api.get("/journal-papers"),
  create: (data) => api.post("/journal-papers", data),
  update: (id, data) => api.put(`/journal-papers/${id}`, data),
  delete: (id) => api.delete(`/journal-papers/${id}`),
}

// Research Papers API
export const researchPapersAPI = {
  getAll: () => api.get("/research-papers"),
  create: (data) => api.post("/research-papers", data),
  update: (id, data) => api.put(`/research-papers/${id}`, data),
  delete: (id) => api.delete(`/research-papers/${id}`),
}

// Conference Papers API
export const conferencePapersAPI = {
  getAll: () => api.get("/conference-papers"),
  create: (data) => api.post("/conference-papers", data),
  update: (id, data) => api.put(`/conference-papers/${id}`, data),
  delete: (id) => api.delete(`/conference-papers/${id}`),
}

// Book Chapters API
export const bookChaptersAPI = {
  getAll: () => api.get("/book-chapters"),
  create: (data) => api.post("/book-chapters", data),
  update: (id, data) => api.put(`/book-chapters/${id}`, data),
  delete: (id) => api.delete(`/book-chapters/${id}`),
}

// Gallery API
export const galleryAPI = {
  getAll: () => api.get("/gallery"),
  getFeatured: () => api.get("/gallery/featured"),
  create: (data) => api.post("/gallery", data),
  update: (id, data) => api.put(`/gallery/${id}`, data),
  delete: (id) => api.delete(`/gallery/${id}`),
}
export const sliderAPI = {
  getAll: () => api.get("/slider"),
  addImage: (data) => api.post("/slider/add-image", data),
  deleteImage: (imageId) => api.delete(`/slider/delete-image/${imageId}`),
  toggle: () => api.post("/slider/toggle"),
  reorder: (imageIds) => api.post("/slider/reorder", { imageIds }),
  updateImage: (imageId, data) => api.put(`/slider/update-image/${imageId}`, data), // Add this
}

export { api }
