"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import MDEditor from "@uiw/react-md-editor"
import ImageInput from "./ImageInput"
import MultiImageUploader from "../common/MultiImageUploader"
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
  talksAPI,
  internshipsAPI,
  workshopsAPI,
  trainingsAPI,
  appreciationsAPI,
  journalPapersAPI,
  researchPapersAPI,
  conferencePapersAPI,
  bookChaptersAPI,
  galleryAPI,
} from "../../services/api"

const SectionManager = ({ sectionName, sectionLabel }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [images, setImages] = useState([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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
    talks: talksAPI,
    internships: internshipsAPI,
    workshops: workshopsAPI,
    trainings: trainingsAPI,
    appreciations: appreciationsAPI,
    journalpapers: journalPapersAPI,
    researchpapers: researchPapersAPI,
    conferencepapers: conferencePapersAPI,
    bookchapters: bookChaptersAPI,
    gallery: galleryAPI,
  }

  const api = apiMap[sectionName]

  useEffect(() => {
    fetchData()
  }, [sectionName])

  const fetchData = async () => {
    try {
      const response =
        sectionName === "hero" || sectionName === "about"
          ? await api.get()
          : api.getAll
            ? await api.getAll()
            : await api.get()

      const responseData = response.data

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
      const sectionsWithImages = [
        "volunteer",
        "education",
        "talks",
        "internships",
        "workshops",
        "trainings",
        "appreciations",
        "awards",
        "journalpapers",
        "publications",
        "researchpapers",
        "conferencepapers",
        "bookchapters",
        "patents",
        "testscores",
        "certifications",
        "courses",
      ]

      // Check if the current section handles images and if there are images to upload
      if (sectionsWithImages.includes(sectionName) && images.length > 0) {
        // Attach images to the form data if they exist
        formData.images = images
      }

      if (sectionName === "hero" || sectionName === "about") {
        await api.update(formData)
        toast.success(`${sectionLabel} updated successfully`)
      } else if (editingItem) {
        // Update existing item
        if (api.update) {
          await api.update(editingItem._id, formData)
        } else {
          // Fallback if update method expects only data
          await api.update(formData)
        }
        toast.success(`${sectionLabel} updated successfully`)
      } else {
        // Create new item
        if (api.create) {
          await api.create(formData)
        } else {
          // Fallback if create method is not defined, assume update is used for creation too
          await api.update(formData)
        }
        toast.success(`${sectionLabel} created successfully`)
      }

      await fetchData()
      setShowForm(false)
      setEditingItem(null)
      reset()
      setImages([])
    } catch (error) {
      console.error("[v0] Form submission error:", error)
      toast.error(`Failed to save ${sectionLabel.toLowerCase()}: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    reset(item)
    setShowForm(true)
    if (item.images && Array.isArray(item.images)) {
      setImages(item.images)
    } else {
      setImages([])
    }
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

  // Custom MarkdownEditor component that integrates with react-hook-form
  const MarkdownEditor = ({ name, value, onChange, placeholder, error, height = 200 }) => {
    return (
      <div className="w-full" data-color-mode="light">
        <MDEditor
          value={value}
          onChange={onChange}
          preview="edit"
          hideToolbar={false}
          height={height}
          placeholder={placeholder}
          className={`rounded-md border ${error ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>
    )
  }

  // Helper function to register Markdown fields with react-hook-form
  const registerMarkdownField = (name, options = {}) => {
    const fieldValue = watch(name)
    return {
      value: fieldValue || "",
      onChange: (value) => {
        setValue(name, value, { shouldValidate: true })
      },
      error: errors[name],
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <MarkdownEditor {...registerMarkdownField("description")} placeholder="Professional description" />
            </div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
              <MarkdownEditor
                {...registerMarkdownField("content", { required: "Content is required" })}
                placeholder="About content (supports Markdown)"
                height={300}
              />
            </div>
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
              <MarkdownEditor
                {...registerMarkdownField("description")}
                placeholder="Job description and responsibilities (supports Markdown)"
                height={200}
              />
            </div>
            <input
              {...register("technologies")}
              placeholder="Technologies (comma-separated)"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
              <MarkdownEditor
                {...registerMarkdownField("achievements")}
                placeholder="Key achievements (one per line, supports Markdown)"
                height={150}
              />
            </div>
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description/Achievements</label>
              <MarkdownEditor
                {...registerMarkdownField("description")}
                placeholder="Description and achievements (supports Markdown)"
                height={150}
              />
            </div>
            <input
              {...register("coursework")}
              placeholder="Relevant Coursework (comma-separated)"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <MultiImageUploader
                images={images}
                onChange={setImages}
                label="Education Images (certificates, transcripts, etc.)"
              />
            </div>
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
              <MarkdownEditor
                {...registerMarkdownField("description", { required: "Description is required" })}
                placeholder="Project description, features, and technologies used (supports Markdown)"
                height={250}
              />
            </div>
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
              {...register("role", { required: "Role is required" })}
              placeholder="Volunteer Role"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("location")}
              placeholder="Location"
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
            <div className="flex items-center space-x-2">
              <input {...register("current")} type="checkbox" className="rounded" />
              <label className="text-sm text-gray-700">Currently Volunteering</label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description of volunteer work</label>
              <MarkdownEditor
                {...registerMarkdownField("description")}
                placeholder="Description of volunteer work and impact (supports Markdown)"
                height={150}
              />
            </div>
            <div className="md:col-span-2">
              <MultiImageUploader
                images={images}
                onChange={setImages}
                label="Volunteer Images (photos, certificates, etc.)"
              />
            </div>
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Abstract</label>
              <MarkdownEditor
                {...registerMarkdownField("abstract")}
                placeholder="Publication abstract (supports Markdown)"
                height={200}
              />
            </div>
            <div className="md:col-span-2">
              <MultiImageUploader
                images={images}
                onChange={setImages}
                label="Publication Images (cover page, figures, etc.)"
              />
            </div>
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
              {...register("patentNumber", { required: "Patent number is required" })}
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
              placeholder="Filing Date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("grantDate")}
              type="date"
              placeholder="Grant Date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              {...register("status")}
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Status</option>
              <option value="Filed">Filed</option>
              <option value="Pending">Pending</option>
              <option value="Granted">Granted</option>
              <option value="Expired">Expired</option>
            </select>
            <input
              {...register("url")}
              placeholder="Patent URL"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <MarkdownEditor
                {...registerMarkdownField("description")}
                placeholder="Patent description (supports Markdown)"
                height={150}
              />
            </div>
            <div className="md:col-span-2">
              <MultiImageUploader
                images={images}
                onChange={setImages}
                label="Patent Images (certificate, diagrams, etc.)"
              />
            </div>
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
              {...register("issuer", { required: "Issuer is required" })}
              placeholder="Issuing Organization"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("date", { required: "Date is required" })}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("url")}
              placeholder="Award URL"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Award Description</label>
              <MarkdownEditor
                {...registerMarkdownField("description")}
                placeholder="Award description and significance (supports Markdown)"
                height={150}
              />
            </div>
            <div className="md:col-span-2">
              <MultiImageUploader
                images={images}
                onChange={setImages}
                label="Award Images (certificate, trophy, ceremony photos, etc.)"
              />
            </div>
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
              {...register("score", { required: "Score is required" })}
              placeholder="Score"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("maxScore")}
              placeholder="Maximum Score"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("date", { required: "Date is required" })}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <MarkdownEditor
                {...registerMarkdownField("description")}
                placeholder="Test score details (supports Markdown)"
                height={100}
              />
            </div>
            <div className="md:col-span-2">
              <MultiImageUploader
                images={images}
                onChange={setImages}
                label="Test Score Images (score report, certificate, etc.)"
              />
            </div>
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
              {...register("issuer", { required: "Issuer is required" })}
              placeholder="Issuing Organization"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("issueDate", { required: "Issue date is required" })}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("expiryDate")}
              type="date"
              placeholder="Expiry Date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("credentialId")}
              placeholder="Credential ID"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("url")}
              placeholder="Credential URL"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Certification Description</label>
              <MarkdownEditor
                {...registerMarkdownField("description")}
                placeholder="Certification description and learning outcomes (supports Markdown)"
                height={150}
              />
            </div>
            <div className="md:col-span-2">
              <MultiImageUploader
                images={images}
                onChange={setImages}
                label="Certification Images (certificate, badge, etc.)"
              />
            </div>
          </div>
        )

      case "courses":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("name", { required: "Course name is required" })}
              placeholder="Course Name"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("provider", { required: "Provider is required" })}
              placeholder="Course Provider"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("completionDate", { required: "Completion date is required" })}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("certificateUrl")}
              placeholder="Certificate URL"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Description</label>
              <MarkdownEditor
                {...registerMarkdownField("description")}
                placeholder="Course description and curriculum (supports Markdown)"
                height={150}
              />
            </div>
            <input
              {...register("skills")}
              placeholder="Skills Learned (comma-separated)"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <MultiImageUploader
                images={images}
                onChange={setImages}
                label="Course Images (certificate, materials, etc.)"
              />
            </div>
          </div>
        )

      case "talks":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Talk Title"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("event", { required: "Event is required" })}
              placeholder="Event Name"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("date", { required: "Date is required" })}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("location")}
              placeholder="Location"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Talk Description</label>
              <MarkdownEditor
                {...registerMarkdownField("description")}
                placeholder="Talk description and key points (supports Markdown)"
                height={150}
              />
            </div>
            <input
              {...register("url")}
              placeholder="Talk Link/Recording URL"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <MultiImageUploader
                images={images}
                onChange={setImages}
                label="Talk Images (slides, photos, posters, etc.)"
              />
            </div>
          </div>
        )

      case "internships":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Internship Title"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("company", { required: "Company is required" })}
              placeholder="Company Name"
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
            <input
              {...register("location")}
              placeholder="Location"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Internship Description</label>
              <MarkdownEditor
                {...registerMarkdownField("description")}
                placeholder="Internship description and responsibilities (supports Markdown)"
                height={150}
              />
            </div>
            <input
              {...register("skills")}
              placeholder="Skills Gained (comma-separated)"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <MultiImageUploader
                images={images}
                onChange={setImages}
                label="Internship Images (certificate, work samples, team photos, etc.)"
              />
            </div>
          </div>
        )

      case "workshops":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Workshop Title"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              {...register("type", { required: "Type is required" })}
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Type</option>
              <option value="attended">Attended</option>
              <option value="conducted">Conducted</option>
            </select>
            <input
              {...register("organizer", { required: "Organizer is required" })}
              placeholder="Organizer Name"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("date", { required: "Date is required" })}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("location")}
              placeholder="Location"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("duration")}
              placeholder="Duration (e.g., 2 days)"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Workshop Description</label>
              <MarkdownEditor
                {...registerMarkdownField("description")}
                placeholder="Workshop description and agenda (supports Markdown)"
                height={150}
              />
            </div>
            <input
              {...register("certificate")}
              placeholder="Certificate URL"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <MultiImageUploader
                images={images}
                onChange={setImages}
                label="Workshop Images (certificate, photos, materials, etc.)"
              />
            </div>
          </div>
        )

      case "trainings":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Training Title"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("provider", { required: "Provider is required" })}
              placeholder="Training Provider"
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
            <input
              {...register("duration")}
              placeholder="Duration (e.g., 40 hours)"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Training Description</label>
              <MarkdownEditor
                {...registerMarkdownField("description")}
                placeholder="Training description and curriculum (supports Markdown)"
                height={150}
              />
            </div>
            <input
              {...register("certificate")}
              placeholder="Certificate URL"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("skills")}
              placeholder="Skills Learned (comma-separated)"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <MultiImageUploader
                images={images}
                onChange={setImages}
                label="Training Images (certificate, materials, etc.)"
              />
            </div>
          </div>
        )

      case "appreciations":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Appreciation/Award Title"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("awardedBy", { required: "Awarded by is required" })}
              placeholder="Awarded By"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("date", { required: "Date is required" })}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("category")}
              placeholder="Category"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <MarkdownEditor
                {...registerMarkdownField("description")}
                placeholder="Appreciation description and context (supports Markdown)"
                height={150}
              />
            </div>
            <input
              {...register("certificate")}
              placeholder="Certificate URL"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <MultiImageUploader
                images={images}
                onChange={setImages}
                label="Appreciation Images (certificate, award, ceremony photos, etc.)"
              />
            </div>
          </div>
        )

      case "journalpapers":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Paper Title"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("journal", { required: "Journal is required" })}
              placeholder="Journal Name"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("authors")}
              placeholder="Authors (comma-separated)"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("publishDate", { required: "Publish date is required" })}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("volume")}
              placeholder="Volume"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("issue")}
              placeholder="Issue"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("pages")}
              placeholder="Pages"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("doi")}
              placeholder="DOI"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("url")}
              placeholder="Paper URL"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Abstract</label>
              <MarkdownEditor
                {...registerMarkdownField("abstract")}
                placeholder="Paper abstract (supports Markdown)"
                height={200}
              />
            </div>
            <input
              {...register("pdf")}
              placeholder="PDF URL"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <MultiImageUploader
                images={images}
                onChange={setImages}
                label="Journal Paper Images (cover, figures, graphs, etc.)"
              />
            </div>
          </div>
        )

      case "researchpapers":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Research Paper Title"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("authors")}
              placeholder="Authors (comma-separated)"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("publishDate", { required: "Publish date is required" })}
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
              placeholder="Paper URL"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description/Abstract</label>
              <MarkdownEditor
                {...registerMarkdownField("description")}
                placeholder="Research paper description and findings (supports Markdown)"
                height={200}
              />
            </div>
            <input
              {...register("pdf")}
              placeholder="PDF URL"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("keywords")}
              placeholder="Keywords (comma-separated)"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <MultiImageUploader
                images={images}
                onChange={setImages}
                label="Research Paper Images (figures, charts, diagrams, etc.)"
              />
            </div>
          </div>
        )

      case "conferencepapers":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Conference Paper Title"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("conference", { required: "Conference is required" })}
              placeholder="Conference Name"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("authors")}
              placeholder="Authors (comma-separated)"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("conferenceDate", { required: "Conference date is required" })}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("location")}
              placeholder="Conference Location"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("doi")}
              placeholder="DOI"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("url")}
              placeholder="Paper URL"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Abstract</label>
              <MarkdownEditor
                {...registerMarkdownField("abstract")}
                placeholder="Conference paper abstract (supports Markdown)"
                height={200}
              />
            </div>
            <input
              {...register("pdf")}
              placeholder="PDF URL"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("proceedings")}
              placeholder="Proceedings"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <MultiImageUploader
                images={images}
                onChange={setImages}
                label="Conference Paper Images (presentation slides, poster, photos, etc.)"
              />
            </div>
          </div>
        )

      case "bookchapters":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Chapter Title"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("bookTitle", { required: "Book title is required" })}
              placeholder="Book Title"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("authors")}
              placeholder="Authors (comma-separated)"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("publisher", { required: "Publisher is required" })}
              placeholder="Publisher"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("chapterNumber")}
              placeholder="Chapter Number"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("pages")}
              placeholder="Pages"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("publishDate", { required: "Publish date is required" })}
              type="date"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("isbn")}
              placeholder="ISBN"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("url")}
              placeholder="URL"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Abstract/Description</label>
              <MarkdownEditor
                {...registerMarkdownField("abstract")}
                placeholder="Book chapter description and content (supports Markdown)"
                height={200}
              />
            </div>
            <input
              {...register("pdf")}
              placeholder="PDF URL"
              className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="md:col-span-2">
              <MultiImageUploader
                images={images}
                onChange={setImages}
                label="Book Chapter Images (cover, diagrams, illustrations, etc.)"
              />
            </div>
          </div>
        )

      case "gallery":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Image Title"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              {...register("category")}
              placeholder="Category"
              className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {/* Using MultiImageUploader for gallery images */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
              <MultiImageUploader
                images={images}
                setImages={setImages}
                register={register}
                setValue={setValue}
                name="images"
                placeholder="Upload images for the gallery"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Description</label>
              <MarkdownEditor
                {...registerMarkdownField("description")}
                placeholder="Image description and context (supports Markdown)"
                height={150}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input {...register("featured")} type="checkbox" className="rounded" />
              <label className="text-sm text-gray-700">Featured Image</label>
            </div>
          </div>
        )

      default:
        return <div>No form available for this section</div>
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
                    <h3 className="font-semibold">{item.category}</h3>
                    <p className="text-gray-600">{item.skills?.length || 0} skills</p>
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
                    <h3 className="font-semibold">{item.role}</h3>
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
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">{item.provider}</p>
                  </div>
                )}
                {sectionName === "talks" && (
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.event}</p>
                  </div>
                )}
                {sectionName === "internships" && (
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.company}</p>
                  </div>
                )}
                {sectionName === "workshops" && (
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">
                      {item.type} - {item.location}
                    </p>
                  </div>
                )}
                {sectionName === "trainings" && (
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.provider}</p>
                  </div>
                )}
                {sectionName === "appreciations" && (
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.awardedBy}</p>
                  </div>
                )}
                {sectionName === "journalpapers" && (
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.journal}</p>
                  </div>
                )}
                {sectionName === "researchpapers" && (
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">
                      {Array.isArray(item.authors)
                        ? item.authors.join(", ").substring(0, 50)
                        : item.authors?.substring(0, 50)}
                      ...
                    </p>
                  </div>
                )}
                {sectionName === "conferencepapers" && (
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.conference}</p>
                  </div>
                )}
                {sectionName === "bookchapters" && (
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.bookTitle}</p>
                  </div>
                )}
                {sectionName === "gallery" && (
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.category}</p>
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
            setImages([]) // Clear images when cancelling form
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
                setImages([]) // Clear images when cancelling form
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
