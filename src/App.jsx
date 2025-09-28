import { Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Home from "./pages/Home.js"
import AdminLogin from "./pages/AdminLogin.js"
import AdminDashboard from "./pages/AdminDashboard.js"
import ProtectedRoute from "./components/ProtectedRoute.js"

import "./App.css"

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
