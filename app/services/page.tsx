import { Metadata } from "next"
import { Box, Home, Building2, Truck, ShieldCheck, Package, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Professional Moving Services | Agrawal Packers and Movers",
  description: "Comprehensive packing, moving, and relocation services for homes and businesses. Expert solutions for local and international moves with complete safety.",
  keywords: "packing services, moving services, house relocation, office shifting, vehicle transport, storage solutions, international moving"
}

const services = [
  {
    title: "House Relocation",
    description: "Complete packing and moving solutions for your home with utmost care and precision.",
    icon: Home,
    details: "Our house relocation service covers everything from packing your belongings to unpacking them at your new home. We use high-quality packing materials and employ trained professionals to ensure the safety of your items during transit.",
    features: [
      "Free pre-move survey",
      "Professional packing materials",
      "Experienced handling team",
      "Safe transportation",
      "Unpacking & arranging",
      "Insurance coverage"
    ]
  },
  {
    title: "Office Relocation",
    description: "Specialized corporate moving services ensuring minimal business disruption.",
    icon: Building2,
    details: "We understand that time is crucial in business. Our office relocation service is designed to minimize disruption to your operations. We can work after hours or on weekends to ensure a smooth transition to your new office space.",
    features: [
      "IT equipment handling",
      "Furniture dismantling",
      "Document management",
      "Weekend moving",
      "Asset tracking",
      "Quick setup"
    ]
  },
  {
    title: "Packing & Unpacking",
    description: "Professional packing services using quality materials to ensure the safety of your belongings.",
    icon: Box,
    details: "Our expert packers use industry-standard materials and techniques to pack your items securely. We offer both packing and unpacking services, allowing you to settle into your new space without the hassle of dealing with boxes.",
    features: [
      "Quality packing materials",
      "Systematic packing process",
      "Fragile item handling",
      "Furniture disassembly",
      "Organized unpacking",
      "Debris removal"
    ]
  },
  {
    title: "Vehicle Transportation",
    description: "Safe and secure transportation of your vehicles across India.",
    icon: Truck,
    details: "Whether you're moving a car, motorcycle, or other vehicle, our specialized vehicle transportation service ensures your prized possessions arrive safely at their destination. We use purpose-built carriers and secure locking mechanisms.",
    features: [
      "Enclosed carriers",
      "GPS tracking",
      "Door-to-door service",
      "Insurance coverage",
      "Timely delivery",
      "Professional drivers"
    ]
  },
  {
    title: "Storage Solutions",
    description: "Secure warehouse facilities for short-term and long-term storage needs.",
    icon: ShieldCheck,
    details: "Our climate-controlled storage facilities offer a safe haven for your belongings, whether you need short-term storage during a move or long-term solutions. All items are inventoried and stored securely, with easy access when you need them.",
    features: [
      "24/7 security",
      "Climate control",
      "Inventory management",
      "Easy access",
      "Flexible duration",
      "Competitive rates"
    ]
  }
]

const whyChooseUs = [
  {
    title: "Experienced Team",
    description: "Our team of professionals has years of experience in handling all types of relocations."
  },
  {
    title: "Quality Packing",
    description: "We use premium quality packing materials to ensure the safety of your belongings."
  },
  {
    title: "Timely Delivery",
    description: "We understand the importance of time and ensure punctual delivery of your goods."
  },
  {
    title: "Insurance Coverage",
    description: "Your belongings are insured during transit for complete peace of mind."
  }
]

export default function ServicesPage() {
  return (
    <main className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">Our Professional Services</h1>
          <p className="text-xl text-gray-600">
            At Agrawal Packers and Movers, we offer comprehensive relocation solutions tailored to meet your specific needs.
            With years of experience and a dedicated team, we ensure a smooth and hassle-free moving experience.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {services.map((service, index) => (
            <Card key={index} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="mb-4">{service.description}</CardDescription>
                <p className="text-sm text-gray-600 mb-4">{service.details}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Move?</h2>
          <p className="text-gray-600 mb-8">
            Contact us today for a free consultation and quote. Our team is ready to assist you with your relocation needs.
          </p>
          <div className="flex justify-center gap-4">
            <a href="tel:+919368108590" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">
              Call Now
            </a>
            <a href="/contact" className="bg-gray-100 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-200">
              Get Quote
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

