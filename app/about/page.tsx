import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Users, ThumbsUp, Award } from "lucide-react"

const stats = [
  { title: "Years of Experience", value: "15+", icon: Award },
  { title: "Satisfied Customers", value: "10,000+", icon: ThumbsUp },
  { title: "Cities Served", value: "100+", icon: Truck },
  { title: "Team Members", value: "500+", icon: Users },
]

export default function AboutPage() {
  return (
    <main className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">About Agarwal Packers and Movers</h1>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <p className="text-lg mb-4">
              Agarwal Packers and Movers has been a trusted name in the relocation industry for over 15 years. We take
              pride in providing top-notch packing and moving services across India, ensuring that your belongings reach
              their destination safely and on time.
            </p>
            <p className="text-lg mb-4">
              Our team of experienced professionals is dedicated to making your move as smooth and stress-free as
              possible. We use the latest packing materials and techniques to ensure the safety of your items during
              transit.
            </p>
            <p className="text-lg">
              Whether you're moving your home, office, or need specialized services like vehicle transportation, Agarwal
              Packers and Movers has got you covered. Our pan-India network allows us to serve you efficiently, no
              matter where you're moving to or from.
            </p>
          </div>
          <div className="relative h-[400px]">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Agarwal Packers and Movers Team"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg max-w-3xl mx-auto">
            To provide exceptional relocation services that exceed our customers' expectations, ensuring their peace of
            mind throughout the moving process. We strive to be the most trusted and reliable name in the packing and
            moving industry across India.
          </p>
        </div>
      </div>
    </main>
  )
}

