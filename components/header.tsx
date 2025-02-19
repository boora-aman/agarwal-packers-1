"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Phone, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Branches", href: "/branches" },
  { name: "Track Shipment", href: "/track" },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">Agrawal Packers & Movers India</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-gray-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button size="sm" className="gap-2">
              <Phone className="w-4 h-4" />
              <Link href="/contact">
                <span>Get Quote</span>
              </Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button size="sm" className="gap-2">
              <Phone className="w-4 h-4" />
              <Link href="tel:+919368108590">
                <span>Get Quote</span>
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

