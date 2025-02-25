"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Cookies from "js-cookie"
import { Pencil, Download, Trash2, Receipt } from "lucide-react"

interface Receipt {
  _id: string
  mrNo: string
  date: string
  customerName: string
  fromCity: string
  biltyNo: string
  billNo: string
  NoPackage: string
  datebook: string
  cash: number
  cheque: number
  account: number
  rupeestext: string
  totalamount: number
}

export default function ReceiptList({ initialReceipts }: { initialReceipts: Receipt[] }) {
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts)
  const router = useRouter()

  // Refresh quotations periodically
  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const token = Cookies.get("token")
        const response = await fetch("/api/receipts", {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        })
        if (response.ok) {
          const data = await response.json()
          console.log('Client-side fetched receipts:', data) // Debug log
          setReceipts(data)
        }
      } catch (error) {
        console.error("Error fetching receipts:", error)
      }
    }

    // Initial fetch
    fetchReceipts()

    // Refresh every 30 seconds
    const interval = setInterval(fetchReceipts, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this receipt?")) return

    try {
      const token = Cookies.get("token")
      const response = await fetch(`/api/receipts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        setReceipts(receipts.filter(r => r._id !== id))
      }
    } catch (error) {
      console.error("Error deleting receipt:", error)
    }
  }

  const handleEdit = (receiptId: string) => {
    router.push(`/admin/billing/receipts/${receiptId}/edit`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {receipts.map((receipt) => (
          <Card key={receipt._id} className="border border-gray-200">
            <CardContent className="p-0">
              {/* Header */}
              <div className="bg-blue-500 text-white p-3 flex justify-between items-center rounded-t-lg">
                <h3 className="font-medium">#{receipt.mrNo} {receipt.customerName}</h3>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-blue-600" onClick={() => handleEdit(receipt._id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-blue-600" onClick={() => router.push(`/admin/billing/receipts/${receipt._id}/download`)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-blue-600" onClick={() => handleDelete(receipt._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Receipt details with icon */}
              <div className="p-3 flex items-center border-b">
                <Receipt className="h-5 w-5 mr-2 text-gray-500" />
                <span className="font-medium">Bilty No: {receipt.biltyNo}</span>
                <div className="ml-auto text-sm text-gray-500">Bill No: {receipt.billNo}</div>
              </div>

              {/* Payment details */}
              <div className="p-3 text-sm">
                <div className="flex justify-between">
                  <div>From: {receipt.fromCity}</div>
                  <div>{formatDate(receipt.date)}</div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-gray-600">
                  <div>Cash: ₹{receipt.cash}</div>
                  <div>Cheque: ₹{receipt.cheque}</div>
                  <div>Account: ₹{receipt.account}</div>
                </div>
                <div className="mt-2 font-medium">Total: ₹{receipt.totalamount}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 