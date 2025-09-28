
import { useState, useEffect } from "react"
import { patentsAPI } from "../../services/api"

const PatentsSection = () => {
  const [patents, setPatents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatents = async () => {
      try {
        const response = await patentsAPI.getAll()
        setPatents(response.data)
      } catch (error) {
        console.error("Error fetching patents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatents()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Granted":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Filed":
        return "bg-blue-100 text-blue-800"
      case "Expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <section id="patents" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-8"></div>
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (patents.length === 0) {
    return null
  }

  return (
    <section id="patents" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Patents</h2>
        </div>

        <div className="space-y-8">
          {patents.map((patent) => (
            <div key={patent._id} className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{patent.title}</h3>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Patent Number:</span> {patent.patentNumber}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patent.status)}`}>
                  {patent.status}
                </span>
              </div>

              {patent.inventors && patent.inventors.length > 0 && (
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Inventors:</span> {patent.inventors.join(", ")}
                </p>
              )}

              {patent.assignee && (
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Assignee:</span> {patent.assignee}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                {patent.filingDate && (
                  <span>
                    <span className="font-medium">Filed:</span> {formatDate(patent.filingDate)}
                  </span>
                )}
                {patent.grantDate && (
                  <span>
                    <span className="font-medium">Granted:</span> {formatDate(patent.grantDate)}
                  </span>
                )}
              </div>

              {patent.description && <p className="text-gray-700 mb-4 leading-relaxed">{patent.description}</p>}

              {patent.url && (
                <a
                  href={patent.url}
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
                  View Patent
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PatentsSection
