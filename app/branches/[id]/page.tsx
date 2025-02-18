import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { branches, companyInfo } from "@/data/branches"
import {
  PhoneIcon,
  MapPinIcon,
  MailIcon,
  ClockIcon,
  CheckCircle2,
  Building2,
  Truck,
  Package,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface BranchPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: BranchPageProps): Promise<Metadata> {
  const branch = branches.find((b) => b.id === params.id)
  if (!branch) return { title: "Branch Not Found" }

  return {
    title: `${companyInfo.name} - ${branch.city} Branch | Professional Packers and Movers`,
    description: `Professional packing and moving services in ${branch.city}. Expert relocation solutions for homes and businesses. Visit our branch at ${branch.address}`,
    keywords:
      branch.keywords?.join(", ") ||
      `packers and movers in ${branch.city}, moving services ${branch.city}, relocation services ${branch.city}`,
  }
}

export function generateStaticParams() {
  return branches.map((branch) => ({
    id: branch.id,
  }))
}

export default function BranchPage({ params }: BranchPageProps) {
  const branch = branches.find((b) => b.id === params.id)

  if (!branch) {
    notFound()
  }

  const features = [
    {
      icon: Building2,
      title: "Local Expertise",
      description: `Deep understanding of ${branch.city}'s localities and requirements`,
    },
    {
      icon: Truck,
      title: "Modern Fleet",
      description: "Well-maintained vehicles with real-time tracking",
    },
    {
      icon: Package,
      title: "Professional Packing",
      description: "High-quality materials and trained packers",
    },
    {
      icon: ShieldCheck,
      title: "Insured Services",
      description: "Complete safety and insurance coverage",
    },
  ]

  const faqs = [
    {
      question: "What areas do you serve in " + branch.city + "?",
      answer:
        "We serve all major areas in " +
        branch.city +
        " including " +
        branch.areas?.join(", ") +
        ". Our services extend to nearby regions as well.",
    },
    {
      question: "Do you offer packing services?",
      answer:
        "Yes, we offer professional packing services using high-quality materials to ensure the safety of your belongings during transit.",
    },
    {
      question: "How far in advance should I book your services?",
      answer:
        "We recommend booking at least 2-3 weeks in advance, especially during peak moving seasons. However, we also accommodate last-minute moves when possible.",
    },
    {
      question: "Do you provide storage solutions?",
      answer: "Yes, we offer both short-term and long-term storage solutions in secure, climate-controlled facilities.",
    },
    {
      question: "Are your services insured?",
      answer:
        "Yes, all our services are fully insured. We offer comprehensive transit insurance to protect your belongings during the move.",
    },
  ]

  return (
    <main className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              {companyInfo.name} - {branch.city}
            </h1>
            <p className="text-xl text-gray-600">Your Trusted Packing & Moving Partner in {branch.city}</p>
          </div>

          {/* Branch Overview */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Address</h3>
                      <p className="text-gray-600">{branch.address}</p>
                      <Link href={branch.mapLink} target="_blank" className="text-primary hover:underline text-sm">
                        View on Map →
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <p className="text-gray-600">{branch.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MailIcon className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">{branch.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ClockIcon className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Working Hours</h3>
                      <p className="text-gray-600">{branch.timings}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">About Our {branch.city} Branch</h2>
              <p className="text-gray-600 mb-6">{branch.about}</p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900">Established</h3>
                  <p className="text-gray-600">{branch.established}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Key Features</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {branch.features?.slice(0, 3).map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <feature.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Services Section */}
          {(branch.services?.household || branch.services?.commercial) && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Our Services in {branch.city}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {branch.services?.household && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Household Services</h3>
                      <ul className="space-y-3">
                        {branch.services.household.map((service: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {branch.services?.commercial && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Commercial Services</h3>
                      <ul className="space-y-3">
                        {branch.services.commercial.map((service: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Service Areas */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Areas We Serve in {branch.city}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {branch.areas?.map((area: string, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg text-center text-gray-600">
                    {area}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-primary text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Ready to Move?</h2>
              <p className="mb-6">Get a free quote for your relocation needs in {branch.city}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href={`tel:${branch.phone}`}>
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    Call Us Now
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white hover:bg-white text-primary"
                >
                  Request Quote
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

