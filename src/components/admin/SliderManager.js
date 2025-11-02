"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { sliderAPI } from "../../services/api"
import ImageInput from "./ImageInput" // Make sure this path is correct

const SliderManager = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEnabled, setIsEnabled] = useState(false)
  const { register, handleSubmit, reset, setValue, watch } = useForm()

  const imageUrlValue = watch("imageUrl")

  useEffect(() => {
    fetchSliderData()
  }, [])

  const fetchSliderData = async () => {
    try {
      const response = await sliderAPI.getAll()
      const sliderData = response.data || response
      setImages(sliderData.images || [])
      setIsEnabled(sliderData.isEnabled || false)
    } catch (error) {
      toast.error("Failed to fetch slider data")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      const response = await sliderAPI.addImage({
        url: data.imageUrl,
        title: data.imageTitle,
        description: data.imageDescription,
      })

      const updatedData = response.data || response
      setImages(updatedData.images || [])
      reset()
      toast.success("Image added successfully")
    } catch (error) {
      toast.error("Failed to add image")
    }
  }

  const deleteImage = async (imageId) => {
    try {
      const response = await sliderAPI.deleteImage(imageId)
      const updatedData = response.data || response
      setImages(updatedData.images || [])
      toast.success("Image deleted successfully")
    } catch (error) {
      toast.error("Failed to delete image")
    }
  }

  const toggleSlider = async () => {
    try {
      const response = await sliderAPI.toggle()
      const updatedData = response.data || response
      setIsEnabled(updatedData.isEnabled)
      toast.success(updatedData.isEnabled ? "Slider enabled" : "Slider disabled")
    } catch (error) {
      console.error("Error toggling slider:", error)
      toast.error("Failed to toggle slider")
    }
  }

  const handleImageSelect = (imageUrl) => {
    setValue("imageUrl", imageUrl)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Toggle Section */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Slider Status</h3>
            <p className="text-gray-400">
              {isEnabled ? "Slider is currently enabled and visible on homepage" : "Slider is currently disabled and hidden"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {images.length} image(s) in slider
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isEnabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
            }`}>
              {isEnabled ? "Enabled" : "Disabled"}
            </span>
            <button
              onClick={toggleSlider}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                isEnabled 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isEnabled ? "Disable Slider" : "Enable Slider"}
            </button>
          </div>
        </div>
      </div>

      {/* Add Image Form */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Add New Image</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-300 font-medium mb-2">Image (URL or Upload)</label>
            <ImageInput
              register={register}
              name="imageUrl"
              placeholder="Enter image URL or upload below"
              setValue={setValue}
              value={imageUrlValue}
              onChange={handleImageSelect}
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">Image Title (Optional)</label>
            <input
              type="text"
              {...register("imageTitle")}
              placeholder="Enter image title"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">Image Description (Optional)</label>
            <textarea
              {...register("imageDescription")}
              placeholder="Enter image description"
              rows="3"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={!imageUrlValue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Image to Slider
          </button>
        </form>
      </div>

      {/* Images List */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6">
          Current Slider Images ({images.length})
          {!isEnabled && (
            <span className="ml-2 text-sm text-yellow-400">(Slider is disabled - images not visible)</span>
          )}
        </h3>
        
        {images.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No images in the slider yet. Add some images to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div key={image._id || index} className="relative group bg-white/5 rounded-lg overflow-hidden border border-white/10">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.title || "Slider image"}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {image.url.startsWith('data:image/') ? 'Uploaded' : 'URL'}
                  </div>
                </div>
                
                <div className="p-4">
                  {image.title && (
                    <h4 className="text-white font-medium mb-1">{image.title}</h4>
                  )}
                  {image.description && (
                    <p className="text-gray-400 text-sm mb-3">{image.description}</p>
                  )}
                  
                  <button
                    onClick={() => deleteImage(image._id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-all text-sm"
                  >
                    Delete Image
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SliderManager