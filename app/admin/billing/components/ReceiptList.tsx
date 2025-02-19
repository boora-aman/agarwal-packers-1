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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Receipt No</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>From</TableHead>
          <TableHead>Bilty No</TableHead>
          <TableHead>Bill No</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {receipts.map((receipt) => (
          <TableRow key={receipt._id}>
            <TableCell>{receipt.mrNo}</TableCell>
            <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
            <TableCell>{receipt.customerName}</TableCell>
            <TableCell>{receipt.fromCity}</TableCell>
            <TableCell>{receipt.biltyNo}</TableCell>
            <TableCell>{receipt.billNo}</TableCell>
            <TableCell>₹{receipt.totalamount}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(receipt._id)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/billing/receipts/${receipt._id}/download`)}
                >
                  Download
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(receipt._id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 