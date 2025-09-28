

import { useState } from "react"
import toast from "react-hot-toast"
import { sectionsAPI } from "../../services/api"

const SectionToggle = ({ sections, onSectionsUpdate }) => {
  const [loading, setLoading] = useState(false)

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
  }

  const toggleSection = async (sectionName) => {
    setLoading(true)
    try {
      await sectionsAPI.toggle(sectionName)
      await onSectionsUpdate()
      toast.success("Section updated successfully")
    } catch (error) {
      toast.error("Failed to update section")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Section Visibility</h2>
          <p className="text-gray-600 mt-1">Control which sections appear on your portfolio</p>
        </div>
        <div className="text-sm text-gray-500">
          {sections.filter((s) => s.isEnabled).length} of {sections.length} sections enabled
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <div
            key={section.name}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${section.isEnabled ? "bg-green-500" : "bg-gray-300"}`} />
              <div>
                <h3 className="font-medium text-gray-900">{sectionLabels[section.name] || section.name}</h3>
                <p className="text-sm text-gray-500">{section.isEnabled ? "Visible" : "Hidden"}</p>
              </div>
            </div>
            <button
              onClick={() => toggleSection(section.name)}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                section.isEnabled ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  section.isEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionToggle
