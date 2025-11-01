import { useState, useEffect } from "react"
import { aboutAPI } from "../../services/api"
import EnhancedImage from "../common/EnhancedImage"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm" // ✅ Enables bold, italic, lists, tables, etc.

const AboutSection = () => {
  const [aboutData, setAboutData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await aboutAPI.get()
        setAboutData(response.data)
      } catch (error) {
        console.error("Error fetching about data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAboutData()
  }, [])

  if (loading) {
    return (
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-8"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!aboutData) return null

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{aboutData.title}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {aboutData.image && (
            <div className="order-2 lg:order-1">
              <EnhancedImage
                src={aboutData.image}
                alt="About"
                className="rounded-lg shadow-lg w-full h-auto"
                fallback="/placeholder.svg"
              />
            </div>
          )}

          <div className={`order-1 ${aboutData.image ? "lg:order-2" : "lg:col-span-2"}`}>
            {/* Markdown content renderer */}
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {aboutData.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
