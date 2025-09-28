
import { useState, useEffect } from "react"
import { awardsAPI } from "../../services/api"

const AwardsSection = () => {
  const [awards, setAwards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const response = await awardsAPI.getAll()
        setAwards(response.data)
      } catch (error) {
        console.error("Error fetching awards:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAwards()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
  }

  if (loading) {
    return (
      <section id="awards" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-lg">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (awards.length === 0) {
    return null
  }

  return (
    <section id="awards" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Honors & Awards</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {awards.map((award) => (
            <div key={award._id} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{award.title}</h3>
                  <p className="text-lg text-blue-600 font-medium mb-2">{award.issuer}</p>
                </div>
                <div className="text-gray-600 text-right">
                  <p className="font-medium">{formatDate(award.date)}</p>
                </div>
              </div>

              {award.description && <p className="text-gray-700 mb-4 leading-relaxed">{award.description}</p>}

              {award.url && (
                <a
                  href={award.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  View Award
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AwardsSection
