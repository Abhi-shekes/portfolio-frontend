
import { useState, useEffect } from "react"
import { volunteerAPI } from "../../services/api"

const VolunteerSection = () => {
  const [volunteer, setVolunteer] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const response = await volunteerAPI.getAll()
        setVolunteer(response.data)
      } catch (error) {
        console.error("Error fetching volunteer data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVolunteer()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
  }

  if (loading) {
    return (
      <section id="volunteer" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-8"></div>
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg">
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

  if (volunteer.length === 0) {
    return null
  }

  return (
    <section id="volunteer" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Volunteer Experience</h2>
        </div>

        <div className="space-y-8">
          {volunteer.map((vol) => (
            <div key={vol._id} className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{vol.role}</h3>
                  <p className="text-lg text-green-600 font-medium mb-2">{vol.organization}</p>
                  {vol.location && <p className="text-gray-600">{vol.location}</p>}
                </div>
                <div className="text-gray-600 md:text-right">
                  <p className="font-medium">
                    {formatDate(vol.startDate)} - {vol.current ? "Present" : formatDate(vol.endDate)}
                  </p>
                </div>
              </div>

              {vol.description && <p className="text-gray-700 mb-4 leading-relaxed">{vol.description}</p>}

              {vol.achievements && vol.achievements.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Achievements:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {vol.achievements.map((achievement, index) => (
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

export default VolunteerSection
