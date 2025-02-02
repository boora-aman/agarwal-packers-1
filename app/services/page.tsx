import { Box, Home, Building2, Truck, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    title: "House Relocation",
    description: "Complete packing and moving solutions for your home with utmost care and precision.",
    icon: Home,
    details:
      "Our house relocation service covers everything from packing your belongings to unpacking them at your new home. We use high-quality packing materials and employ trained professionals to ensure the safety of your items during transit.",
  },
  {
    title: "Office Relocation",
    description: "Specialized services for moving your office equipment and furniture with minimal downtime.",
    icon: Building2,
    details:
      "We understand that time is crucial in business. Our office relocation service is designed to minimize disruption to your operations. We can work after hours or on weekends to ensure a smooth transition to your new office space.",
  },
  {
    title: "Packing & Unpacking",
    description: "Professional packing services using quality materials to ensure the safety of your belongings.",
    icon: Box,
    details:
      "Our expert packers use industry-standard materials and techniques to pack your items securely. We offer both packing and unpacking services, allowing you to settle into your new space without the hassle of dealing with boxes.",
  },
  {
    title: "Vehicle Transportation",
    description: "Safe and secure transportation of your vehicles across India.",
    icon: Truck,
    details:
      "Whether you're moving a car, motorcycle, or other vehicle, our specialized vehicle transportation service ensures your prized possessions arrive safely at their destination. We use purpose-built carriers and secure locking mechanisms.",
  },
  {
    title: "Storage Solutions",
    description: "Secure warehouse facilities for short-term and long-term storage needs.",
    icon: ShieldCheck,
    details:
      "Our climate-controlled storage facilities offer a safe haven for your belongings, whether you need short-term storage during a move or long-term solutions. All items are inventoried and stored securely, with easy access when you need them.",
  },
]

export default function ServicesPage() {
  return (
    <main className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Services</h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          At Agarwal Packers and Movers, we offer a comprehensive range of relocation services tailored to meet your
          specific needs.
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="mb-4">{service.description}</CardDescription>
                <p className="text-sm text-gray-600">{service.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

