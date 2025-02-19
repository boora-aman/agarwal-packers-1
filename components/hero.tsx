"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, MapPin, ChevronLeft, ChevronRight, Shield, Clock, Star, Trophy, BadgeCheck, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const carouselData = [
  {
    title: "Premium Moving Services",
    subtitle: "Nationwide & International",
    description: "Experience hassle-free relocation with India's most trusted moving partner. Professional packing, secure transportation, and dedicated support throughout your journey.",
    highlights: [
      "Free video surveys",
      "Custom crating solutions",
      "Real-time tracking",
      "Express delivery options"
    ],
    ctaText: "Get Free Quote",
    image: "/images/moving-service-1.jpg",
    alt: "Professional movers carefully packing household items"
  },
  {
    title: "Secure Packing Solutions",
    subtitle: "Industry-Leading Standards",
    description: "State-of-the-art packing materials and techniques ensure maximum protection for your valuables. Our certified packers handle everything with precision and care.",
    highlights: [
      "High-grade materials",
      "Specialized item handling",
      "Climate-controlled storage",
      "Insurance coverage"
    ],
    ctaText: "View Packing Services",
    image: "/images/packing-service.jpg",
    alt: "Secure packaging materials and professional packing process"
  },
  {
    title: "Global Relocation Experts",
    subtitle: "Local to International",
    description: "Seamless moving services across 500+ cities worldwide. Whether you're moving across the street or across continents, we've got you covered.",
    highlights: [
      "Door-to-door service",
      "Customs clearance",
      "International insurance",
      "Storage solutions"
    ],
    ctaText: "Plan Your Move",
    image: "/images/nationwide-service.jpg",
    alt: "Map showing nationwide moving service coverage"
  }
]

const achievements = [
  {
    icon: Trophy,
    number: "15+",
    label: "Years of Excellence",
    description: "Trusted since 2008"
  },
  {
    icon: Users,
    number: "10k+",
    label: "Happy Customers",
    description: "And counting"
  },
  {
    icon: MapPin,
    number: "500+",
    label: "Cities Covered",
    description: "Nationwide network"
  },
  {
    icon: Star,
    number: "4.9",
    label: "Customer Rating",
    description: "Based on 5000+ reviews"
  }
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)

  useEffect(() => {
    if (!isAutoplay) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isAutoplay])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length)
    setIsAutoplay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length)
    setIsAutoplay(false)
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-r from-gray-900 to-blue-900" aria-label="Hero Section">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7 }}
            className="h-full w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60" />
            <div className="h-full w-full bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-4 relative z-10 min-h-screen flex items-center">
        <div className="max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Trust Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 pt-24 py-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <BadgeCheck className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium">Hassle Free Relocation</span>
              </motion.div>

              {/* Main Content */}
              <div className="space-y-4">
                <h2 className="text-lg text-purple-400 font-semibold">
                  {carouselData[currentSlide].subtitle}
                </h2>
                <h1 className="text-5xl md:text-7xl font-bold text-white">
                  {carouselData[currentSlide].title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-200">
                  {carouselData[currentSlide].description}
                </p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-4 py-6">
                {carouselData[currentSlide].highlights.map((highlight, index) => (
                  <motion.div
                    key={highlight}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 * index }}
                    className="flex items-center gap-2"
                  >
                    <Shield className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-200">{highlight}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="gap-2 bg-purple-600 hover:bg-purple-700"
                  onClick={() => window.location.href = 'tel:18002707001'}
                >
                  <Phone className="w-5 h-5" />
                  {carouselData[currentSlide].ctaText}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 border-white text-black hover:bg-white hover:text-purple-600 transition-colors"
                  onClick={() => window.location.href = '/contact'}
                >
                  Schedule Consultation
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Achievements */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex flex-col items-center sm:items-start"
                  >
                    <achievement.icon className="w-6 h-6 text-purple-400 mb-2" />
                    <div className="text-4xl font-bold text-white">{achievement.number}</div>
                    <div className="text-gray-300 font-medium">{achievement.label}</div>
                    <div className="text-sm text-gray-400">{achievement.description}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-8 left-0 w-full z-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {carouselData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index)
                    setIsAutoplay(false)
                  }}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="rounded-full border-white/20 text-white hover:bg-white hover:text-black"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="rounded-full border-white/20 text-white hover:bg-white hover:text-black"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}