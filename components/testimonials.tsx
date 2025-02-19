import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star, Quote, MapPin, Calendar, ThumbsUp, Badge, UserCircle2 } from "lucide-react"

const testimonials = [
  {
    name: "Rahul Sharma",
    location: "Delhi to Mumbai",
    comment: "Absolutely outstanding service from start to finish! The team showed exceptional professionalism in handling our 4-bedroom house move. Their systematic approach to packing delicate items and furniture was impressive. Everything arrived in perfect condition, and they even helped with the setup at our new home.",
    rating: 5,
    moveType: "Residential Move",
    date: "January 2025",
    verified: true
  },
  {
    name: "Priya Patel",
    location: "Bangalore to Pune",
    comment: "As a business owner, I was concerned about moving our office, but they made it seamless! Zero downtime, excellent coordination, and systematic labeling of all IT equipment and documents. Their specialized corporate moving team understood our priorities and delivered beyond expectations.",
    rating: 5,
    moveType: "Commercial Move",
    date: "February 2025",
    verified: true
  },
  {
    name: "Amit Kumar",
    location: "Chennai to Hyderabad",
    comment: "The international moving team was exceptional in handling our overseas relocation. From customs documentation to specialized packing for international shipping, everything was handled professionally. Their tracking system kept us informed throughout the journey.",
    rating: 5,
    moveType: "International Move",
    date: "December 2024",
    verified: true
  },
  {
    name: "Meera Singh",
    location: "Kolkata to Gurgaon",
    comment: "Their vehicle transportation service is top-notch! They safely delivered my luxury car across the country. The enclosed carrier and real-time tracking provided great peace of mind. The team was professional and punctual.",
    rating: 5,
    moveType: "Vehicle Transport",
    date: "February 2025",
    verified: true
  },
  {
    name: "Sanjay Gupta",
    location: "Pune to Ahmedabad",
    comment: "Used their storage solutions during our home renovation. The climate-controlled facility kept our belongings in perfect condition. Easy access, great security, and very helpful staff. Would highly recommend their storage services!",
    rating: 5,
    moveType: "Storage Service",
    date: "January 2025",
    verified: true
  }
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Customer Success Stories</h2>
          <p className="text-gray-600 text-lg">
            Join thousands of satisfied customers who trusted us with their moving needs
          </p>
          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="flex items-center">
              <ThumbsUp className="w-5 h-5 text-primary mr-2" />
              <span className="text-sm">98% Satisfaction Rate</span>
            </div>
            <div className="flex items-center">
              <Badge className="w-5 h-5 text-primary mr-2" />
              <span className="text-sm">Verified Reviews</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="space-y-4">
                <div className="flex items-center gap-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="w-10 h-10 text-primary/20" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6 italic">{testimonial.comment}</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <UserCircle2 className="w-10 h-10 text-gray-400" />
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {testimonial.name}
                        {testimonial.verified && (
                          <Badge className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{testimonial.moveType}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {testimonial.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {testimonial.date}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}