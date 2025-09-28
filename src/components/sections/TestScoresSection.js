
import { useState, useEffect } from "react"
import { testScoresAPI } from "../../services/api"

const TestScoresSection = () => {
  const [testScores, setTestScores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTestScores = async () => {
      try {
        const response = await testScoresAPI.getAll()
        setTestScores(response.data)
      } catch (error) {
        console.error("Error fetching test scores:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestScores()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
  }

  if (loading) {
    return (
      <section id="testscores" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg">
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (testScores.length === 0) {
    return null
  }

  return (
    <section id="testscores" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Test Scores</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testScores.map((test) => (
            <div key={test._id} className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{test.testName}</h3>

              <div className="mb-4">
                <span className="text-3xl font-bold text-blue-600">{test.score}</span>
                {test.maxScore && <span className="text-gray-600 ml-1">/ {test.maxScore}</span>}
              </div>

              <p className="text-gray-600 mb-4">{formatDate(test.date)}</p>

              {test.description && <p className="text-gray-700 text-sm leading-relaxed">{test.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestScoresSection
