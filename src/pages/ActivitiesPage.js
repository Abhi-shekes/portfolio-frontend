"use client"

import { useState, useEffect } from "react"
import Navigation from "../components/Navigation"
import { api } from "../services/api"
import toast from "react-hot-toast"
import "../styles/ActivitiesPage.css"

export default function ActivitiesPage() {
  const [talks, setTalks] = useState([])
  const [internships, setInternships] = useState([])
  const [workshops, setWorkshops] = useState([])
  const [trainings, setTrainings] = useState([])
  const [appreciations, setAppreciations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("talks")

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const [talksRes, internshipsRes, workshopsRes, trainingsRes, appreciationsRes] = await Promise.all([
        api.get("/talks"),
        api.get("/internships"),
        api.get("/workshops"),
        api.get("/trainings"),
        api.get("/appreciations"),
      ])

      setTalks(talksRes.data || [])
      setInternships(internshipsRes.data || [])
      setWorkshops(workshopsRes.data || [])
      setTrainings(trainingsRes.data || [])
      setAppreciations(appreciationsRes.data || [])
    } catch (error) {
      console.error("Error fetching activities:", error)
      toast.error("Failed to load activities")
    } finally {
      setLoading(false)
    }
  }

  const renderTalks = () => (
    <div className="activities-grid">
      {talks.length === 0 ? (
        <p className="no-data">No talks delivered yet</p>
      ) : (
        talks.map((talk) => (
          <div key={talk._id} className="activity-card">
            <h3>{talk.title}</h3>
            <p className="event">{talk.event}</p>
            <p className="date">{new Date(talk.date).toLocaleDateString()}</p>
            {talk.location && <p className="location">{talk.location}</p>}
            {talk.description && <p className="description">{talk.description}</p>}
            {talk.url && (
              <a href={talk.url} target="_blank" rel="noopener noreferrer" className="link-btn">
                View Talk
              </a>
            )}
          </div>
        ))
      )}
    </div>
  )

  const renderInternships = () => (
    <div className="activities-grid">
      {internships.length === 0 ? (
        <p className="no-data">No internships offered yet</p>
      ) : (
        internships.map((internship) => (
          <div key={internship._id} className="activity-card">
            <h3>{internship.title}</h3>
            <p className="company">{internship.company}</p>
            <p className="date">
              {new Date(internship.startDate).toLocaleDateString()} -{" "}
              {internship.endDate ? new Date(internship.endDate).toLocaleDateString() : "Present"}
            </p>
            {internship.location && <p className="location">{internship.location}</p>}
            {internship.description && <p className="description">{internship.description}</p>}
            {internship.skills && internship.skills.length > 0 && (
              <div className="skills-list">
                {internship.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )

  const renderWorkshops = () => (
    <div className="activities-grid">
      {workshops.length === 0 ? (
        <p className="no-data">No workshops yet</p>
      ) : (
        workshops.map((workshop) => (
          <div key={workshop._id} className="activity-card">
            <h3>{workshop.title}</h3>
            <p className="type">{workshop.type === "attended" ? "Attended" : "Conducted"}</p>
            <p className="organizer">{workshop.organizer}</p>
            <p className="date">{new Date(workshop.date).toLocaleDateString()}</p>
            {workshop.location && <p className="location">{workshop.location}</p>}
            {workshop.duration && <p className="duration">Duration: {workshop.duration}</p>}
            {workshop.description && <p className="description">{workshop.description}</p>}
          </div>
        ))
      )}
    </div>
  )

  const renderTrainings = () => (
    <div className="activities-grid">
      {trainings.length === 0 ? (
        <p className="no-data">No trainings attended yet</p>
      ) : (
        trainings.map((training) => (
          <div key={training._id} className="activity-card">
            <h3>{training.title}</h3>
            <p className="provider">{training.provider}</p>
            <p className="date">
              {new Date(training.startDate).toLocaleDateString()} -{" "}
              {training.endDate ? new Date(training.endDate).toLocaleDateString() : "Present"}
            </p>
            {training.duration && <p className="duration">Duration: {training.duration}</p>}
            {training.description && <p className="description">{training.description}</p>}
            {training.skills && training.skills.length > 0 && (
              <div className="skills-list">
                {training.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )

  const renderAppreciations = () => (
    <div className="activities-grid">
      {appreciations.length === 0 ? (
        <p className="no-data">No appreciations yet</p>
      ) : (
        appreciations.map((appreciation) => (
          <div key={appreciation._id} className="activity-card">
            <h3>{appreciation.title}</h3>
            <p className="awarded-by">{appreciation.awardedBy}</p>
            <p className="date">{new Date(appreciation.date).toLocaleDateString()}</p>
            {appreciation.category && <p className="category">{appreciation.category}</p>}
            {appreciation.description && <p className="description">{appreciation.description}</p>}
          </div>
        ))
      )}
    </div>
  )

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="loading">Loading activities...</div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="activities-page">
        <div className="page-header">
          <h1>Activities</h1>
          <p>Talks, Internships, Workshops, Trainings & Appreciations</p>
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === "talks" ? "active" : ""}`} onClick={() => setActiveTab("talks")}>
            Talks Delivered ({talks.length})
          </button>
          <button
            className={`tab ${activeTab === "internships" ? "active" : ""}`}
            onClick={() => setActiveTab("internships")}
          >
            Internships ({internships.length})
          </button>
          <button
            className={`tab ${activeTab === "workshops" ? "active" : ""}`}
            onClick={() => setActiveTab("workshops")}
          >
            Workshops ({workshops.length})
          </button>
          <button
            className={`tab ${activeTab === "trainings" ? "active" : ""}`}
            onClick={() => setActiveTab("trainings")}
          >
            Trainings ({trainings.length})
          </button>
          <button
            className={`tab ${activeTab === "appreciations" ? "active" : ""}`}
            onClick={() => setActiveTab("appreciations")}
          >
            Appreciations ({appreciations.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "talks" && renderTalks()}
          {activeTab === "internships" && renderInternships()}
          {activeTab === "workshops" && renderWorkshops()}
          {activeTab === "trainings" && renderTrainings()}
          {activeTab === "appreciations" && renderAppreciations()}
        </div>
      </div>
    </>
  )
}
