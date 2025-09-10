"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Cookies from "js-cookie"
import { Pencil, Download, Trash2, FileText, Loader2, AlertCircle } from "lucide-react"

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
}

// Default pagination to prevent undefined errors
const defaultPagination: Pagination = {
  page: 1,
  limit: 10,
  totalCount: 0,
  hasMore: false,
  totalPages: 0
}

export default function BillsList({ 
  initialBills = [], 
  initialPagination = defaultPagination 
}: BillsListProps) {
  const [bills, setBills] = useState<Bill[]>(initialBills)
  const [pagination, setPagination] = useState<Pagination>(initialPagination)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  console.log('BillsList initialized with:', {
    billsCount: bills.length,
    pagination: pagination
  });

  // Function to fetch bills with pagination
  const fetchBills = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      console.log(`Fetching bills - page: ${page}, append: ${append}`);
      const token = Cookies.get("token")
      const response = await fetch(`/api/bills?page=${page}&limit=10`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      })

      console.log('Fetch response status:', response.status);

      if (response.ok) {
        const data = await response.json()
        console.log('Client-side fetched bills data:', data)
        
        // Handle both old and new response formats
        if (Array.isArray(data)) {
          // Old format - just an array of bills
          console.log('Received old format, converting...');
          if (append) {
            setBills(prevBills => [...prevBills, ...data])
          } else {
            setBills(data)
          }
          setPagination({
            page: 1,
            limit: 10,
            totalCount: data.length,
            hasMore: false,
            totalPages: 1
          })
        } else if (data.bills && data.pagination) {
          // New format - paginated response
          console.log('Received new format');
          if (append) {
            setBills(prevBills => [...prevBills, ...data.bills])
          } else {
            setBills(data.bills)
          }
          setPagination(data.pagination)
        } else {
          console.error('Unexpected response format:', data);
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch bills:', response.status, errorText)
        setError(`Failed to fetch bills: ${response.status}`)
      }
    } catch (error) {
      console.error("Error fetching bills:", error)
      setError("Network error while fetching bills")
    }
  }, [])

  // Load more bills
  const loadMoreBills = useCallback(async () => {
    if (loading || !pagination?.hasMore) return

    console.log('Loading more bills...');
    setLoading(true)
    setError(null)

    try {
      await fetchBills(pagination.page + 1, true)
    } catch (error) {
      setError("Failed to load more bills")
    } finally {
      setLoading(false)
    }
  }, [loading, pagination?.hasMore, pagination?.page, fetchBills])

  // Periodic refresh (only for the first page)
  useEffect(() => {
    console.log('Setting up periodic refresh...');
    const interval = setInterval(() => {
      console.log('Periodic refresh triggered');
      fetchBills(1, false) // Refresh first page only
    }, 30000)
    
    return () => {
      console.log('Clearing periodic refresh');
      clearInterval(interval)
    }
  }, [fetchBills])

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
        // Update pagination count
        setPagination(prev => ({
          ...prev,
          totalCount: Math.max(0, prev.totalCount - 1)
        }))
      }
    } catch (error) {
      console.error("Error deleting bill:", error)
    }
  }

  const handleEdit = (billId: string) => {
    router.push(`/admin/billing/bills/${billId}/edit`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN')
  }

  // Show error state
  if (error && bills.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading bills</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => fetchBills(1, false)} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  // Loading state
  if (!pagination && bills.length === 0) {
    return (
      <div className="text-center py-12">
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
        <p className="mt-2 text-gray-500">Loading bills...</p>
      </div>
    )
  }

  // No bills found
  if (bills.length === 0 && !loading) {
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
      {pagination && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg gap-2">
          <span>Showing {bills.length} of {pagination.totalCount} bills</span>
          <span className="sm:text-right">Page {pagination.page} of {pagination.totalPages}</span>
        </div>
      )}

      <div className="grid gap-3 sm:gap-4">
        {bills.map((bill) => (
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

              {/* Bill details with icon */}
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

                {/* Transport details */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-gray-600 mb-2">
                  <div className="truncate">
                    <span className="font-medium">Route:</span> {bill.fromCity} → {bill.toCity}
                  </div>
                  <div className="text-right sm:text-left">
                    {formatDate(bill.date)}
                  </div>
                </div>

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

      {/* Load More Button */}
      {pagination?.hasMore && (
        <div className="text-center py-6">
          <Button 
            onClick={loadMoreBills}
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
                <span className="sm:hidden">Load More ({pagination.totalCount - bills.length})</span>
                <span className="hidden sm:inline">Load More Bills ({pagination.totalCount - bills.length} remaining)</span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Error message for load more */}
      {error && bills.length > 0 && (
        <div className="text-center py-4">
          <p className="text-red-600 mb-2 text-sm">{error}</p>
          <Button 
            onClick={() => fetchBills(pagination.page + 1, true)}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* End of results */}
      {!pagination?.hasMore && bills.length > 0 && pagination.totalCount > 10 && (
        <div className="text-center py-6 text-gray-500">
          <p className="text-sm">You've reached the end of the bills list</p>
        </div>
      )}
    </div>
  )
}
