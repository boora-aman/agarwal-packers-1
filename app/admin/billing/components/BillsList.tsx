"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Download, Trash2, FileText } from "lucide-react"
import Cookies from "js-cookie"

interface Bill {
  _id: string
  billNo: string
  date: string
  customerName: string
  mobileNo: string
  fromCity: string
  toCity: string
  ClientGst: string
  totalAmount: number
}

interface Pagination {
  page: number
  limit: number
  totalCount: number
  hasMore: boolean
  totalPages: number
}

interface BillsListProps {
  initialBills: Bill[]
  initialPagination: Pagination
  onLoadMore?: () => void
  loading?: boolean
}

export default function BillsList({ 
  initialBills, 
  initialPagination,
  onLoadMore,
  loading = false
}: BillsListProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bill?")) return

    try {
      const token = Cookies.get("token")
      const response = await fetch(`/api/bills/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        // Refresh the page to update the list
        window.location.reload()
      } else {
        alert("Failed to delete bill")
      }
    } catch (error) {
      console.error("Error deleting bill:", error)
      alert("Failed to delete bill")
    }
  }

  const handleEdit = (billId: string) => {
    router.push(`/admin/billing/bills/${billId}/edit`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN')
  }

  if (initialBills.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
        <p className="text-gray-500 mb-4">Create your first bill to get started.</p>
        <Button asChild className="w-full sm:w-auto">
          <a href="/admin/billing/bills/create">Create New Bill</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Bills count info */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg gap-2">
        <span>Showing {initialBills.length} of {initialPagination.totalCount} bills</span>
        <span className="sm:text-right">Page {initialPagination.page} of {initialPagination.totalPages}</span>
      </div>

      {/* Bills Grid */}
      <div className="grid gap-3 sm:gap-4">
        {initialBills.map((bill) => (
          <Card key={bill._id} className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              {/* Header */}
              <div className="bg-green-500 text-white p-3 sm:p-4 flex justify-between items-center rounded-t-lg">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base truncate">
                    #{bill.billNo}
                  </h3>
                  <p className="text-green-100 text-xs sm:text-sm truncate">
                    {bill.customerName}
                  </p>
                </div>
                
                <div className="flex space-x-1 sm:space-x-2 ml-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-green-600 flex-shrink-0" 
                    onClick={() => handleEdit(bill._id)}
                  >
                    <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-green-600 flex-shrink-0" 
                    onClick={() => router.push(`/admin/billing/bills/${bill._id}/download`)}
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-green-600 flex-shrink-0" 
                    onClick={() => handleDelete(bill._id)}
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              {/* Bill Details */}
              <div className="p-3 sm:p-4">
                <div className="flex items-start gap-3 mb-3">
                  <FileText className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="truncate">
                        <span className="font-medium text-gray-700">GST:</span> {bill.ClientGst}
                      </div>
                      <div className="truncate">
                        <span className="font-medium text-gray-700">Mobile:</span> {bill.mobileNo}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transport Details */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-gray-600 mb-2">
                  <div className="truncate">
                    <span className="font-medium">Route:</span> {bill.fromCity} → {bill.toCity}
                  </div>
                  <div className="text-right sm:text-left">
                    {formatDate(bill.date)}
                  </div>
                </div>

                {/* Total Amount */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                    <span className="text-lg font-bold text-green-600">
                      ₹{bill.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
