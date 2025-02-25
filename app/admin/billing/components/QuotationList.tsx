"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Cookies from "js-cookie"
import { Pencil, Download, Trash2, Car } from "lucide-react"

interface Quotation {
  _id: string
  quotationNo: string
  date: string
  customerName: string
  mobileNo: string
  fromCity: string
  toCity: string
  vehicleType: string
  totalAmount: number
}

export default function QuotationList({ initialQuotations }: { initialQuotations: Quotation[] }) {
  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations)
  const router = useRouter()

  // Refresh quotations periodically
  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const token = Cookies.get("token")
        const response = await fetch("/api/quotations", {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        })
        if (response.ok) {
          const data = await response.json()
          console.log('Client-side fetched quotations:', data) // Debug log
          setQuotations(data)
        }
      } catch (error) {
        console.error("Error fetching quotations:", error)
      }
    }

    // Initial fetch
    fetchQuotations()

    // Refresh every 30 seconds
    const interval = setInterval(fetchQuotations, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quotation?")) return

    try {
      const token = Cookies.get("token")
      const response = await fetch(`/api/quotations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        setQuotations(quotations.filter(q => q._id !== id))
      }
    } catch (error) {
      console.error("Error deleting quotation:", error)
    }
  }

  const handleEdit = (quotationId: string) => {
    router.push(`/admin/billing/quotations/${quotationId}/edit`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-4">

      {/* Mobile view cards */}
      <div className="grid gap-4">
        {quotations.map((quotation) => (
          <Card key={quotation._id} className="border border-gray-200">
            <CardContent className="p-0">
              {/* Header - Like the red card in image 3 */}
              <div className="bg-orange-400 text-white p-3 flex justify-between items-center rounded-t-lg">
                <h3 className="font-medium">#{quotation.quotationNo} {quotation.customerName}</h3>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-red-600" onClick={() => handleEdit(quotation._id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-red-600" onClick={() => router.push(`/admin/billing/quotations/${quotation._id}/download`)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-red-600" onClick={() => handleDelete(quotation._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Transport details with vehicle icon */}
              <div className="p-3 flex items-center border-b">
                <Car className="h-5 w-5 mr-2 text-gray-500" />
                <span className="font-medium">{quotation.vehicleType}</span>
                <div className="ml-auto text-sm text-gray-500">{quotation.mobileNo}</div>
              </div>

              {/* Transport route details */}
              <div className="p-3 text-sm">
                <div className="flex justify-between">
                  <div>{quotation.fromCity} - {quotation.toCity}</div>
                  <div>{formatDate(quotation.date)}</div>
                </div>
                {quotation.totalAmount > 0 && (
                  <div className="mt-1 font-medium">₹{quotation.totalAmount}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}