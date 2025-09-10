"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Cookies from "js-cookie"
import { Pencil, Download, Trash2, Truck, Loader2, AlertCircle } from "lucide-react"

interface Bilty {
  _id: string
  biltyNo: string
  date: string
  senderName: string
  fromContactNo: string
  fromCity: string
  toCity: string
  totalAmount: number
  vehicleType: string
  mobileNo?: string
}

interface Pagination {
  page: number
  limit: number
  totalCount: number
  hasMore: boolean
  totalPages: number
}

interface BiltyListProps {
  initialBilty: Bilty[]
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

export default function BiltyList({ 
  initialBilty = [], 
  initialPagination = defaultPagination 
}: BiltyListProps) {
  const [bilty, setBilty] = useState<Bilty[]>(initialBilty)
  const [pagination, setPagination] = useState<Pagination>(initialPagination)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  console.log('BiltyList initialized with:', {
    biltyCount: bilty.length,
    pagination: pagination
  });

  // Function to fetch bilty with pagination
  const fetchBilty = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      console.log(`Fetching bilty - page: ${page}, append: ${append}`);
      const token = Cookies.get("token")
      const response = await fetch(`/api/bilty?page=${page}&limit=10`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      })

      console.log('Bilty fetch response status:', response.status);

      if (response.ok) {
        const data = await response.json()
        console.log('Client-side fetched bilty data:', data)
        
        // Handle both old and new response formats
        if (Array.isArray(data)) {
          // Old format - just an array of bilty
          console.log('Received old bilty format, converting...');
          if (append) {
            setBilty(prevBilty => [...prevBilty, ...data])
          } else {
            setBilty(data)
          }
          setPagination({
            page: 1,
            limit: 10,
            totalCount: data.length,
            hasMore: false,
            totalPages: 1
          })
        } else if (data.bilties && data.pagination) {
          // New format - paginated response
          console.log('Received new bilty format');
          if (append) {
            setBilty(prevBilty => [...prevBilty, ...data.bilties])
          } else {
            setBilty(data.bilties)
          }
          setPagination(data.pagination)
        } else {
          console.error('Unexpected bilty response format:', data);
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch bilty:', response.status, errorText)
        setError(`Failed to fetch bilty: ${response.status}`)
      }
    } catch (error) {
      console.error("Error fetching bilty:", error)
      setError("Network error while fetching bilty")
    }
  }, [])

  // Load more bilty
  const loadMoreBilty = useCallback(async () => {
    if (loading || !pagination?.hasMore) return

    console.log('Loading more bilty...');
    setLoading(true)
    setError(null)

    try {
      await fetchBilty(pagination.page + 1, true)
    } catch (error) {
      setError("Failed to load more bilty")
    } finally {
      setLoading(false)
    }
  }, [loading, pagination?.hasMore, pagination?.page, fetchBilty])

  // Periodic refresh (only for the first page)
  useEffect(() => {
    console.log('Setting up bilty periodic refresh...');
    const interval = setInterval(() => {
      console.log('Bilty periodic refresh triggered');
      fetchBilty(1, false) // Refresh first page only
    }, 30000)
    
    return () => {
      console.log('Clearing bilty periodic refresh');
      clearInterval(interval)
    }
  }, [fetchBilty])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bilty?")) return

    try {
      const token = Cookies.get("token")
      const response = await fetch(`/api/bilty/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        setBilty(bilty.filter(b => b._id !== id))
        // Update pagination count
        setPagination(prev => ({
          ...prev,
          totalCount: Math.max(0, prev.totalCount - 1)
        }))
      }
    } catch (error) {
      console.error("Error deleting bilty:", error)
    }
  }

  const handleEdit = (biltyId: string) => {
    router.push(`/admin/billing/bilty/${biltyId}/edit`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN')
  }

  // Show error state
  if (error && bilty.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading bilty</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => fetchBilty(1, false)} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  // Loading state
  if (!pagination && bilty.length === 0) {
    return (
      <div className="text-center py-12">
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
        <p className="mt-2 text-gray-500">Loading bilty...</p>
      </div>
    )
  }

  // No bilty found
  if (bilty.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <Truck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bilty found</h3>
        <p className="text-gray-500 mb-4">Create your first bilty to get started.</p>
        <Button asChild className="w-full sm:w-auto">
          <a href="/admin/billing/bilty/create">Create New Bilty</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Bilty count info */}
      {pagination && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg gap-2">
          <span>Showing {bilty.length} of {pagination.totalCount} bilty records</span>
          <span className="sm:text-right">Page {pagination.page} of {pagination.totalPages}</span>
        </div>
      )}

      <div className="grid gap-3 sm:gap-4">
        {bilty.map((biltyItem) => (
          <Card key={biltyItem._id} className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              {/* Header - Blue background for bilty */}
              <div className="bg-blue-500 text-white p-3 sm:p-4 flex justify-between items-center rounded-t-lg">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base truncate">
                    #{biltyItem.biltyNo}
                  </h3>
                  <p className="text-blue-100 text-xs sm:text-sm truncate">
                    {biltyItem.senderName}
                  </p>
                </div>
                
                <div className="flex space-x-1 sm:space-x-2 ml-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-blue-600 flex-shrink-0" 
                    onClick={() => handleEdit(biltyItem._id)}
                  >
                    <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-blue-600 flex-shrink-0" 
                    onClick={() => router.push(`/admin/billing/bilty/${biltyItem._id}/download`)}
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-blue-600 flex-shrink-0" 
                    onClick={() => handleDelete(biltyItem._id)}
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              {/* Transport details with vehicle icon */}
              <div className="p-3 sm:p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Truck className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="truncate">
                        <span className="font-medium text-gray-700">Vehicle:</span> {biltyItem.vehicleType}
                      </div>
                      <div className="truncate">
                        <span className="font-medium text-gray-700">Contact:</span> {biltyItem.fromContactNo || biltyItem.mobileNo}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transport route details */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-gray-600 mb-2">
                  <div className="truncate">
                    <span className="font-medium">Route:</span> {biltyItem.fromCity} → {biltyItem.toCity}
                  </div>
                  <div className="text-right sm:text-left">
                    {formatDate(biltyItem.date)}
                  </div>
                </div>

                {biltyItem.totalAmount > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                      <span className="text-lg font-bold text-blue-600">
                        ₹{biltyItem.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      {pagination?.hasMore && (
        <div className="text-center py-6">
          <Button 
            onClick={loadMoreBilty}
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
                <span className="sm:hidden">Load More ({pagination.totalCount - bilty.length})</span>
                <span className="hidden sm:inline">Load More Bilty ({pagination.totalCount - bilty.length} remaining)</span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Error message for load more */}
      {error && bilty.length > 0 && (
        <div className="text-center py-4">
          <p className="text-red-600 mb-2 text-sm">{error}</p>
          <Button 
            onClick={() => fetchBilty(pagination.page + 1, true)}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* End of results */}
      {!pagination?.hasMore && bilty.length > 0 && pagination.totalCount > 10 && (
        <div className="text-center py-6 text-gray-500">
          <p className="text-sm">You've reached the end of the bilty list</p>
        </div>
      )}
    </div>
  )
}
