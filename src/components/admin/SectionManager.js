"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import ImageInput from "./ImageInput"
import {
  heroAPI,
  aboutAPI,
  experienceAPI,
  educationAPI,
  skillsAPI,
  projectsAPI,
  volunteerAPI,
  publicationsAPI,
  patentsAPI,
  awardsAPI,
  testScoresAPI,
  languagesAPI,
  certificationsAPI,
  coursesAPI,
} from "../../services/api"

const SectionManager = ({ sectionName, sectionLabel }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  const apiMap = {
    hero: heroAPI,
    about: aboutAPI,
    experience: experienceAPI,
    education: educationAPI,
    skills: skillsAPI,
    projects: projectsAPI,
    volunteer: volunteerAPI,
    publications: publicationsAPI,
    patents: patentsAPI,
    awards: awardsAPI,
    testscores: testScoresAPI,
    languages: languagesAPI,
    certifications: certificationsAPI,
    courses: coursesAPI,
  }

  const api = apiMap[sectionName]

  useEffect(() => {
    fetchData()
  }, [sectionName])

  const fetchData = async () => {
    try {
      console.log("[v0] Fetching data for", sectionName)
      const response =
        sectionName === "hero" || sectionName === "about"
          ? await api.get()
          : api.getAll
            ? await api.getAll()
            : await api.get()

      const responseData = response.data
      console.log("[v0] Fetched data:", responseData)

      setData(Array.isArray(responseData) ? responseData : [responseData].filter(Boolean))
    } catch (error) {
      console.error(`[v0] Error fetching ${sectionName} data:`, error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (formData) => {
    try {
      console.log("[v0] Form submission for", sectionName, ":", formData)

      if (sectionName === "hero" || sectionName === "about") {
        await api.update(formData)
        toast.success(`${sectionLabel} updated successfully`)
      } else if (editingItem) {
        if (api.update) {
          await api.update(editingItem._id, formData)
        } else {
          await api.update(formData)
        }
        toast.success(`${sectionLabel} updated successfully`)
      } else {
        if (api.create) {
          await api.create(formData)
        } else {
          await api.update(formData)
        }
        toast.success(`${sectionLabel} created successfully`)
      }

      await fetchData()
      setShowForm(false)
      setEditingItem(null)
      reset()
    } catch (error) {
      console.error("[v0] Form submission error:", error)
      toast.error(`Failed to save ${sectionLabel.toLowerCase()}: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    reset(item)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return

    try {
      await api.delete(id)
      toast.success(`${sectionLabel} deleted successfully`)
      await fetchData()
    } catch (error) {
      toast.error(`Failed to delete ${sectionLabel.toLowerCase()}`)
    }
  }

  const renderForm = () => {
    switch (sectionName) {
      case "hero":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Full Name"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("tagline", { required: "Tagline is required" })}
              placeholder="Professional Tagline"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              {...register("description")}
              placeholder="Description"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
              <ImageInput
                register={register}
                name="profileImage"
                placeholder="Profile Image URL or upload file"
                setValue={setValue}
              />
            </div>
            <input
              {...register("resumeUrl")}
              placeholder="Resume URL"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("socials.linkedin")}
              placeholder="LinkedIn URL"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("socials.github")}
              placeholder="GitHub URL"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("socials.twitter")}
              placeholder="Twitter URL"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("socials.email")}
              placeholder="Email"
              type="email"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("socials.website")}
              placeholder="Website URL"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )

      case "about":
        return (
          <div className="space-y-4">
            <input
              {...register("title")}
              placeholder="Section Title (default: About Me)"
              className="border rounded px-3 py-2 w-full text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              {...register("content", { required: "Content is required" })}
              placeholder="About content"
              className="border rounded px-3 py-2 w-full text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="6"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About Image</label>
              <ImageInput
                register={register}
                name="image"
                placeholder="About section image URL or upload file"
                setValue={setValue}
              />
            </div>
          </div>
        )

      case "experience":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("company", { required: "Company is required" })}
              placeholder="Company Name"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("position", { required: "Position is required" })}
              placeholder="Job Title"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("location")}
              placeholder="Location"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex items-center space-x-2">
              <input {...register("current")} type="checkbox" className="rounded" />
              <label className="text-sm text-gray-700">Current Position</label>
            </div>
            <input
              {...register("startDate", { required: "Start date is required" })}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("endDate")}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              {...register("description")}
              placeholder="Job Description"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
            <input
              {...register("technologies")}
              placeholder="Technologies (comma-separated)"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              {...register("achievements")}
              placeholder="Achievements (one per line)"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
          </div>
        )

      case "education":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("institution", { required: "Institution is required" })}
              placeholder="Institution Name"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("degree", { required: "Degree is required" })}
              placeholder="Degree/Program"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("field")}
              placeholder="Field of Study"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("location")}
              placeholder="Location"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("gpa")}
              placeholder="GPA"
              type="number"
              step="0.01"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("maxGpa")}
              placeholder="Max GPA"
              type="number"
              step="0.01"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("startDate", { required: "Start date is required" })}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("endDate")}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              {...register("description")}
              placeholder="Description/Achievements"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
            <input
              {...register("coursework")}
              placeholder="Relevant Coursework (comma-separated)"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )

      case "skills":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("name", { required: "Skill name is required" })}
              placeholder="Skill Name"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              {...register("category")}
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Programming Languages">Programming Languages</option>
              <option value="Frameworks">Frameworks</option>
              <option value="Databases">Databases</option>
              <option value="Tools">Tools</option>
              <option value="Cloud">Cloud</option>
              <option value="Other">Other</option>
            </select>
            <select
              {...register("level")}
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <input
              {...register("yearsOfExperience")}
              placeholder="Years of Experience"
              type="number"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex items-center space-x-2">
              <input {...register("featured")} type="checkbox" className="rounded" />
              <label className="text-sm text-gray-700">Featured Skill</label>
            </div>
            <input
              {...register("icon")}
              placeholder="Icon URL or Class"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )

      case "projects":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Project Title"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
              <ImageInput
                register={register}
                name="image"
                placeholder="Project image URL or upload file"
                setValue={setValue}
              />
            </div>
            <textarea
              {...register("description", { required: "Description is required" })}
              placeholder="Project Description"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
            <input
              {...register("technologies")}
              placeholder="Technologies (comma-separated)"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex items-center space-x-2">
              <input {...register("featured")} type="checkbox" className="rounded" />
              <label className="text-sm text-gray-700">Featured Project</label>
            </div>
            <input
              {...register("liveUrl")}
              placeholder="Live Demo URL"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("githubUrl")}
              placeholder="GitHub URL"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("startDate")}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("endDate")}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )

      case "volunteer":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("organization", { required: "Organization is required" })}
              placeholder="Organization Name"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("position", { required: "Position is required" })}
              placeholder="Volunteer Position"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("location")}
              placeholder="Location"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("cause")}
              placeholder="Cause/Category"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("startDate", { required: "Start date is required" })}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("endDate")}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              {...register("description")}
              placeholder="Description of volunteer work"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
            <input
              {...register("hoursPerWeek")}
              placeholder="Hours per Week"
              type="number"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("website")}
              placeholder="Organization Website"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )

      case "publications":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Publication Title"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("journal")}
              placeholder="Journal/Conference"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("authors")}
              placeholder="Authors (comma-separated)"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("publishDate")}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("doi")}
              placeholder="DOI"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("url")}
              placeholder="Publication URL"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              {...register("abstract")}
              placeholder="Abstract"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
            />
            <input
              {...register("keywords")}
              placeholder="Keywords (comma-separated)"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              {...register("type")}
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Publication Type</option>
              <option value="Journal Article">Journal Article</option>
              <option value="Conference Paper">Conference Paper</option>
              <option value="Book Chapter">Book Chapter</option>
              <option value="Thesis">Thesis</option>
              <option value="Other">Other</option>
            </select>
          </div>
        )

      case "patents":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Patent Title"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("patentNumber")}
              placeholder="Patent Number"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("inventors")}
              placeholder="Inventors (comma-separated)"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("assignee")}
              placeholder="Assignee/Company"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("filingDate")}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("publicationDate")}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("grantDate")}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              {...register("status")}
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Patent Status</option>
              <option value="Filed">Filed</option>
              <option value="Published">Published</option>
              <option value="Granted">Granted</option>
              <option value="Expired">Expired</option>
            </select>
            <textarea
              {...register("abstract")}
              placeholder="Patent Abstract"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
            />
            <input
              {...register("url")}
              placeholder="Patent URL/Certificate"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("field")}
              placeholder="Technical Field"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )

      case "awards":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("title", { required: "Award title is required" })}
              placeholder="Award Title"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("issuer")}
              placeholder="Issuing Organization"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("date")}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("level")}
              placeholder="Level (e.g., National, Regional)"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              {...register("description")}
              placeholder="Award Description"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
            <input
              {...register("amount")}
              placeholder="Monetary Value (if applicable)"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("url")}
              placeholder="Award URL/Certificate"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )

      case "testscores":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("testName", { required: "Test name is required" })}
              placeholder="Test Name (e.g., GRE, TOEFL)"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("score")}
              placeholder="Score"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("maxScore")}
              placeholder="Maximum Score"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("percentile")}
              placeholder="Percentile"
              type="number"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("testDate")}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("validUntil")}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              {...register("breakdown")}
              placeholder="Score Breakdown (e.g., Verbal: 160, Quantitative: 170)"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="2"
            />
            <input
              {...register("certificateUrl")}
              placeholder="Certificate URL"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )

      case "languages":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("language", { required: "Language is required" })}
              placeholder="Language Name"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              {...register("proficiency")}
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Proficiency</option>
              <option value="Native">Native</option>
              <option value="Fluent">Fluent</option>
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Beginner">Beginner</option>
            </select>
            <select
              {...register("speaking")}
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Speaking Level</option>
              <option value="Native">Native</option>
              <option value="Fluent">Fluent</option>
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Beginner">Beginner</option>
            </select>
            <select
              {...register("writing")}
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Writing Level</option>
              <option value="Native">Native</option>
              <option value="Fluent">Fluent</option>
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Beginner">Beginner</option>
            </select>
            <select
              {...register("reading")}
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Reading Level</option>
              <option value="Native">Native</option>
              <option value="Fluent">Fluent</option>
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Beginner">Beginner</option>
            </select>
            <input
              {...register("certificateUrl")}
              placeholder="Certificate URL"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )

      case "certifications":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("name", { required: "Certification name is required" })}
              placeholder="Certification Name"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("issuer")}
              placeholder="Issuing Organization"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("issueDate")}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("expiryDate")}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("credentialId")}
              placeholder="Credential ID"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("credentialUrl")}
              placeholder="Credential URL"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              {...register("description")}
              placeholder="Certification Description"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
            <input
              {...register("skills")}
              placeholder="Skills Gained (comma-separated)"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )

      case "courses":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("title", { required: "Course title is required" })}
              placeholder="Course Title"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("provider")}
              placeholder="Course Provider"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("instructor")}
              placeholder="Instructor Name"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("completionDate")}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("duration")}
              placeholder="Duration (e.g., 40 hours)"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("certificateUrl")}
              placeholder="Certificate URL"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              {...register("description")}
              placeholder="Course Description"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
            <input
              {...register("skills")}
              placeholder="Skills Learned (comma-separated)"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("grade")}
              placeholder="Grade/Score"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Form for {sectionLabel} is not implemented yet.
            <br />
            This section can be managed through the API directly.
          </div>
        )
    }
  }

  const renderDataList = () => {
    if (loading) {
      return <div className="text-center py-4">Loading...</div>
    }

    if (data.length === 0) {
      return <div className="text-center py-8 text-gray-500">No {sectionLabel.toLowerCase()} data found.</div>
    }

    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item._id || index} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {sectionName === "hero" && (
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">{item.tagline}</p>
                  </div>
                )}
                {sectionName === "about" && (
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.content?.substring(0, 100)}...</p>
                  </div>
                )}
                {sectionName === "experience" && (
                  <div>
                    <h3 className="font-semibold">{item.position}</h3>
                    <p className="text-gray-600">{item.company}</p>
                  </div>
                )}
                {sectionName === "education" && (
                  <div>
                    <h3 className="font-semibold">{item.degree}</h3>
                    <p className="text-gray-600">{item.institution}</p>
                  </div>
                )}
                {sectionName === "skills" && (
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">
                      {item.category} - {item.level}
                    </p>
                  </div>
                )}
                {sectionName === "projects" && (
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.description?.substring(0, 100)}...</p>
                  </div>
                )}
                {sectionName === "volunteer" && (
                  <div>
                    <h3 className="font-semibold">{item.position}</h3>
                    <p className="text-gray-600">{item.organization}</p>
                  </div>
                )}
                {sectionName === "publications" && (
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.journal}</p>
                  </div>
                )}
                {sectionName === "patents" && (
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">
                      {item.patentNumber} - {item.status}
                    </p>
                  </div>
                )}
                {sectionName === "awards" && (
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.issuer}</p>
                  </div>
                )}
                {sectionName === "testscores" && (
                  <div>
                    <h3 className="font-semibold">{item.testName}</h3>
                    <p className="text-gray-600">
                      Score: {item.score}/{item.maxScore}
                    </p>
                  </div>
                )}
                {sectionName === "languages" && (
                  <div>
                    <h3 className="font-semibold">{item.language}</h3>
                    <p className="text-gray-600">{item.proficiency}</p>
                  </div>
                )}
                {sectionName === "certifications" && (
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">{item.issuer}</p>
                  </div>
                )}
                {sectionName === "courses" && (
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.provider}</p>
                  </div>
                )}
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
                {api.delete && (
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">{sectionLabel}</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingItem(null)
            reset()
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancel" : `Add ${sectionLabel}`}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-4">{editingItem ? `Edit ${sectionLabel}` : `Add ${sectionLabel}`}</h3>

          {renderForm()}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingItem(null)
                reset()
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {editingItem ? "Update" : "Create"}
            </button>
          </div>
        </form>
      )}

      {renderDataList()}
    </div>
  )
}

export default SectionManager
