"use client"

import { useState, useEffect } from "react"
import { publicationsAPI } from "../../services/api"
import ImageGallery from "../common/ImageGallery"

const PublicationsSection = () => {
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await publicationsAPI.getAll()
        setPublications(response.data)
      } catch (error) {
        console.error("Error fetching publications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPublications()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
  }

  const getLayoutClass = (itemCount) => {
    if (itemCount === 1) {
      return "flex justify-center"
    } else if (itemCount === 2) {
      return "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
    } else if (itemCount === 3) {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    } else {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
    }
  }

  const getItemClass = (itemCount) => {
    if (itemCount === 1) {
      return "bg-gray-50 rounded-lg p-6 md:p-8 max-w-4xl w-full"
    }
    return "bg-gray-50 rounded-lg p-6 md:p-8"
  }

  if (loading) {
    return (
      <section id="publications" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-8"></div>
            <div className="space-y-6">
              {[1, 2].map((i) => (
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

  if (publications.length === 0) {
    return null
  }

  return (
    <section id="publications" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Publications</h2>
        </div>

        <div className={getLayoutClass(publications.length)}>
          {publications.map((publication) => (
            <div key={publication._id} className={getItemClass(publications.length)}>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{publication.title}</h3>

              {publication.authors && publication.authors.length > 0 && (
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Authors:</span> {publication.authors.join(", ")}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                {publication.journal && (
                  <span>
                    <span className="font-medium">Journal:</span> {publication.journal}
                  </span>
                )}
                {publication.conference && (
                  <span>
                    <span className="font-medium">Conference:</span> {publication.conference}
                  </span>
                )}
                {publication.publishDate && (
                  <span>
                    <span className="font-medium">Published:</span> {formatDate(publication.publishDate)}
                  </span>
                )}
              </div>

              {publication.abstract && <p className="text-gray-700 mb-4 leading-relaxed">{publication.abstract}</p>}

              {publication.images && publication.images.length > 0 && (
                <div className="mb-4">
                  <ImageGallery images={publication.images} />
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {publication.url && (
                  <a
                    href={publication.url}
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
                    View Publication
                  </a>
                )}
                {publication.doi && (
                  <span className="text-gray-600 text-sm">
                    <span className="font-medium">DOI:</span> {publication.doi}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PublicationsSection
