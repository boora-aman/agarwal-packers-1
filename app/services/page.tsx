import React from "react";
import { Metadata } from "next";
import {
  Box,
  Home,
  Building2,
  Truck,
  ShieldCheck,
  Package,
  Globe,
  Warehouse,
  Clock,
  Award,
  PhoneCall,
  Map,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Professional Packers and Movers Services | Agrawal Packers & Movers India",
  description: "India's trusted packers and movers offering premium relocation services including home shifting, office relocation, car transport, storage solutions, and international moving. 25+ years of excellence in safe and secure moving services.",
  keywords: "packers and movers, house shifting services, office relocation, vehicle transportation, storage solutions, international moving, corporate relocation, furniture moving, home shifting, warehouse services, door to door delivery, packing services, moving company India, best packers and movers, affordable moving services",
  openGraph: {
    title: "Professional Packers and Movers Services | Agrawal Packers & Movers",
    description: "Trusted packers and movers with 25+ years of excellence. Comprehensive relocation solutions for homes, offices, vehicles, and international moves.",
    images: ["/images/services-banner.jpg"],
  }
}

const services = [
  {
    title: "Residential Relocation",
    description: "Comprehensive home shifting services with expert care and precision.",
    icon: Home,
    details: "From studio apartments to luxury villas, we handle all types of residential moves with utmost care. Our specialized team ensures a smooth transition to your new home.",
    features: [
      "Free home survey & quote",
      "Professional packing materials",
      "Experienced handling team",
      "Safe transportation",
      "Unpacking & arranging",
      "Insurance coverage",
      "Pet relocation assistance",
      "Utility setup coordination"
    ],
    badge: "Most Popular"
  },
  {
    title: "Corporate Relocation",
    description: "End-to-end business moving solutions with minimal disruption.",
    icon: Building2,
    details: "Specialized in corporate relocations, from small offices to large enterprises. We ensure business continuity with strategic planning and execution.",
    features: [
      "IT infrastructure moving",
      "Furniture installation",
      "Document management",
      "After-hours service",
      "Asset tracking",
      "Workspace planning",
      "Employee relocation",
      "Data center moving"
    ],
    badge: "Enterprise Ready"
  },
  {
    title: "International Moving",
    description: "Global relocation services with customs clearance assistance.",
    icon: Globe,
    details: "Complete international moving solutions including documentation, customs clearance, and door-to-door delivery across continents.",
    features: [
      "Custom packaging",
      "Documentation support",
      "Customs clearance",
      "Container shipping",
      "Air freight options",
      "Door-to-door service",
      "Real-time tracking",
      "International insurance"
    ],
    badge: "Global Service"
  },
  {
    title: "Premium Packing",
    description: "State-of-the-art packing solutions for ultimate protection.",
    icon: Box,
    details: "Using industry-leading materials and techniques to ensure maximum protection for your valuables during transit.",
    features: [
      "Custom crating",
      "Anti-static packaging",
      "Climate control wrapping",
      "Fragile item protection",
      "Art & antique packing",
      "Electronics packaging",
      "Furniture wrapping",
      "Eco-friendly options"
    ]
  },
  {
    title: "Vehicle Transport",
    description: "Specialized vehicle moving services across India.",
    icon: Truck,
    details: "Safe transportation of all vehicle types including luxury cars, vintage vehicles, and motorcycles using specialized carriers.",
    features: [
      "Enclosed carriers",
      "Real-time GPS tracking",
      "Door-to-door delivery",
      "Comprehensive insurance",
      "Express delivery",
      "Multi-car transport",
      "Specialty vehicle handling",
      "Pre-move inspection"
    ]
  },
  {
    title: "Storage Solutions",
    description: "Modern storage facilities with advanced security.",
    icon: Warehouse,
    details: "State-of-the-art warehousing facilities offering short and long-term storage with 24/7 security and climate control.",
    features: [
      "24/7 CCTV surveillance",
      "Climate-controlled units",
      "Fire protection system",
      "Digital inventory",
      "Easy access",
      "Flexible terms",
      "Pick-up service",
      "Regular maintenance"
    ]
  }
];

const whyChooseUs = [
  {
    title: "25+ Years Experience",
    description: "Trusted by over 100,000 customers across India with proven expertise in all types of relocations.",
    icon: Award
  },
  {
    title: "Trained Professionals",
    description: "Certified moving experts with regular training in latest packing and handling techniques.",
    icon: CheckCircle2
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock customer service with dedicated move coordinators for seamless communication.",
    icon: PhoneCall
  },
  {
    title: "Pan India Network",
    description: "Extensive network covering all major cities with local expertise and nationwide capabilities.",
    icon: Map
  }
];

const ServiceBadge = ({ text }: { text: string }) => (
  <Badge variant="secondary" className="absolute top-4 right-4 bg-primary/10 text-primary">
    {text}
  </Badge>
);

export default function ServicesPage() {
  return (
    <main className="py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6">Professional Packing & Moving Services</h1>
          <p className="text-xl text-gray-600 mb-8">
            India's most trusted packers and movers with 25+ years of excellence in providing comprehensive relocation solutions.
            Experienced professionals, advanced equipment, and nationwide network for a stress-free moving experience.
          </p>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">25+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {services.map((service, index) => (
            <Card key={index} className="relative flex flex-col hover:shadow-lg transition-shadow">
              {service.badge && <ServiceBadge text={service.badge} />}
              <CardHeader>
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-lg mb-4">{service.description}</CardDescription>
                <p className="text-gray-600 mb-6">{service.details}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="text-gray-600 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary/60" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-gray-50 rounded-xl p-12 mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Agrawal Packers & Movers?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary text-white rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Moving Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get a free consultation and customized quote for your moving needs. Our experts are available 24/7 to assist you.
          </p>
          <div className="flex justify-center gap-6">
            <a href="tel:+919368108590" className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-100 font-semibold">
              Call Now
            </a>
            <a href="/contact" className="bg-primary-dark text-white px-8 py-3 rounded-lg hover:bg-primary-darker border-2 border-white font-semibold">
              Get Free Quote
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}