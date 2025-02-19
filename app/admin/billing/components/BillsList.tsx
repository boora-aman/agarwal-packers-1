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

interface Bill {
  _id: string
  billNo: string
  date: string
  customerName: string
  mobileNo: string
  fromCity: string
  toCity: string
  weight: string
  distance: string
  ClientGst: string
  StateCode: string
  biltyNo: string
  NoPackage: string
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Bill No</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>Mobile</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bills.map((bill) => (
          <TableRow key={bill._id}>
            <TableCell>{bill.billNo}</TableCell>
            <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
            <TableCell>{bill.customerName}</TableCell>
            <TableCell>{bill.mobileNo}</TableCell>
            <TableCell>{bill.fromCity}</TableCell>
            <TableCell>{bill.toCity}</TableCell>
            <TableCell>₹{bill.totalAmount}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(bill._id)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/billing/bills/${bill._id}/download`)}
                >
                  Download
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(bill._id)}
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