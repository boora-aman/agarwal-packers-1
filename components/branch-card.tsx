"use client"

import { MapPinIcon, PhoneIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import type { Branch } from "@/types/branch"

interface BranchCardProps extends Pick<Branch, 'id' | 'city' | 'address' | 'phone' | 'email' | 'timings'> {}

export function BranchCard({ id, city, address, phone, email, timings }: BranchCardProps) {
  const router = useRouter()

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer h-full" 
      onClick={() => router.push(`/branches/${id}`)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-primary" />
          {city}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{address}</p>
          <div className="space-y-2">
            <p className="text-sm flex items-center gap-2">
              <PhoneIcon className="h-4 w-4" />
              {phone}
            </p>
            <p className="text-sm">{email}</p>
            <p className="text-xs text-gray-500">{timings}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 