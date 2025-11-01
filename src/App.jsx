import { Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Home from "./pages/Home"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import AdminActivitiesPublications from "./pages/AdminActivitiesPublications"
import ProtectedRoute from "./components/ProtectedRoute"
import ActivitiesPage from "./pages/ActivitiesPage"
import PublicationsPage from "./pages/PublicationsPage"
import GalleryPage from "./pages/GalleryPage"
import "./App.css"
import AdminMessages from "./pages/AdminMessages"
import AdminSlider from "./pages/AdminSlider" // New import

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/activities-publications"
          element={
            <ProtectedRoute>
              <AdminActivitiesPublications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute>
              <AdminMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/slider"
          element={
            <ProtectedRoute>
              <AdminSlider /> {/* Updated element */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
