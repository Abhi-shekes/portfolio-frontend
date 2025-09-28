
import { useState, useEffect } from "react"
import { educationAPI } from "../../services/api"

const EducationSection = () => {
  const [education, setEducation] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await educationAPI.getAll()
        setEducation(response.data)
      } catch (error) {
        console.error("Error fetching education:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEducation()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
  }

  if (loading) {
    return (
      <section id="education" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-8"></div>
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-lg">
                  <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (education.length === 0) {
    return null
  }

  return (
    <section id="education" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Education</h2>
        </div>

        <div className="space-y-8">
          {education.map((edu) => (
            <div key={edu._id} className="bg-gray-50 rounded-lg p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{edu.degree}</h3>
                  {edu.field && <p className="text-lg text-gray-700 mb-2">{edu.field}</p>}
                  <p className="text-lg text-blue-600 font-medium mb-2">{edu.institution}</p>
                  {edu.location && <p className="text-gray-600">{edu.location}</p>}
                </div>
                <div className="text-gray-600 md:text-right">
                  <p className="font-medium">
                    {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                  </p>
                  {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                </div>
              </div>

              {edu.description && <p className="text-gray-700 mb-4 leading-relaxed">{edu.description}</p>}

              {edu.achievements && edu.achievements.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Achievements:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {edu.achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-700">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EducationSection
