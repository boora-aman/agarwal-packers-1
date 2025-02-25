"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Cookies from "js-cookie"
import { Pencil, Download, Trash2, FileText } from "lucide-react"

interface Bill {
  _id: string
  billNo: string
  date: string
  customerName: string
  mobileNo: string
  fromCity: string
  toCity: string
  ClientGst: string
  StateCode: string
  biltyNo: string
  insPercentage: number
  insValue: number
  GstPercentage: number
  totalAmount: number
}

export default function BillsList({ initialBills }: { initialBills: Bill[] }) {
  const [bills, setBills] = useState<Bill[]>(initialBills)
  const router = useRouter()

  // Refresh quotations periodically
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = Cookies.get("token")
        const response = await fetch("/api/bills", {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        })
        if (response.ok) {
          const data = await response.json()
          console.log('Client-side fetched bills:', data) // Debug log
          setBills(data)
        }
      } catch (error) {
        console.error("Error fetching bills:", error)
      }
    }

    // Initial fetch
    fetchBills()

    // Refresh every 30 seconds
    const interval = setInterval(fetchBills, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bill?")) return

    try {
      const token = Cookies.get("token")
      const response = await fetch(`/api/bills/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        setBills(bills.filter(b => b._id !== id))
      }
    } catch (error) {
      console.error("Error deleting bill:", error)
    }
  }

  const handleEdit = (billId: string) => {
    router.push(`/admin/billing/bills/${billId}/edit`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {bills.map((bill) => (
          <Card key={bill._id} className="border border-gray-200">
            <CardContent className="p-0">
              {/* Header */}
              <div className="bg-green-500 text-white p-3 flex justify-between items-center rounded-t-lg">
                <h3 className="font-medium">#{bill.billNo} {bill.customerName}</h3>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-green-600" onClick={() => handleEdit(bill._id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-green-600" onClick={() => router.push(`/admin/billing/bills/${bill._id}/download`)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-green-600" onClick={() => handleDelete(bill._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Bill details with icon */}
              <div className="p-3 flex items-center border-b">
                <FileText className="h-5 w-5 mr-2 text-gray-500" />
                <span className="font-medium">GST: {bill.ClientGst}</span>
                <div className="ml-auto text-sm text-gray-500">{bill.mobileNo}</div>
              </div>

              {/* Transport details */}
              <div className="p-3 text-sm">
                <div className="flex justify-between">
                  <div>{bill.fromCity} - {bill.toCity}</div>
                  <div>{formatDate(bill.date)}</div>
                </div>
                <div className="mt-2 font-medium">Total: ₹{bill.totalAmount}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 