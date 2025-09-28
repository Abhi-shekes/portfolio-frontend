

import { useState } from "react"

const EnhancedImage = ({ src, alt, className = "", fallback = "/placeholder.svg", onError, ...props }) => {
  const [imageSrc, setImageSrc] = useState(src || fallback)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
    setImageSrc(fallback)
    if (onError) {
      onError()
    }
  }

  // Check if the src is a Base64 string
  const isBase64 = src && src.startsWith("data:image/")

  // For Base64 images, we don't need to validate the URL
  const shouldRender = src && (isBase64 || src.trim() !== "")

  if (!shouldRender) {
    return <img src={fallback || "/placeholder.svg"} alt={alt} className={className} {...props} />
  }

  return (
    <div className="relative">
      {isLoading && !isBase64 && <div className={`absolute inset-0 bg-gray-200 animate-pulse rounded ${className}`} />}

      <img
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        className={`${className} ${isLoading && !isBase64 ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />

      {hasError && !isBase64 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <div className="text-center text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs">Image not found</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedImage
