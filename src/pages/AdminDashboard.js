"use client"

import { useState, useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import toast from "react-hot-toast"
import { sectionsAPI, contactAPI } from "../services/api"
import AdminLayout from "../components/admin/AdminLayout"
import SectionManager from "../components/admin/SectionManager"
import SectionToggle from "../components/admin/SectionToggle"
import StatsCard from "../components/admin/StatsCard"
import ContactMessages from "../components/admin/ContactMessages"
import SliderManager from "../components/admin/SliderManager"

const AdminDashboard = () => {
  const [sections, setSections] = useState([])
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const location = useLocation()

  useEffect(() => {
    fetchSections()
    fetchUnreadMessages()
    fetchStats()
  }, [])

  const fetchSections = async () => {
    try {
      const response = await sectionsAPI.getAll()
      setSections(response.data)
    } catch (error) {
      toast.error("Failed to fetch sections")
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadMessages = async () => {
    try {
      const response = await contactAPI.getAll()
      const unread = response.data.filter((msg) => !msg.read).length
      setUnreadMessages(unread)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const enabledSections = sections.filter((s) => s.isEnabled).length
      const totalSections = sections.length

      setStats({
        enabledSections,
        totalSections,
        unreadMessages,
        lastUpdated: new Date().toLocaleDateString(),
      })
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [sections, unreadMessages])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const personalInfoSections = sections.filter(
    (s) => ["hero", "about", "skills", "languages"].includes(s.name) && s.isEnabled,
  )

  const experienceSections = sections.filter(
    (s) => ["experience", "education", "certifications", "courses"].includes(s.name) && s.isEnabled,
  )

  const workSections = sections.filter(
    (s) =>
      [
        "projects",
        "publications",
        "patents",
        "talks",
        "internships",
        "workshops",
        "trainings",
        "journalpapers",
        "researchpapers",
        "conferencepapers",
        "bookchapters",
      ].includes(s.name) && s.isEnabled,
  )

  const recognitionSections = sections.filter(
    (s) => ["awards", "testscores", "volunteer", "appreciations"].includes(s.name) && s.isEnabled,
  )

  const gallerySections = sections.filter((s) => ["gallery"].includes(s.name) && s.isEnabled)

  const sectionLabels = {
    hero: "Hero Section",
    about: "About",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    volunteer: "Volunteer",
    publications: "Publications",
    patents: "Patents",
    awards: "Awards",
    testscores: "Test Scores",
    languages: "Languages",
    certifications: "Certifications",
    courses: "Courses",
    contact: "Contact",
    talks: "Talks Delivered",
    internships: "Internships Offered",
    workshops: "Workshops",
    trainings: "Trainings",
    appreciations: "Appreciations & Awards",
    journalpapers: "Journal Papers",
    researchpapers: "Research Papers",
    conferencepapers: "Conference Papers",
    bookchapters: "Book Chapters",
    gallery: "Gallery",
  }

  return (
    <AdminLayout unreadCount={unreadMessages}>
      <Routes>
        <Route
          path="/"
          element={
            <div className="space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Active Sections"
                  value={stats.enabledSections}
                  subtitle={`of ${stats.totalSections}`}
                  color="blue"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  }
                />
                <StatsCard
                  title="Unread Messages"
                  value={unreadMessages}
                  color={unreadMessages > 0 ? "red" : "green"}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  }
                />
                <StatsCard
                  title="Personal Info"
                  value={personalInfoSections.length}
                  subtitle="sections"
                  color="purple"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  }
                />
                <StatsCard
                  title="Last Updated"
                  value={stats.lastUpdated}
                  color="yellow"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                />
              </div>

              {/* Section Visibility Toggle */}
              <SectionToggle sections={sections} onSectionsUpdate={fetchSections} />

              {/* Personal Information Sections */}
              {personalInfoSections.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
                    <p className="text-gray-600">Manage your basic profile information, skills, and languages</p>
                  </div>
                  <div className="space-y-8">
                    {personalInfoSections.map((section) => (
                      <SectionManager
                        key={section.name}
                        sectionName={section.name}
                        sectionLabel={sectionLabels[section.name] || section.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Experience & Education Sections */}
              {experienceSections.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Experience & Education</h2>
                    <p className="text-gray-600">Manage your professional experience, education, and certifications</p>
                  </div>
                  <div className="space-y-8">
                    {experienceSections.map((section) => (
                      <SectionManager
                        key={section.name}
                        sectionName={section.name}
                        sectionLabel={sectionLabels[section.name] || section.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Work & Projects Sections */}
              {workSections.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Work & Projects</h2>
                    <p className="text-gray-600">Showcase your projects, publications, patents, and activities</p>
                  </div>
                  <div className="space-y-8">
                    {workSections.map((section) => (
                      <SectionManager
                        key={section.name}
                        sectionName={section.name}
                        sectionLabel={sectionLabels[section.name] || section.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Recognition & Achievements Sections */}
              {recognitionSections.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Recognition & Achievements</h2>
                    <p className="text-gray-600">
                      Highlight your awards, appreciations, test scores, and volunteer work
                    </p>
                  </div>
                  <div className="space-y-8">
                    {recognitionSections.map((section) => (
                      <SectionManager
                        key={section.name}
                        sectionName={section.name}
                        sectionLabel={sectionLabels[section.name] || section.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery Section */}
              {gallerySections.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Gallery</h2>
                    <p className="text-gray-600">Manage your portfolio gallery images</p>
                  </div>
                  <div className="space-y-8">
                    {gallerySections.map((section) => (
                      <SectionManager
                        key={section.name}
                        sectionName={section.name}
                        sectionLabel={sectionLabels[section.name] || section.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          }
        />
        <Route path="/messages" element={<ContactMessages onMessagesUpdate={fetchUnreadMessages} />} />
        <Route
          path="/slider"
          element={
            <div>
           
              <SliderManager />
            </div>
          }
        />
      </Routes>
    </AdminLayout>
  )
}

export default AdminDashboard
