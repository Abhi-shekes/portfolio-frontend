
import { useState, useEffect } from "react"
import { experienceAPI } from "../../services/api"

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await experienceAPI.getAll()
        setExperiences(response.data)
      } catch (error) {
        console.error("Error fetching experiences:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
  }

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-8"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (experiences.length === 0) {
    return null
  }

  return (
    <section id="experience" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Experience</h2>
        </div>

        <div className="space-y-8">
          {experiences.map((experience) => (
            <div key={experience._id} className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{experience.position}</h3>
                  <p className="text-lg text-blue-600 font-medium mb-2">{experience.company}</p>
                  {experience.location && <p className="text-gray-600 mb-2">{experience.location}</p>}
                </div>
                <div className="text-gray-600 md:text-right">
                  <p className="font-medium">
                    {formatDate(experience.startDate)} -{" "}
                    {experience.current ? "Present" : formatDate(experience.endDate)}
                  </p>
                </div>
              </div>

              {experience.description && <p className="text-gray-700 mb-4 leading-relaxed">{experience.description}</p>}

              {experience.achievements && experience.achievements.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Achievements:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {experience.achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-700">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {experience.technologies && experience.technologies.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExperienceSection
