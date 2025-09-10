"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Download, Trash2, Receipt as ReceiptIcon } from "lucide-react"
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
  rupeestext: string
  totalamount: number
}

interface Pagination {
  page: number
  limit: number
  totalCount: number
  hasMore: boolean
  totalPages: number
}

interface ReceiptListProps {
  initialReceipts: Receipt[]
  initialPagination: Pagination
}

export default function ReceiptList({ 
  initialReceipts, 
  initialPagination
}: ReceiptListProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this receipt?")) return

    try {
      const token = Cookies.get("token")
      const response = await fetch(`/api/receipts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert("Failed to delete receipt")
      }
    } catch (error) {
      console.error("Error deleting receipt:", error)
      alert("Failed to delete receipt")
    }
  }

  const handleEdit = (receiptId: string) => {
    router.push(`/admin/billing/receipts/${receiptId}/edit`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN')
  }

  if (initialReceipts.length === 0) {
    return (
      <div className="text-center py-12">
        <ReceiptIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No receipts found</h3>
        <p className="text-gray-500 mb-4">Create your first receipt to get started.</p>
        <Button asChild className="w-full sm:w-auto">
          <a href="/admin/billing/receipts/create">Create New Receipt</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Receipts count info */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg gap-2">
        <span>Showing {initialReceipts.length} of {initialPagination.totalCount} receipts</span>
        <span className="sm:text-right">Page {initialPagination.page} of {initialPagination.totalPages}</span>
      </div>

      {/* Receipts Grid */}
      <div className="grid gap-3 sm:gap-4">
        {initialReceipts.map((receipt) => (
          <Card key={receipt._id} className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              {/* Header - Purple background for receipts */}
              <div className="bg-purple-500 text-white p-3 sm:p-4 flex justify-between items-center rounded-t-lg">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base truncate">
                    #{receipt.mrNo}
                  </h3>
                  <p className="text-purple-100 text-xs sm:text-sm truncate">
                    {receipt.customerName}
                  </p>
                </div>
                
                <div className="flex space-x-1 sm:space-x-2 ml-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-purple-600 flex-shrink-0" 
                    onClick={() => handleEdit(receipt._id)}
                  >
                    <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-purple-600 flex-shrink-0" 
                    onClick={() => router.push(`/admin/billing/receipts/${receipt._id}/download`)}
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-purple-600 flex-shrink-0" 
                    onClick={() => handleDelete(receipt._id)}
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              {/* Receipt Details */}
              <div className="p-3 sm:p-4">
                <div className="flex items-start gap-3 mb-3">
                  <ReceiptIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="truncate">
                        <span className="font-medium text-gray-700">Bilty:</span> {receipt.biltyNo}
                      </div>
                      <div className="truncate">
                        <span className="font-medium text-gray-700">Bill:</span> {receipt.billNo}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-gray-600 mb-2">
                  <div className="truncate">
                    <span className="font-medium">From:</span> {receipt.fromCity}
                  </div>
                  <div className="text-right sm:text-left">
                    {formatDate(receipt.date)}
                  </div>
                </div>

                {receipt.totalamount > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                      <span className="text-lg font-bold text-purple-600">
                        ₹{receipt.totalamount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
