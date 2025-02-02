import ContactSection from "@/components/contact-section"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <main className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          We're here to assist you with all your relocation needs. Get in touch with us for a free quote or any
          inquiries about our services.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-6">Our Office</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600">
                    175, EC Road, Race Course, Dehradun, Uttarakhand 248001, India
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600">+91 9368108590</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">info@agarwalpackersnmovers.in</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Business Hours</h3>
                  <p className="text-gray-600">
                    Monday - Saturday: 9:00 AM - 6:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[400px] bg-gray-200 rounded-lg">
            {/* Replace this div with an actual map component or embed a Google Map here */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">Map placeholder</div>
          </div>
        </div>

        <ContactSection />
      </div>
    </main>
  )
}

