import { Metadata } from "next"
import Link from "next/link"
import { BranchCard } from "@/components/branch-card"
import { branches, companyInfo } from "@/data/branches"
import { PhoneIcon, MapPinIcon, MailIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Our Branches | Agrawal Packers and Movers",
  description: "Find Agrawal Packers and Movers branches across India. Professional moving services in all major cities with 24/7 customer support.",
  keywords: "packers movers branches, moving company locations, relocation services india, packers movers network"
}

export default function BranchesPage() {
  return (
    <div className="container mx-auto pt-24 px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Our Nationwide Network
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Professional packing and moving services across India with local expertise
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {branches.map((branch) => (
          <Link href={`/branches/${branch.id}`} key={branch.id}>
            <BranchCard {...branch} />
          </Link>
        ))}
      </div>

      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Why Choose Our Network?
          </h2>
          <p className="mt-2 text-gray-600">
            Pan-India presence with standardized quality service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Extensive Coverage</h3>
            <p className="text-gray-600">Serving all major cities and towns across India</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Unified Standards</h3>
            <p className="text-gray-600">Same high-quality service at all locations</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Local Expertise</h3>
            <p className="text-gray-600">Teams familiar with local areas and requirements</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-center gap-3 text-gray-700">
            <PhoneIcon className="h-6 w-6" />
            <span>{companyInfo.mainPhone}</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-700">
            <MailIcon className="h-6 w-6" />
            <span>{companyInfo.supportEmail}</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-700">
            <MapPinIcon className="h-6 w-6" />
            <span>Pan India Presence</span>
          </div>
        </div>
      </div>
    </div>
  )
} 