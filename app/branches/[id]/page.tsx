import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { branches, companyInfo } from "@/data/branches";
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
  Star,
  Home,
  Users,
  Calendar,
  Award,
  ArrowRight,
  Clock4,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface BranchPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: BranchPageProps): Promise<Metadata> {
  const branch = branches.find((b) => b.id === params.id);
  if (!branch) return { title: "Branch Not Found" };

  return {
    title: `${companyInfo.name} - ${branch.city} Branch | Professional Packers and Movers`,
    description: `Professional packing and moving services in ${branch.city}. Expert relocation solutions for homes and businesses with 24/7 support. Visit our branch at ${branch.address}`,
    keywords: `${branch.keywords?.join(", ") || `packers and movers in ${branch.city}, moving services ${branch.city}, relocation services ${branch.city}`}, house shifting, office relocation, storage services, vehicle transport`,
    openGraph: {
      title: `${companyInfo.name} - ${branch.city} Branch`,
      description: `Professional packing and moving services in ${branch.city}. Expert relocation solutions with 24/7 support.`,
      type: 'website',
    }
  };
}

export function generateStaticParams() {
  return branches.map((branch) => ({
    id: branch.id,
  }));
}

const stats = [
  { icon: Star, label: "Rating", value: "4.8/5" },
  { icon: Users, label: "Happy Customers", value: "1000+" },
  { icon: Calendar, label: "Years in Service", value: "10+" },
  { icon: Award, label: "Awards", value: "15+" },
];

export default function BranchPage({ params }: BranchPageProps) {
  const branch = branches.find((b) => b.id === params.id);

  if (!branch) {
    notFound();
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
  ];

  const faqs = [
    {
      question: `What areas do you serve in ${branch.city}?`,
      answer: `We serve all major areas in ${branch.city} including ${branch.areas?.join(", ")}. Our services extend to nearby regions as well.`,
    },
    {
      question: "Do you offer packing services?",
      answer: "Yes, we offer professional packing services using high-quality materials to ensure the safety of your belongings during transit.",
    },
    {
      question: "How far in advance should I book your services?",
      answer: "We recommend booking at least 2-3 weeks in advance, especially during peak moving seasons. However, we also accommodate last-minute moves when possible.",
    },
    {
      question: "Do you provide storage solutions?",
      answer: "Yes, we offer both short-term and long-term storage solutions in secure, climate-controlled facilities.",
    },
    {
      question: "Are your services insured?",
      answer: "Yes, all our services are fully insured. We offer comprehensive transit insurance to protect your belongings during the move.",
    },
  ];

  return (
    <main className="py-16">
      <div className="container mx-auto pt-14 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              {branch.city} Branch
            </Badge>
            <h1 className="text-5xl font-bold mb-4">
              {companyInfo.name} - {branch.city}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your Trusted Packing & Moving Partner in {branch.city}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-primary/5 p-4 rounded-lg">
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="font-bold text-2xl text-primary">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-primary text-white rounded-xl p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <Link 
                href={`tel:${branch.phone}`}
                className="flex items-center justify-center gap-2 bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors"
              >
                <PhoneIcon className="w-5 h-5" />
                <span>Call Now</span>
              </Link>
              <Link 
                href={branch.mapLink} 
                target="_blank"
                className="flex items-center justify-center gap-2 bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors"
              >
                <MapPinIcon className="w-5 h-5" />
                <span>Get Directions</span>
              </Link>
              <Link 
                href="/quote"
                className="flex items-center justify-center gap-2 bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Now</span>
              </Link>
            </div>
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
                      <Link 
                        href={branch.mapLink} 
                        target="_blank" 
                        className="inline-flex items-center text-primary hover:underline text-sm mt-1"
                      >
                        View on Map <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <p className="text-gray-600">{branch.phone}</p>
                      <Link 
                        href={`tel:${branch.phone}`}
                        className="inline-flex items-center text-primary hover:underline text-sm mt-1"
                      >
                        Call Now <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MailIcon className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">{branch.email}</p>
                      <Link 
                        href={`mailto:${branch.email}`}
                        className="inline-flex items-center text-primary hover:underline text-sm mt-1"
                      >
                        Send Email <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ClockIcon className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Working Hours</h3>
                      <p className="text-gray-600">{branch.timings}</p>
                      <Badge variant="secondary" className="mt-1">24/7 Support Available</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About Our {branch.city} Branch</CardTitle>
              <CardDescription>Established in {branch.established}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-6">{branch.about}</p>
              <div className="grid md:grid-cols-3 gap-6">
                {branch.features?.map((feature: string, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-primary mb-2" />
                    <p className="text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
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
                <CardDescription>Comprehensive moving solutions for homes and businesses</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {branch.services?.household && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <Home className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-gray-900">Household Services</h3>
                      </div>
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
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <Building2 className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-gray-900">Commercial Services</h3>
                      </div>
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
              <CardDescription>Comprehensive coverage across {branch.city} and surrounding regions</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {branch.areas?.map((area: string, index: number) => (
                  <div key={index} className="bg-primary/5 p-4 rounded-lg text-center">
                    <p className="font-medium text-gray-700">{area}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common queries about our services in {branch.city}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-primary text-white">
            <CardContent className="p-8">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-lg mb-8 text-white/90">
                  Get a free quote for your relocation needs in {branch.city}. Our team is available 24/7 to assist you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="hover:bg-white hover:text-primary transition-colors"
                    asChild
                  >
                    <Link href={`tel:${branch.phone}`}>
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      Call Us Now
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-black border-white hover:bg-white hover:text-primary transition-colors"
                    asChild
                  >
                    <Link href="/quote">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule a Move
                    </Link>
                  </Button>
                </div>
                <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-1">
                    <Clock4 className="w-4 h-4" />
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Fully Insured</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>4.8/5 Rating</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </main>
  );
}