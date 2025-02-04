"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Quotation", href: "/admin/billing/quotations" },
  { name: "Bill", href: "/admin/billing/bills" },
  { name: "LR", href: "/admin/billing/lr" },
  { name: "Money Receipt", href: "/admin/billing/receipts" },
]

export function BillingNav() {
  const pathname = usePathname()

  return (
    <nav className="flex space-x-4 border-b pb-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg",
            pathname.startsWith(item.href)
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted",
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}

