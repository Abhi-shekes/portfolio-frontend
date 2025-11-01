import { useState, useRef, useEffect } from "react"
import toast from "react-hot-toast"

const ImageInput = ({
  register,
  name,
  placeholder = "Image URL or upload file",
  value = "",
  onChange,
  className = "",
  setValue,
}) => {
  const [preview, setPreview] = useState(value)
  const [inputType, setInputType] = useState(value && value.startsWith("data:") ? "file" : "url")
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (value !== preview) {
      setPreview(value)
    }
  }, [value])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target.result
        setPreview(base64)

        if (setValue) {
          setValue(name, base64)
        }
        if (onChange) {
          onChange(base64)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlChange = (event) => {
    const url = event.target.value
    setPreview(url)

    if (setValue) {
      setValue(name, url)
    }
    if (onChange) {
      onChange(url)
    }
  }

  const clearImage = () => {
    setPreview("")

    if (setValue) {
      setValue(name, "")
    }
    if (onChange) {
      onChange("")
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Input Type Toggle */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setInputType("url")}
          className={`px-3 py-1 text-sm rounded ${
            inputType === "url" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          URL
        </button>
        <button
          type="button"
          onClick={() => setInputType("file")}
          className={`px-3 py-1 text-sm rounded ${
            inputType === "file" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Upload
        </button>
      </div>

      {/* Input Field */}
      {inputType === "url" ? (
        <input
          {...register(name)}
          type="url"
          placeholder={placeholder}
          onChange={handleUrlChange}
          value={preview}
          className="border rounded px-3 py-2 w-full text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      ) : (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border rounded px-3 py-2 w-full text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <input {...register(name)} type="hidden" value={preview} />
        </>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border"
            onError={() => {
              setPreview("")
              toast.error("Failed to load image")
            }}
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageInput
