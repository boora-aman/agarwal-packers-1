import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
]

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Agarwal Packers and Movers</h3>
            <p className="mb-4">Your trusted partner for all relocation needs across India.</p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a key={link.name} href={link.href} className="hover:text-white" aria-label={link.name}>
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="hover:text-white">
                  House Relocation
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Office Relocation
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Vehicle Transportation
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Packing and Unpacking
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Storage Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <span>+91 9368108590</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <a href="mailto:info@agarwalpackersnmovers.in" className="hover:text-white">
                  info@agarwalpackersnmovers.in
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-1" />
                <span>175, EC Road, Race Course, Dehradun, Uttarakhand 248001, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Agarwal Packers and Movers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

