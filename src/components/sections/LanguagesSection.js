

import { useState, useEffect } from "react"
import { languagesAPI } from "../../services/api"

const LanguagesSection = () => {
  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await languagesAPI.getAll()
        setLanguages(response.data)
      } catch (error) {
        console.error("Error fetching languages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLanguages()
  }, [])

  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case "Native":
        return "bg-green-100 text-green-800"
      case "Full Professional":
        return "bg-blue-100 text-blue-800"
      case "Professional Working":
        return "bg-yellow-100 text-yellow-800"
      case "Limited Working":
        return "bg-orange-100 text-orange-800"
      case "Elementary":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <section id="languages" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-lg">
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (languages.length === 0) {
    return null
  }

  return (
    <section id="languages" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Languages</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {languages.map((lang) => (
            <div key={lang._id} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{lang.language}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProficiencyColor(lang.proficiency)}`}>
                  {lang.proficiency}
                </span>
              </div>

              {lang.certifications && lang.certifications.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Certifications:</h4>
                  <div className="space-y-2">
                    {lang.certifications.map((cert, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium text-gray-800">{cert.name}</p>
                        {cert.score && <p className="text-gray-600">Score: {cert.score}</p>}
                        {cert.date && (
                          <p className="text-gray-600">
                            {new Date(cert.date).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                          </p>
                        )}
                      </div>
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

export default LanguagesSection
