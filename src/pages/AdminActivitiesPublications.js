"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { sectionsAPI } from "../services/api"
import AdminLayout from "../components/admin/AdminLayout"
import SectionManager from "../components/admin/SectionManager"

const AdminActivitiesPublications = () => {
  const [activeTab, setActiveTab] = useState("activities")
  const [sections, setSections] = useState({})
  const [loading, setLoading] = useState(true)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAllSections()
  }, [])

  const fetchAllSections = async () => {
    try {
      setLoading(true)
      const response = await sectionsAPI.getAll()
      const sectionMap = {}
      response.data.forEach((section) => {
        sectionMap[section.name] = section.isEnabled
      })
      setSections(sectionMap)
    } catch (error) {
      toast.error("Failed to fetch sections")
    } finally {
      setLoading(false)
    }
  }

  const toggleSubsection = async (sectionName) => {
    try {
      await sectionsAPI.toggle(sectionName)
      setSections((prev) => ({
        ...prev,
        [sectionName]: !prev[sectionName],
      }))
      toast.success("Section updated successfully")
    } catch (error) {
      toast.error("Failed to update section")
    }
  }

  const sectionLabels = {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <AdminLayout unreadMessages={unreadMessages}>
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activities, Publications & Gallery</h1>
          <p className="text-gray-600">
            Manage all your activities, publications, and gallery content with independent controls
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("activities")}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "activities"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Activities
          </button>
          <button
            onClick={() => setActiveTab("publications")}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "publications"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Publications
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "gallery"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Gallery
          </button>
        </div>

        {/* Activities Tab */}
        {activeTab === "activities" && (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-blue-900 mb-2">Activities Management</h2>
              <p className="text-blue-800">Manage talks, internships, workshops, trainings, and appreciations</p>
            </div>

            {/* Activities Subsections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {["talks", "internships", "workshops", "trainings", "appreciations"].map((section) => (
                <div key={section} className="bg-white border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{sectionLabels[section]}</h3>
                    <p className="text-sm text-gray-600 mt-1">{sections[section] ? "Enabled" : "Disabled"}</p>
                  </div>
                  <button
                    onClick={() => toggleSubsection(section)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      sections[section] ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        sections[section] ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* Activities CRUD Forms */}
            <div className="space-y-8">
              {sections.talks && <SectionManager sectionName="talks" sectionLabel={sectionLabels.talks} />}
              {sections.internships && (
                <SectionManager sectionName="internships" sectionLabel={sectionLabels.internships} />
              )}
              {sections.workshops && <SectionManager sectionName="workshops" sectionLabel={sectionLabels.workshops} />}
              {sections.trainings && <SectionManager sectionName="trainings" sectionLabel={sectionLabels.trainings} />}
              {sections.appreciations && (
                <SectionManager sectionName="appreciations" sectionLabel={sectionLabels.appreciations} />
              )}
            </div>
          </div>
        )}

        {/* Publications Tab */}
        {activeTab === "publications" && (
          <div className="space-y-8">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-purple-900 mb-2">Publications Management</h2>
              <p className="text-purple-800">
                Manage journal papers, research papers, conference papers, and book chapters
              </p>
            </div>

            {/* Publications Subsections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {["journalpapers", "researchpapers", "conferencepapers", "bookchapters"].map((section) => (
                <div key={section} className="bg-white border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{sectionLabels[section]}</h3>
                    <p className="text-sm text-gray-600 mt-1">{sections[section] ? "Enabled" : "Disabled"}</p>
                  </div>
                  <button
                    onClick={() => toggleSubsection(section)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                      sections[section] ? "bg-purple-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        sections[section] ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* Publications CRUD Forms */}
            <div className="space-y-8">
              {sections.journalpapers && (
                <SectionManager sectionName="journalpapers" sectionLabel={sectionLabels.journalpapers} />
              )}
              {sections.researchpapers && (
                <SectionManager sectionName="researchpapers" sectionLabel={sectionLabels.researchpapers} />
              )}
              {sections.conferencepapers && (
                <SectionManager sectionName="conferencepapers" sectionLabel={sectionLabels.conferencepapers} />
              )}
              {sections.bookchapters && (
                <SectionManager sectionName="bookchapters" sectionLabel={sectionLabels.bookchapters} />
              )}
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div className="space-y-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-green-900 mb-2">Gallery Management</h2>
              <p className="text-green-800">Manage your portfolio gallery images</p>
            </div>

            {/* Gallery Toggle */}
            <div className="bg-white border rounded-lg p-4 flex items-center justify-between mb-8">
              <div>
                <h3 className="font-semibold text-gray-900">{sectionLabels.gallery}</h3>
                <p className="text-sm text-gray-600 mt-1">{sections.gallery ? "Enabled" : "Disabled"}</p>
              </div>
              <button
                onClick={() => toggleSubsection("gallery")}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  sections.gallery ? "bg-green-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    sections.gallery ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Gallery CRUD Form */}
            {sections.gallery && <SectionManager sectionName="gallery" sectionLabel={sectionLabels.gallery} />}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminActivitiesPublications
