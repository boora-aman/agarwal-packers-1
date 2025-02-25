"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Quotation", href: "/admin/billing/quotations" },
  { name: "Bill", href: "/admin/billing/bills" },
  { name: "Bilty", href: "/admin/billing/bilty" },
  { name: "Money Receipt", href: "/admin/billing/receipts" },
  
]

export function BillingNav() {
  const pathname = usePathname()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  // Check scroll position
  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current
      if (!container) return

      setShowLeftArrow(container.scrollLeft > 0)
      setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth - 5)
    }

    const container = scrollContainerRef.current
    if (container) {
      checkScroll()
      container.addEventListener("scroll", checkScroll)
      window.addEventListener("resize", checkScroll)

      return () => {
        container.removeEventListener("scroll", checkScroll)
        window.removeEventListener("resize", checkScroll)
      }
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 200
    container.scrollTo({
      left: container.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount),
      behavior: "smooth",
    })
  }

  return (
    <div className="relative mb-6">
      {/* Navigation with Scroll Buttons - Always visible */}
      <div className="flex items-center border-b pb-4 relative">
        {/* Left scroll button */}
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 z-10 h-7 w-7 bg-background shadow-md"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Scrollable navigation */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto w-full pr-8 pl-8 scrollbar-hide scroll-smooth space-x-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                "hover:bg-muted hover:text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                pathname.startsWith(item.href) ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right scroll button */}
        {showRightArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 z-10 h-7 w-7 bg-background shadow-md"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
