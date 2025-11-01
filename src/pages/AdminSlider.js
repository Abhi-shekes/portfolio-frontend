"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import ImageInput from "../components/admin/ImageInput"
import { sliderAPI } from "../services/api"
import AdminLayout from "../components/admin/AdminLayout"

const AdminSlider = () => {
  const [sliderImages, setSliderImages] = useState([])
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

  useEffect(() => {
    fetchSliderImages()
  }, [])

  const fetchSliderImages = async () => {
    try {
      setLoading(true)
      const response = await sliderAPI.getAll()
      // Handle the response structure correctly
      const sliderData = response.data || response
      setSliderImages(sliderData.images || [])
    } catch (error) {
      console.error("Error fetching slider images:", error)
      toast.error("Failed to fetch slider images")
      setSliderImages([])
    } finally {
      setLoading(false)
    }
  }

const onSubmit = async (formData) => {
  try {
    const imageData = {
      url: formData.image,
      title: formData.title,
      description: formData.description,
    }

    if (editingItem) {
      await sliderAPI.updateImage(editingItem._id, imageData)
      toast.success("Slider image updated successfully")
    } else {
      await sliderAPI.addImage(imageData)
      toast.success("Slider image added successfully")
    }

    await fetchSliderImages()
    setShowForm(false)
    setEditingItem(null)
    reset()
  } catch (error) {
    console.error("Error saving slider image:", error)
    toast.error(`Failed to save slider image: ${error.response?.data?.message || error.message}`)
  }
}

  const handleEdit = (item) => {
    setEditingItem(item)
    // Map the backend fields to form fields
    reset({
      title: item.title,
      image: item.url, // Map 'url' to 'image' field
      description: item.description,
      // featured and order fields would go here if supported
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slider image?")) return

    try {
      await sliderAPI.deleteImage(id)
      toast.success("Slider image deleted successfully")
      await fetchSliderImages()
    } catch (error) {
      console.error("Error deleting slider image:", error)
      toast.error("Failed to delete slider image")
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-black">Slider Management</h1>
          <p className="text-gray-400 mt-2">Manage background images for the hero section slider</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Slider Images</h2>
            <button
              onClick={() => {
                setShowForm(!showForm)
                setEditingItem(null)
                reset()
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {showForm ? "Cancel" : "Add Slider Image"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit(onSubmit)} className="mb-8 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium mb-4">{editingItem ? "Edit Slider Image" : "Add Slider Image"}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  {...register("title", { required: "Title is required" })}
                  placeholder="Image Title"
                  className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
                  <input
                    {...register("image", { required: "Image URL is required" })}
                    placeholder="Enter image URL"
                    className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {/* You can keep ImageInput if you have it, but make sure it sets the 'image' field */}
                  {/* <ImageInput
                    register={register}
                    name="image"
                    placeholder="Image URL or upload file"
                    setValue={setValue}
                  /> */}
                </div>
                <textarea
                  {...register("description")}
                  placeholder="Image Description (optional)"
                  className="border rounded px-3 py-2 md:col-span-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
                {/* Remove featured and order fields since they're not supported in current backend */}
                {/* <div className="flex items-center space-x-2">
                  <input {...register("featured")} type="checkbox" className="rounded" />
                  <label className="text-sm text-gray-700">Featured Slider</label>
                </div>
                <input
                  {...register("order", { valueAsNumber: true })}
                  placeholder="Display Order (1-10)"
                  type="number"
                  min="1"
                  max="10"
                  className="border rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                /> */}
              </div>

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

          {sliderImages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No slider images found. Add your first slider image!</p>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sliderImages.map((image) => (
                    <div key={image._id} className="relative group rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={image.url || "/placeholder.svg"} 
                        alt={image.title}
                        className="w-full h-48 object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                        <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="font-semibold">{image.title}</p>
                          {/* Remove featured display since it's not supported */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Images</h3>
                <div className="space-y-4">
                  {sliderImages.map((image) => (
                    <div key={image._id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{image.title}</h4>
                          <p className="text-gray-600 text-sm">{image.description}</p>
                          <div className="flex gap-2 mt-2">
                            {/* Remove featured badge since it's not supported */}
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              Order: {image.order || "-"}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(image)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(image._id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminSlider