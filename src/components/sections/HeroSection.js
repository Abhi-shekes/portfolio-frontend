"use client"

import { useState, useEffect } from "react"
import { heroAPI, sliderAPI } from "../../services/api"
import EnhancedImage from "../common/EnhancedImage"
import ImageSlider from "../common/ImageSlider"
import remarkGfm from "remark-gfm"
import ReactMarkdown from "react-markdown"

const HeroSection = () => {
  const [heroData, setHeroData] = useState(null)
  const [sliderData, setSliderData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hero data
        const heroResponse = await heroAPI.get()
        setHeroData(heroResponse.data)

        // Fetch slider data using the API
        const sliderResponse = await sliderAPI.getAll()
        
        // Handle different response structures
        const sliderJson = sliderResponse.data || sliderResponse
        
        // Check if slider is enabled and has images
        const hasImages = sliderJson.images && Array.isArray(sliderJson.images) && sliderJson.images.length > 0       
        
        const isEnabled = true

        if (isEnabled && hasImages) {
          setSliderData(sliderJson)
        } else {
          
          setSliderData(null)
        }
      } catch (error) {
        setSliderData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <section id="hero" className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
      </section>
    )
  }

  if (!heroData) {
    return (
      <section id="hero" className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <h1 className="text-4xl mb-4">Hero data not found</h1>
          <p>Please configure your hero section in the admin panel.</p>
        </div>
      </section>
    )
  }

  

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900"
    >
      {/* Background Slider */}
      {sliderData && sliderData.images && sliderData.images.length > 0 && (
        <ImageSlider 
          images={sliderData.images} 
          autoRotate={true} 
          rotationInterval={5000} 
          opacity={0.6} 
        />
      )}

      {/* Fallback background if no slider */}
      {(!sliderData || !sliderData.images || sliderData.images.length === 0) && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900"
          style={{ opacity: 0.6 }}
        ></div>
      )}

      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`,
          }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20 relative z-10">
        <div className="text-center fade-in">
          {heroData.profileImage && (
            <div className="mb-12 scale-in">
              <img
                src={heroData.profileImage}
                alt={heroData.name}
                
                className="w-40 h-40 rounded-full mx-auto object-cover shadow-2xl ring-4 ring-white/10"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?text=Profile+Image"
                }}
              />
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance text-white">
            {heroData.name}
          </h1>

{/* 
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance text-white">
            {heroData.name}
          </h1> */}

          <p className="text-2xl md:text-3xl text-gray-300 mb-8 font-light tracking-wide">
            {heroData.tagline}
          </p>

  

            {heroData.description && (
    <div className="text-lg md:text-xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed prose prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {heroData.description}
      </ReactMarkdown>
    </div>
  )}

        </div> 
      </div>
    </section>
  )
}

export default HeroSection