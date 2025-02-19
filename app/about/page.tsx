import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Truck, 
  Users, 
  ThumbsUp, 
  Award, 
  Shield, 
  Globe, 
  Clock, 
  Target 
} from "lucide-react";

const stats = [
  { 
    title: "Years of Experience", 
    value: "15+", 
    icon: Award,
    description: "Trusted service since 2009" 
  },
  { 
    title: "Satisfied Customers", 
    value: "10,000+", 
    icon: ThumbsUp,
    description: "5-star rated service" 
  },
  { 
    title: "Cities Served", 
    value: "100+", 
    icon: Truck,
    description: "Pan-India coverage" 
  },
  { 
    title: "Team Members", 
    value: "500+", 
    icon: Users,
    description: "Trained professionals" 
  },
];

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description: "We prioritize the safety of your belongings with premium packing materials and careful handling"
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description: "Punctual service with real-time tracking and regular updates"
  },
  {
    icon: Target,
    title: "Customer Focus",
    description: "Dedicated move coordinators and 24/7 customer support"
  },
  {
    icon: Globe,
    title: "Wide Network",
    description: "Extensive network covering all major cities across India"
  }
];

export default function AboutPage() {
  return (
    <main className="py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6">About Agrawal Packers and Movers</h1>
          <p className="text-xl text-gray-600">
            Your Trusted Partner in Safe and Reliable Relocation Services Since 2009
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Leading the Way in Professional Moving Services</h2>
            <p className="text-lg mb-6 text-gray-700">
              Agrawal Packers and Movers has been a trusted name in the relocation industry for over 15 years. 
              We take pride in providing top-notch packing and moving services across India, ensuring that your 
              belongings reach their destination safely and on time.
            </p>
            <p className="text-lg mb-6 text-gray-700">
              Our team of experienced professionals is dedicated to making your move as smooth and stress-free as 
              possible. We use the latest packing materials and techniques to ensure the safety of your items during 
              transit.
            </p>
            <p className="text-lg text-gray-700">
              Whether you're moving your home, office, or need specialized services like vehicle transportation, 
              Agrawal Packers and Movers has got you covered. Our pan-India network allows us to serve you efficiently, 
              no matter where you're moving to or from.
            </p>
          </div>
          <div className="bg-gray-100 rounded-lg p-8 h-[400px] flex items-center justify-center">
            <div className="text-center">
              <Truck className="w-24 h-24 text-primary mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600">Professional Moving Services</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <value.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-primary/5 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            To provide exceptional relocation services that exceed our customers' expectations, ensuring their peace of 
            mind throughout the moving process. We strive to be the most trusted and reliable name in the packing and 
            moving industry across India.
          </p>
          <div className="flex justify-center gap-6">
            <a 
              href="/contact" 
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
            <a 
              href="/services" 
              className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Our Services
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}