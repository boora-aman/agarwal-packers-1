import { Box, Home, Building2, Truck, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    title: "House Relocation",
    description: "Complete packing and moving solutions for your home with utmost care and precision.",
    icon: Home,
  },
  {
    title: "Office Relocation",
    description: "Specialized services for moving your office equipment and furniture with minimal downtime.",
    icon: Building2,
  },
  {
    title: "Packing & Unpacking",
    description: "Professional packing services using quality materials to ensure the safety of your belongings.",
    icon: Box,
  },
  {
    title: "Vehicle Transportation",
    description: "Safe and secure transportation of your vehicles across India.",
    icon: Truck,
  },
  {
    title: "Storage Solutions",
    description: "Secure warehouse facilities for short-term and long-term storage needs.",
    icon: ShieldCheck,
  },
]

export default function Services() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600">Comprehensive moving solutions tailored to meet your specific requirements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardHeader>
                <service.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

