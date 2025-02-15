"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const carouselData = [
  {
    title: "Professional Moving Services",
    description: "Expert relocation solutions for homes and businesses across India",
    image: "/images/moving-service-1.jpg",
    alt: "Professional movers carefully packing household items"
  },
  {
    title: "Secure Packing Solutions",
    description: "State-of-the-art packing materials and techniques for maximum protection",
    image: "/images/packing-service.jpg",
    alt: "Secure packaging materials and professional packing process"
  },
  {
    title: "Nationwide Coverage",
    description: "Seamless relocation services available across all major Indian cities",
    image: "/images/nationwide-service.jpg",
    alt: "Map showing nationwide moving service coverage"
  }
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden" aria-label="Hero Section">
      {/* Carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-full w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
            {/* Replace with your actual images */}
            <div className="h-full w-full bg-gradient-to-r from-purple-900 to-blue-900" />
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          {carouselData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index ? "w-8 bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 h-screen flex items-center">
        <div className="max-w-3xl">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-purple-400 font-semibold mb-4 block">
              Trusted by 10,000+ Customers
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              {carouselData[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              {carouselData[currentSlide].description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="gap-2 bg-purple-600 hover:bg-purple-700"
                onClick={() => window.location.href = 'tel:18002707001'}
              >
                <Phone className="w-5 h-5" />
                Get Free Quote 
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 border-white text-black hover:bg-white/70"
                onClick={() => window.location.href = '/services'}
              >
                Explore Services
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 mt-16">
              <div className="flex flex-col items-center sm:items-start">
                <div className="text-4xl font-bold text-white">15+</div>
                <div className="text-gray-300">Years of Excellence</div>
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <div className="text-4xl font-bold text-white">10k+</div>
                <div className="text-gray-300">Successful Moves</div>
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <div className="text-4xl font-bold text-white">100%</div>
                <div className="text-gray-300">Customer Satisfaction</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

