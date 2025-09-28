

import { useState, useEffect } from "react"

const Navigation = ({ sections }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigationCategories = {
    About: {
      label: "About",
      sections: ["about", "skills", "languages", "interests"],
      icon: "👤",
    },
    Experience: {
      label: "Experience",
      sections: ["experience", "education", "certifications", "courses"],
      icon: "💼",
    },
    Work: {
      label: "Work",
      sections: ["projects", "publications", "patents"],
      icon: "🚀",
    },
    Recognition: {
      label: "Recognition",
      sections: ["awards", "testscores", "volunteer"],
      icon: "🏆",
    },
  }

  const sectionLabels = {
    hero: "Home",
    about: "About Me",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    volunteer: "Volunteer Work",
    publications: "Publications",
    patents: "Patents",
    awards: "Awards",
    testscores: "Test Scores",
    languages: "Languages",
    certifications: "Certifications",
    courses: "Courses",
    interests: "Interests",
    contact: "Contact",
  }

  const scrollToSection = (sectionName) => {
    const element = document.getElementById(sectionName)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
    setActiveDropdown(null)
  }

  const handleDropdownToggle = (category) => {
    setActiveDropdown(activeDropdown === category ? null : category)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50 shadow-2xl" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-xl font-bold text-white hover:text-blue-400 transition-all duration-300 tracking-tight"
            >
              Portfolio
            </button>
          </div>

          <div className="hidden lg:block">
            <div className="flex items-center space-x-1">
              {Object.entries(navigationCategories).map(([category, config]) => (
                <div key={category} className="relative group">
                  <button
                    onMouseEnter={() => setActiveDropdown(category)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="flex items-center space-x-2 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/5"
                  >
                    <span>{config.label}</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {activeDropdown === category && (
                    <div
                      className="absolute top-full left-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-2xl py-2"
                      onMouseEnter={() => setActiveDropdown(category)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {config.sections.map((sectionName) => {
                        const sectionExists = sections.find((s) => s.name === sectionName)
                        if (!sectionExists) return null

                        return (
                          <button
                            key={sectionName}
                            onClick={() => scrollToSection(sectionName)}
                            className="w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm"
                          >
                            {sectionLabels[sectionName] || sectionName}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={() => scrollToSection("contact")}
                className="ml-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Contact
              </button>
            </div>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white focus:outline-none transition-colors duration-300 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-6 space-y-1 bg-slate-900/95 backdrop-blur-md rounded-xl mt-2 border border-slate-800/50 shadow-2xl">
              {Object.entries(navigationCategories).map(([category, config]) => (
                <div key={category} className="space-y-1">
                  <button
                    onClick={() => handleDropdownToggle(category)}
                    className="w-full flex items-center justify-between text-slate-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300"
                  >
                    <span>{config.label}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === category ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {activeDropdown === category && (
                    <div className="ml-4 space-y-1">
                      {config.sections.map((sectionName) => {
                        const sectionExists = sections.find((s) => s.name === sectionName)
                        if (!sectionExists) return null

                        return (
                          <button
                            key={sectionName}
                            onClick={() => scrollToSection(sectionName)}
                            className="w-full text-left text-slate-400 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg text-sm transition-all duration-300"
                          >
                            {sectionLabels[sectionName] || sectionName}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={() => scrollToSection("contact")}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 mt-4"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
