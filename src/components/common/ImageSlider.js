"use client"

import { useState, useEffect } from "react"

const ImageSlider = ({ images = [], autoRotate = true, rotationInterval = 5000, opacity = 0.7, blurAmount = "4px" }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoRotate || images.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, rotationInterval)

    return () => clearInterval(interval)
  }, [autoRotate, rotationInterval, images.length])

  if (!images || images.length === 0) {
    return null
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Slider Container */}
      <div className="relative w-full h-full">
        {/* Slides */}
        {images.map((image, index) => {
          const imageUrl = image.url || image.imageUrl || image.src
          
          return (
            <div
              key={image._id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{ 
                opacity: index === currentIndex ? opacity : 0,
                zIndex: index === currentIndex ? 10 : 1 
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={image.title || `Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{
                    filter: `blur(${blurAmount})`,
                  }}
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?text=Image+Failed+to+Load"
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-white">No image URL provided</span>
                </div>
              )
              }
              
            
            </div>
          )
        })}

        {/* Rest of the component remains the same */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageSlider