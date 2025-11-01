import { useState, useEffect } from "react"
import { certificationsAPI } from "../../services/api"
import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm"


const CertificationsSection = () => {
  const [certifications, setCertifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const response = await certificationsAPI.getAll()
        setCertifications(response.data)
      } catch (error) {
        console.error("Error fetching certifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCertifications()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
  }

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  if (loading) {
    return (
      <section id="certifications" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg">
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

  if (certifications.length === 0) {
    return null
  }

  return (
    <section id="certifications" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Licenses & Certifications</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certifications.map((cert) => (
            <div key={cert._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{cert.name}</h3>
                  <p className="text-lg text-blue-600 font-medium mb-2">{cert.issuer}</p>
                </div>
                {cert.expiryDate && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isExpired(cert.expiryDate) ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {isExpired(cert.expiryDate) ? "Expired" : "Active"}
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <p>
                  <span className="font-medium">Issued:</span> {formatDate(cert.issueDate)}
                </p>
                {cert.expiryDate && (
                  <p>
                    <span className="font-medium">Expires:</span> {formatDate(cert.expiryDate)}
                  </p>
                )}
                {cert.credentialId && (
                  <p>
                    <span className="font-medium">Credential ID:</span> {cert.credentialId}
                  </p>
                )}
              </div>

        

               {cert.description && (
    <div className="text-gray-700 mb-4 leading-relaxed prose prose-gray max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {cert.description}
      </ReactMarkdown>
    </div>
  )}

              {cert.url && (
                <a
                  href={cert.url}
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
                  View Credential
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CertificationsSection