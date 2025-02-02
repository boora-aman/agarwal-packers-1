import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Moving services"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Your Trusted Partner in Relocation Services</h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Professional packing and moving services across India. Safe, secure, and timely delivery guaranteed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="gap-2">
              <Phone className="w-5 h-5" />
              Get Free Quote
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-white/10">
              Our Services
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-3xl font-bold">15+</div>
              <div className="text-gray-300">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold">10k+</div>
              <div className="text-gray-300">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold">Pan India</div>
              <div className="text-gray-300">Service Network</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

