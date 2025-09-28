
import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { authAPI } from "../services/api"

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      try {
        await authAPI.getCurrentUser()
        setIsAuthenticated(true)
      } catch (error) {
        setIsAuthenticated(false)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}

export default ProtectedRoute
