"use client"

import { useState, useEffect } from "react"
import Navigation from "../components/Navigation"
import { api } from "../services/api"
import toast from "react-hot-toast"
import "../styles/PublicationsPage.css"
import ImageGallery from "../components/common/ImageGallery"

export default function PublicationsPage() {
  const [journalPapers, setJournalPapers] = useState([])
  const [researchPapers, setResearchPapers] = useState([])
  const [conferencePapers, setConferencePapers] = useState([])
  const [bookChapters, setBookChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("journal")

  useEffect(() => {
    fetchPublications()
  }, [])

  const fetchPublications = async () => {
    try {
      setLoading(true)
      const [journalRes, researchRes, conferenceRes, bookRes] = await Promise.all([
        api.get("/journal-papers"),
        api.get("/research-papers"),
        api.get("/conference-papers"),
        api.get("/book-chapters"),
      ])

      setJournalPapers(journalRes.data || [])
      setResearchPapers(researchRes.data || [])
      setConferencePapers(conferenceRes.data || [])
      setBookChapters(bookRes.data || [])
    } catch (error) {
      console.error("Error fetching publications:", error)
      toast.error("Failed to load publications")
    } finally {
      setLoading(false)
    }
  }

  const renderPaperCard = (paper, type) => (
    <div key={paper._id} className="publication-card">
      <h3>{paper.title}</h3>
      {paper.authors && paper.authors.length > 0 && <p className="authors">{paper.authors.join(", ")}</p>}
      {type === "journal" && (
        <>
          <p className="journal">{paper.journal}</p>
          {paper.volume && <p className="volume">Vol. {paper.volume}</p>}
          {paper.issue && <p className="issue">Issue {paper.issue}</p>}
        </>
      )}
      {type === "conference" && (
        <>
          <p className="conference">{paper.conference}</p>
          <p className="date">{new Date(paper.conferenceDate).toLocaleDateString()}</p>
          {paper.location && <p className="location">{paper.location}</p>}
        </>
      )}
      {type === "book" && (
        <>
          <p className="book-title">{paper.bookTitle}</p>
          <p className="publisher">{paper.publisher}</p>
          {paper.chapterNumber && <p className="chapter">Chapter {paper.chapterNumber}</p>}
        </>
      )}
      {paper.publishDate && <p className="date">{new Date(paper.publishDate).toLocaleDateString()}</p>}
      {paper.abstract && <p className="abstract">{paper.abstract}</p>}
      <div className="paper-links">
        {paper.doi && (
          <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="link-btn">
            DOI
          </a>
        )}
        {paper.url && (
          <a href={paper.url} target="_blank" rel="noopener noreferrer" className="link-btn">
            View
          </a>
        )}
        {paper.pdf && (
          <a href={paper.pdf} target="_blank" rel="noopener noreferrer" className="link-btn">
            PDF
          </a>
        )}
      </div>
      {paper.images && paper.images.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Images:</h4>
          <ImageGallery images={paper.images} />
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="loading">Loading publications...</div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="publications-page">
        <div className="page-header">
          <h1>Publications</h1>
          <p>Journal Papers, Research Papers, Conference Papers & Book Chapters</p>
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === "journal" ? "active" : ""}`} onClick={() => setActiveTab("journal")}>
            Journal Papers ({journalPapers.length})
          </button>
          <button
            className={`tab ${activeTab === "research" ? "active" : ""}`}
            onClick={() => setActiveTab("research")}
          >
            Research Papers ({researchPapers.length})
          </button>
          <button
            className={`tab ${activeTab === "conference" ? "active" : ""}`}
            onClick={() => setActiveTab("conference")}
          >
            Conference Papers ({conferencePapers.length})
          </button>
          <button className={`tab ${activeTab === "book" ? "active" : ""}`} onClick={() => setActiveTab("book")}>
            Book Chapters ({bookChapters.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "journal" && (
            <div className="publications-grid">
              {journalPapers.length === 0 ? (
                <p className="no-data">No journal papers yet</p>
              ) : (
                journalPapers.map((paper) => renderPaperCard(paper, "journal"))
              )}
            </div>
          )}
          {activeTab === "research" && (
            <div className="publications-grid">
              {researchPapers.length === 0 ? (
                <p className="no-data">No research papers yet</p>
              ) : (
                researchPapers.map((paper) => renderPaperCard(paper, "research"))
              )}
            </div>
          )}
          {activeTab === "conference" && (
            <div className="publications-grid">
              {conferencePapers.length === 0 ? (
                <p className="no-data">No conference papers yet</p>
              ) : (
                conferencePapers.map((paper) => renderPaperCard(paper, "conference"))
              )}
            </div>
          )}
          {activeTab === "book" && (
            <div className="publications-grid">
              {bookChapters.length === 0 ? (
                <p className="no-data">No book chapters yet</p>
              ) : (
                bookChapters.map((paper) => renderPaperCard(paper, "book"))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
