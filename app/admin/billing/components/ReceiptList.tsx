"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Cookies from "js-cookie"
import { Pencil, Download, Trash2, Receipt as ReceiptIcon, Loader2, AlertCircle, FileText } from "lucide-react"

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

// Default pagination to prevent undefined errors
const defaultPagination: Pagination = {
  page: 1,
  limit: 10,
  totalCount: 0,
  hasMore: false,
  totalPages: 0
}

export default function ReceiptList({ 
  initialReceipts = [], 
  initialPagination = defaultPagination 
}: ReceiptListProps) {
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts)
  const [pagination, setPagination] = useState<Pagination>(initialPagination)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  console.log('ReceiptList initialized with:', {
    receiptsCount: receipts.length,
    pagination: pagination
  });

  // Function to fetch receipts with pagination
  const fetchReceipts = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      console.log(`Fetching receipts - page: ${page}, append: ${append}`);
      const token = Cookies.get("token")
      const response = await fetch(`/api/receipts?page=${page}&limit=10`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      })

      console.log('Receipts fetch response status:', response.status);

      if (response.ok) {
        const data = await response.json()
        console.log('Client-side fetched receipts data:', data)
        
        // Handle both old and new response formats
        if (Array.isArray(data)) {
          // Old format - just an array of receipts
          console.log('Received old receipts format, converting...');
          if (append) {
            setReceipts(prevReceipts => [...prevReceipts, ...data])
          } else {
            setReceipts(data)
          }
          setPagination({
            page: 1,
            limit: 10,
            totalCount: data.length,
            hasMore: false,
            totalPages: 1
          })
        } else if (data.receipts && data.pagination) {
          // New format - paginated response
          console.log('Received new receipts format');
          if (append) {
            setReceipts(prevReceipts => [...prevReceipts, ...data.receipts])
          } else {
            setReceipts(data.receipts)
          }
          setPagination(data.pagination)
        } else {
          console.error('Unexpected receipts response format:', data);
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch receipts:', response.status, errorText)
        setError(`Failed to fetch receipts: ${response.status}`)
      }
    } catch (error) {
      console.error("Error fetching receipts:", error)
      setError("Network error while fetching receipts")
    }
  }, [])

  // Load more receipts
  const loadMoreReceipts = useCallback(async () => {
    if (loading || !pagination?.hasMore) return

    console.log('Loading more receipts...');
    setLoading(true)
    setError(null)

    try {
      await fetchReceipts(pagination.page + 1, true)
    } catch (error) {
      setError("Failed to load more receipts")
    } finally {
      setLoading(false)
    }
  }, [loading, pagination?.hasMore, pagination?.page, fetchReceipts])

  // Periodic refresh (only for the first page)
  useEffect(() => {
    console.log('Setting up receipts periodic refresh...');
    const interval = setInterval(() => {
      console.log('Receipts periodic refresh triggered');
      fetchReceipts(1, false) // Refresh first page only
    }, 30000)
    
    return () => {
      console.log('Clearing receipts periodic refresh');
      clearInterval(interval)
    }
  }, [fetchReceipts])

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
        // Update pagination count
        setPagination(prev => ({
          ...prev,
          totalCount: Math.max(0, prev.totalCount - 1)
        }))
      }
    } catch (error) {
      console.error("Error deleting receipt:", error)
    }
  }

  const handleEdit = (receiptId: string) => {
    router.push(`/admin/billing/receipts/${receiptId}/edit`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN')
  }

  // Show error state
  if (error && receipts.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading receipts</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => fetchReceipts(1, false)} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  // Loading state
  if (!pagination && receipts.length === 0) {
    return (
      <div className="text-center py-12">
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
        <p className="mt-2 text-gray-500">Loading receipts...</p>
      </div>
    )
  }

  // No receipts found
  if (receipts.length === 0 && !loading) {
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
      {/* Mobile-friendly receipts count info */}
      {pagination && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg gap-2">
          <span>Showing {receipts.length} of {pagination.totalCount} receipts</span>
          <span className="sm:text-right">Page {pagination.page} of {pagination.totalPages}</span>
        </div>
      )}

      {/* Mobile-optimized receipts grid */}
      <div className="grid gap-3 sm:gap-4">
        {receipts.map((receipt) => (
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
                
                {/* Mobile-optimized action buttons */}
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

              {/* Receipt details - Mobile responsive */}
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

                {/* Mobile-optimized route and date info */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-gray-600 mb-2">
                  <div className="truncate">
                    <span className="font-medium">From:</span> {receipt.fromCity}
                  </div>
                  <div className="text-right sm:text-left">
                    {formatDate(receipt.date)}
                  </div>
                </div>

                {/* Total amount - Mobile friendly */}
                {receipt.totalamount > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                      <span className="text-lg font-bold text-green-600">
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

      {/* Mobile-optimized Load More Button */}
      {pagination?.hasMore && (
        <div className="text-center py-6">
          <Button 
            onClick={loadMoreReceipts}
            disabled={loading}
            size="lg"
            className="w-full sm:w-auto sm:min-w-[200px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <span className="sm:hidden">Load More ({pagination.totalCount - receipts.length})</span>
                <span className="hidden sm:inline">Load More Receipts ({pagination.totalCount - receipts.length} remaining)</span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Error message for load more */}
      {error && receipts.length > 0 && (
        <div className="text-center py-4">
          <p className="text-red-600 mb-2 text-sm">{error}</p>
          <Button 
            onClick={() => fetchReceipts(pagination.page + 1, true)}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* End of results */}
      {!pagination?.hasMore && receipts.length > 0 && pagination.totalCount > 10 && (
        <div className="text-center py-6 text-gray-500">
          <p className="text-sm">You've reached the end of the receipts list</p>
        </div>
      )}
    </div>
  )
}
