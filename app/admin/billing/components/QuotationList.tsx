"use client"

import { useState } from "react"
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

export default function QuotationList({ quotations: initialQuotations }) {
  const [quotations, setQuotations] = useState(initialQuotations)
  const router = useRouter()

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Quotation No</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>Mobile</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Vehicle Type</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quotations.map((quotation) => (
          <TableRow key={quotation._id}>
            <TableCell>{quotation.quotationNo}</TableCell>
            <TableCell>{new Date(quotation.date).toLocaleDateString()}</TableCell>
            <TableCell>{quotation.customerName}</TableCell>
            <TableCell>{quotation.mobileNo}</TableCell>
            <TableCell>{quotation.fromCity}</TableCell>
            <TableCell>{quotation.toCity}</TableCell>
            <TableCell>{quotation.vehicleType}</TableCell>
            <TableCell>₹{quotation.totalAmount}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(quotation._id)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/billing/quotations/${quotation._id}/download`)}
                >
                  Download
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(quotation._id)}
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