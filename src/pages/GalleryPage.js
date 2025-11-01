"use client"

import { useState, useEffect } from "react"
import Navigation from "../components/Navigation"
import { api } from "../services/api"
import toast from "react-hot-toast"
import "../styles/GalleryPage.css"

export default function GalleryPage() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      setLoading(true)
      const response = await api.get("/gallery")
      setImages(response.data || [])
    } catch (error) {
      console.error("Error fetching gallery:", error)
      toast.error("Failed to load gallery")
    } finally {
      setLoading(false)
    }
  }

  const categories = ["all", ...new Set(images.map((img) => img.category).filter(Boolean))]
  const filteredImages = selectedCategory === "all" ? images : images.filter((img) => img.category === selectedCategory)

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="loading">Loading gallery...</div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="gallery-page">
        <div className="page-header">
          <h1>Gallery</h1>
          <p>A collection of moments and memories</p>
        </div>

        {categories.length > 1 && (
          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}

        {filteredImages.length === 0 ? (
          <p className="no-data">No images in gallery yet</p>
        ) : (
          <div className="gallery-grid">
            {filteredImages.map((image) => (
              <div key={image._id} className="gallery-item" onClick={() => setSelectedImage(image)}>
                <img src={image.image || "/placeholder.svg"} alt={image.title} />
                <div className="overlay">
                  <h3>{image.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedImage && (
          <div className="modal" onClick={() => setSelectedImage(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedImage(null)}>
                ×
              </button>
              <img src={selectedImage.image || "/placeholder.svg"} alt={selectedImage.title} />
              <div className="modal-info">
                <h2>{selectedImage.title}</h2>
                {selectedImage.description && <p>{selectedImage.description}</p>}
                {selectedImage.category && <p className="category">{selectedImage.category}</p>}
                {selectedImage.date && <p className="date">{new Date(selectedImage.date).toLocaleDateString()}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
