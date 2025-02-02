import { Shield, Clock, Truck, Award } from "lucide-react"

const reasons = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Your belongings are fully insured and handled with utmost care.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description: "We ensure your items reach their destination on time, every time.",
  },
  {
    icon: Truck,
    title: "Pan India Service",
    description: "Our extensive network covers all major cities and towns across India.",
  },
  {
    icon: Award,
    title: "Experienced Team",
    description: "Our skilled professionals have years of experience in relocation services.",
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Agarwal Packers?</h2>
          <p className="text-gray-600">
            We offer unparalleled relocation services with a focus on safety, efficiency, and customer satisfaction.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="text-center">
              <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                <reason.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

