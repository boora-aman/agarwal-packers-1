"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Cookies from "js-cookie"
import { Pencil } from "lucide-react"
import { Download, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Car } from "lucide-react"

interface Bilty {
  _id: string
  biltyNo: string
  date: string
  senderName: string
  fromContactNo: string
  fromCity: string
  toCity: string
  totalAmount: number
  vehicleType: string
  mobileNo: string
}

export default function BiltyList({ initialBilty }: { initialBilty: Bilty[] }) {
  const [bilty, setBilty] = useState<Bilty[]>(initialBilty)
  const router = useRouter()

  // Refresh quotations periodically
  useEffect(() => {
    const fetchBilty = async () => {
      try {
        const token = Cookies.get("token")
        const response = await fetch("/api/bilty", {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        })
        if (response.ok) {
          const data = await response.json()
          console.log('Client-side fetched bilty:', data) // Debug log
          setBilty(data)
        }
      } catch (error) {
        console.error("Error fetching bilty:", error)
      }
    }

    // Initial fetch
    fetchBilty()

    // Refresh every 30 seconds
    const interval = setInterval(fetchBilty, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bilty?")) return

    try {
      const token = Cookies.get("token")
      const response = await fetch(`/api/bilty/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        setBilty(bilty.filter(b => b._id !== id))
      }
    } catch (error) {
      console.error("Error deleting bilty:", error)
    }
  }

  const handleEdit = (biltyId: string) => {
    router.push(`/admin/billing/bilty/${biltyId}/edit`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-4">

      {/* Mobile view cards */}
      <div className="grid gap-4">
        {bilty.map((bilty) => (
          <Card key={bilty._id} className="border border-gray-400">
            <CardContent className="p-0">
              {/* Header - Like the red card in image 3 */}
              <div className="bg-red-500 text-white p-3 flex justify-between items-center rounded-t-lg">
                <h3 className="font-medium">#{bilty.biltyNo} {bilty.senderName}</h3>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-red-600" onClick={() => handleEdit(bilty._id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-red-600" onClick={() => router.push(`/admin/billing/bilty/${bilty._id}/download`)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-red-600" onClick={() => handleDelete(bilty._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Transport details with vehicle icon */}
              <div className="p-3 flex items-center border-b">
                <Car className="h-5 w-5 mr-2 text-gray-500" />
                <span className="font-medium">{bilty.vehicleType}</span>
                <div className="ml-auto text-sm text-gray-500">{bilty.fromContactNo}</div>
              </div>

              {/* Transport route details */}
              <div className="p-3 text-sm">
                <div className="flex justify-between">
                  <div>{bilty.fromCity} - {bilty.toCity}</div>
                  <div>{formatDate(bilty.date)}</div>
                </div>
                {bilty.totalAmount > 0 && (
                  <div className="mt-1 font-medium">₹{bilty.totalAmount}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}