
import { useState, useEffect } from "react"
import { sectionsAPI } from "../services/api"
import HeroSection from "../components/sections/HeroSection"
import AboutSection from "../components/sections/AboutSection"
import ExperienceSection from "../components/sections/ExperienceSection"
import EducationSection from "../components/sections/EducationSection"
import SkillsSection from "../components/sections/SkillsSection"
import ProjectsSection from "../components/sections/ProjectsSection"
import VolunteerSection from "../components/sections/VolunteerSection"
import PublicationsSection from "../components/sections/PublicationsSection"
import PatentsSection from "../components/sections/PatentsSection"
import AwardsSection from "../components/sections/AwardsSection"
import TestScoresSection from "../components/sections/TestScoresSection"
import LanguagesSection from "../components/sections/LanguagesSection"
import CertificationsSection from "../components/sections/CertificationsSection"
import CoursesSection from "../components/sections/CoursesSection"
import ContactSection from "../components/sections/ContactSection"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"

const Home = () => {
  const [enabledSections, setEnabledSections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnabledSections = async () => {
      try {
        const response = await sectionsAPI.getEnabled()
        setEnabledSections(response.data)
      } catch (error) {
        console.error("Error fetching enabled sections:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnabledSections()
  }, [])

  const sectionComponents = {
    hero: HeroSection,
    about: AboutSection,
    experience: ExperienceSection,
    education: EducationSection,
    skills: SkillsSection,
    projects: ProjectsSection,
    volunteer: VolunteerSection,
    publications: PublicationsSection,
    patents: PatentsSection,
    awards: AwardsSection,
    testscores: TestScoresSection,
    languages: LanguagesSection,
    certifications: CertificationsSection,
    courses: CoursesSection,
    contact: ContactSection,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation sections={enabledSections} />
      <main>
        {enabledSections.map((section) => {
          const SectionComponent = sectionComponents[section.name]
          return SectionComponent ? <SectionComponent key={section.name} /> : null
        })}
      </main>
      <Footer />
    </div>
  )
}

export default Home
