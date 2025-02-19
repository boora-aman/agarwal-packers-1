import { Box, Home, Building2, Truck, ShieldCheck, PackageCheck, Clock, MapPin, Calculator } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    title: "Residential Moving Services",
    description: "Expert home relocation services including full-service packing, furniture disassembly, secure transportation, and setup at your new residence. Our trained professionals handle everything from delicate items to heavy furniture with precision and care.",
    icon: Home,
    features: ["Free in-home estimates", "Custom packing solutions", "Furniture protection", "Same-day service available"],
    keywords: ["home moving", "house relocation", "residential movers", "local moving company"]
  },
  {
    title: "Commercial & Office Relocation",
    description: "Streamlined office moving services designed to minimize business disruption. We handle IT equipment, documents, furniture, and workspace setup with careful planning and execution to ensure business continuity.",
    icon: Building2,
    features: ["IT equipment handling", "Weekend moves available", "Systematic labeling", "Project management"],
    keywords: ["office relocation", "commercial moving", "business movers", "corporate relocation"]
  },
  {
    title: "Professional Packing Services",
    description: "Comprehensive packing and unpacking services using industry-grade materials. Our expert packers ensure the safety of your belongings with custom crating, specialty item handling, and organized labeling systems.",
    icon: Box,
    features: ["Custom crating", "Fragile item protection", "Eco-friendly materials", "Systematic unpacking"],
    keywords: ["packing services", "professional packers", "moving supplies", "packing materials"]
  },
  {
    title: "Vehicle Transportation",
    description: "Specialized auto transport services for cars, motorcycles, and recreational vehicles. Door-to-door delivery with enclosed carriers, GPS tracking, and comprehensive insurance coverage for peace of mind.",
    icon: Truck,
    features: ["Enclosed transport", "GPS tracking", "Door-to-door service", "Insurance coverage"],
    keywords: ["car shipping", "auto transport", "vehicle moving", "car relocation"]
  },
  {
    title: "Secure Storage Solutions",
    description: "Climate-controlled storage facilities with 24/7 surveillance and advanced security systems. Perfect for both short-term and long-term storage needs with flexible access options and inventory management.",
    icon: ShieldCheck,
    features: ["Climate control", "24/7 security", "Flexible terms", "Easy access"],
    keywords: ["storage units", "secure storage", "climate controlled storage", "warehouse storage"]
  },
  {
    title: "International Moving",
    description: "Complete international relocation services including customs documentation, freight forwarding, and destination services. Expert handling of overseas moves with proper documentation and compliance.",
    icon: MapPin,
    features: ["Customs handling", "Container shipping", "Global network", "Door-to-door service"],
    keywords: ["international movers", "overseas relocation", "global moving", "international shipping"]
  },
  {
    title: "Express Moving Services",
    description: "Fast and efficient moving solutions for time-sensitive relocations. Dedicated teams and expedited services ensure quick turnaround while maintaining the highest quality standards.",
    icon: Clock,
    features: ["Same-day service", "Priority scheduling", "Dedicated team", "Express delivery"],
    keywords: ["fast movers", "quick moving", "express relocation", "urgent moving"]
  },
  {
    title: "Moving Cost Calculator",
    description: "Get instant moving quotes with our advanced calculator tool. Transparent pricing with no hidden fees, including detailed breakdowns of services and customizable options to fit your budget.",
    icon: Calculator,
    features: ["Instant quotes", "Transparent pricing", "Custom packages", "Price matching"],
    keywords: ["moving quotes", "relocation cost", "moving calculator", "moving estimates"]
  }
]

export default function Services() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-4xl font-bold mb-6">Comprehensive Moving & Relocation Services</h1>
          <p className="text-gray-600 text-lg mb-8">
            Experience seamless relocations with our professional moving services. From residential moves to international shipping,
            we provide end-to-end solutions tailored to your specific needs.
          </p>
          <p className="text-gray-500">
            Licensed & Insured | 24/7 Support | Free Estimates | 5-Star Rated Service
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-6">
                  {service.description}
                </CardDescription>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500">
                      <PackageCheck className="w-4 h-4 text-primary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}