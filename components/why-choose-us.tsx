import { Shield, Clock, Truck, Award, CheckCircle, Package, Users, PhoneCall, BadgeCheck, MapPin, Calculator, HeartHandshake } from "lucide-react"

const reasons = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Your belongings are fully insured and handled with utmost care. We use premium packing materials and advanced tracking systems to ensure maximum security.",
    features: [
      "Comprehensive transit insurance",
      "GPS tracking systems",
      "24/7 security monitoring",
      "Tamper-proof sealing"
    ]
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description: "We maintain strict adherence to delivery schedules with real-time tracking and proactive updates. Our efficient logistics ensure on-time completion.",
    features: [
      "Guaranteed delivery times",
      "Real-time status updates",
      "Systematic move planning",
      "Express delivery options"
    ]
  },
  {
    icon: Truck,
    title: "Pan India Network",
    description: "Our extensive network covers all major cities and remote locations across India. Benefit from our strong presence and local expertise everywhere.",
    features: [
      "500+ cities covered",
      "Modern fleet of vehicles",
      "Local expertise",
      "Nationwide warehousing"
    ]
  },
  {
    icon: Award,
    title: "Experienced Team",
    description: "Our certified professionals bring decades of expertise in handling diverse relocation needs with precision and care.",
    features: [
      "Certified moving experts",
      "Regular staff training",
      "Specialized handling teams",
      "Background verified staff"
    ]
  },
  {
    icon: Package,
    title: "Custom Solutions",
    description: "Tailored moving solutions to match your specific requirements, whether it's residential, commercial, or specialized items.",
    features: [
      "Personalized moving plans",
      "Flexible scheduling",
      "Custom packing options",
      "Special item handling"
    ]
  },
  {
    icon: Calculator,
    title: "Transparent Pricing",
    description: "Clear, upfront pricing with no hidden charges. Get detailed quotes and choose packages that fit your budget perfectly.",
    features: [
      "No hidden charges",
      "Free cost estimates",
      "Multiple payment options",
      "Price matching guarantee"
    ]
  },
  {
    icon: HeartHandshake,
    title: "Customer Support",
    description: "Dedicated support team available 24/7 to assist you throughout your moving journey and address any concerns promptly.",
    features: [
      "24/7 customer service",
      "Dedicated move coordinator",
      "Multiple support channels",
      "Quick issue resolution"
    ]
  },
  {
    icon: BadgeCheck,
    title: "Quality Assured",
    description: "ISO certified processes and stringent quality controls ensure the highest standards of service delivery every time.",
    features: [
      "ISO 9001:2015 certified",
      "Quality check protocols",
      "Service guarantees",
      "Systematic documentation"
    ]
  }
]

const stats = [
  { number: "15K+", label: "Happy Customers" },
  { number: "500+", label: "Cities Covered" },
  { number: "25+", label: "Years Experience" },
  { number: "98%", label: "Satisfaction Rate" }
]

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose Agarwal Packers?</h2>
          <p className="text-gray-600 text-lg mb-8">
            Experience the perfect blend of expertise, technology, and customer care
            with India's most trusted moving partner.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <reason.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{reason.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-6">{reason.description}</p>
              
              <ul className="space-y-3">
                {reason.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-primary/60 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-primary/10 rounded-full px-6 py-3">
            <PhoneCall className="w-5 h-5 text-primary" />
            <span className="font-semibold">Call us for a free consultation: 9368108590</span>
          </div>
        </div>
      </div>
    </section>
  )
}