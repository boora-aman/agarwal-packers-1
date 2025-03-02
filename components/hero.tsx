"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, MapPin, CheckCircle, Shield, Clock, Star, ChevronDown, Truck, Package, Globe, Building2, ClipboardCheck, Warehouse } from "lucide-react"
import { motion } from "framer-motion"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'Residential' | 'Commercial' | 'Warehouse'>('Residential')
  const heroRef = useRef(null)
  
  useEffect(() => {
    setIsVisible(true)
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    
    if (heroRef.current) {
      observer.observe(heroRef.current)
    }
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current)
      }
    }
  }, [])

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  }

  return (
    <section ref={heroRef} className="relative bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-purple-400 blur-3xl" />
          <div className="absolute top-40 right-20 w-96 h-96 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-indigo-400 blur-3xl" />
        </div>
      </div>
      
      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[85vh]">
          
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              custom={0}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full px-4 py-2 border border-purple-500/20"
            >
              <Star className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 font-medium text-sm">Tension Free Shifting</span>
            </motion.div>
            
            {/* Main Heading */}
            <motion.div 
              custom={1}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeUp}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Seamless</span> Moving Experience
              </h1>
              <p className="text-xl text-gray-300 max-w-xl">
                Transform your relocation with our premium packing, transport, and setup services designed for stress-free transitions.
              </p>
            </motion.div>
            
            {/* Features List */}
            <motion.div 
              custom={2}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeUp}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span className="text-gray-200">Free video consultation</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span className="text-gray-200">Custom packaging solutions</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span className="text-gray-200">Real-time shipment tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span className="text-gray-200">Dedicated moving coordinator</span>
              </div>
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div 
              custom={3}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 rounded-xl shadow-lg shadow-purple-700/20"
              >
                Get Free Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 rounded-xl shadow-lg shadow-purple-700/20"
              >
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div 
              custom={4}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeUp}
              className="pt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
            >
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-500/10 border border-purple-500/20">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">100%</div>
                  <div className="text-sm text-gray-400">Safe Delivery</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20">
                  <MapPin className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">500+</div>
                  <div className="text-sm text-gray-400">Cities Covered</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-pink-500/10 border border-pink-500/20">
                  <Star className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">4.9/5</div>
                  <div className="text-sm text-gray-400">Customer Rating</div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - 3D Moving Animation */}
          <motion.div
            custom={2}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeUp}
            className="relative h-full flex items-center justify-center lg:justify-end"
          >
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Service Type Tabs */}
      <div className="flex border-b mb-6">
        {['Residential', 'Commercial', 'Warehouse'].map((type, index) => (
          <button
            key={index}
            className={`py-2 px-4 font-medium ${activeTab === type ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab(type as 'Residential' | 'Commercial' | 'Warehouse')}
          >
            {type}
          </button>
        ))}
      </div>
      
      {/* Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {activeTab === 'Residential' && [
          { icon: Truck, title: 'Residential Moving', desc: 'Complete home relocation with white-glove service' },
          { icon: Package, title: 'Packing Services', desc: 'Professional-grade packaging for all your valuables' },
          { icon: Globe, title: 'Vehicle Transport', desc: '2 Wheeler & 4 Wheeler Transport' }
        ].map((service, i) => (
          <div key={i} className="border rounded-lg p-6 hover:shadow-lg transition duration-300">
            <div className="flex items-center mb-4">
              <service.icon className="h-8 w-8 text-blue-500 mr-3" />
              <h3 className="text-lg font-semibold">{service.title}</h3>
            </div>
            <p className="text-gray-600">{service.desc}</p>
          </div>
        ))}
        
        {activeTab === 'Commercial' && [
          { icon: Building2, title: 'Office Shifting', desc: 'Minimal downtime business moving with IT equipment handling' },
          { icon: ClipboardCheck, title: 'Inventory Management', desc: 'Detailed tracking of all office assets during relocation' },
          { icon: Package, title: 'Equipment Packaging', desc: 'Specialized packaging for sensitive office equipment' }
        ].map((service, i) => (
          <div key={i} className="border rounded-lg p-6 hover:shadow-lg transition duration-300">
            <div className="flex items-center mb-4">
              <service.icon className="h-8 w-8 text-blue-500 mr-3" />
              <h3 className="text-lg font-semibold">{service.title}</h3>
            </div>
            <p className="text-gray-600">{service.desc}</p>
          </div>
        ))}
        
        {activeTab === 'Warehouse' && [
          { icon: Warehouse, title: 'Warehouse Moving', desc: 'Large-scale inventory and equipment transportation' },
          { icon: ClipboardCheck, title: 'Inventory Tracking', desc: 'Comprehensive tracking systems for all warehouse goods' },
          { icon: Truck, title: 'Heavy Equipment Transport', desc: 'Vehicles for industrial machinery moving' }
        ].map((service, i) => (
          <div key={i} className="border rounded-lg p-6 hover:shadow-lg transition duration-300">
            <div className="flex items-center mb-4">
              <service.icon className="h-8 w-8 text-blue-500 mr-3" />
              <h3 className="text-lg font-semibold">{service.title}</h3>
            </div>
            <p className="text-gray-600">{service.desc}</p>
          </div>
        ))}
      </div>
      
      {/* Contact Form Teaser */}
      <div className="bg-blue-50 p-6 rounded-lg text-center">
        
        <button className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 transition duration-300 mb-3">
          Schedule Consultation
        </button>
        <p className="text-gray-600">Get a personalized moving plan within 24 hours</p>
      </div>
    </div>

          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.5, duration: 0.5 } }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-purple-300 text-sm mb-2">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-6 h-6 text-purple-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}