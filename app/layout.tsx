import { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import type React from "react" // Import React

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Agrawal Packers and Movers - Professional Moving & Relocation Services",
  description: "Trusted packers and movers in India offering comprehensive relocation services. Expert packing, moving, and storage solutions for homes and businesses.",
  keywords: "packers and movers, relocation services, moving company, house shifting, office relocation, vehicle transportation"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

