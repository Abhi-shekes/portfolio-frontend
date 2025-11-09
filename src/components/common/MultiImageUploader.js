"use client"

import { useState } from "react"
import "../../styles/MultiImageUploader.css"

const MultiImageUploader = ({ images = [], onChange, label = "Images" }) => {
  const [imageInput, setImageInput] = useState("")
  const [uploadType, setUploadType] = useState("url") // 'url' or 'file'

  // Handle adding image from URL
  const handleAddUrlImage = () => {
    if (imageInput.trim()) {
      onChange([...images, imageInput.trim()])
      setImageInput("")
    }
  }

  // Handle adding image from file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onChange([...images, reader.result])
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle removing an image
  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  return (
    <div className="multi-image-uploader">
      <label className="uploader-label">{label}</label>

      {/* Upload Type Toggle */}
      <div className="upload-type-toggle">
        <button
          type="button"
          className={`toggle-btn ${uploadType === "url" ? "active" : ""}`}
          onClick={() => setUploadType("url")}
        >
          URL
        </button>
        <button
          type="button"
          className={`toggle-btn ${uploadType === "file" ? "active" : ""}`}
          onClick={() => setUploadType("file")}
        >
          Upload File
        </button>
      </div>

      {/* URL Input */}
      {uploadType === "url" && (
        <div className="url-input-section">
          <input
            type="text"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="Enter image URL"
            className="image-url-input"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddUrlImage()
              }
            }}
          />
          <button type="button" onClick={handleAddUrlImage} className="add-image-btn">
            Add Image
          </button>
        </div>
      )}

      {/* File Upload */}
      {uploadType === "file" && (
        <div className="file-input-section">
          <input type="file" accept="image/*" onChange={handleFileUpload} className="file-input" id="file-upload" />
          <label htmlFor="file-upload" className="file-upload-label">
            Choose File
          </label>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="images-preview-grid">
          {images.map((image, index) => (
            <div key={index} className="image-preview-item">
              <img src={image || "/placeholder.svg"} alt={`Upload ${index + 1}`} />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="remove-image-btn"
                title="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && <p className="no-images-text">No images added yet</p>}
    </div>
  )
}

export default MultiImageUploader
