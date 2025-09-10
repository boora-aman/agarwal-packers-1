"use client"

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { BillingNav } from "@/app/admin/billing/components/billing-nav";
import BillsList from "@/app/admin/billing/components/BillsList";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import Cookies from "js-cookie";

interface Bill {
  _id: string;
  billNo: string;
  date: string;
  customerName: string;
  mobileNo: string;
  fromCity: string;
  toCity: string;
  ClientGst: string;
  totalAmount: number;
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  hasMore: boolean;
  totalPages: number;
}

const defaultPagination: Pagination = {
  page: 1,
  limit: 10,
  totalCount: 0,
  hasMore: false,
  totalPages: 0
};

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [pagination, setPagination] = useState<Pagination>(defaultPagination);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchBills = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) setLoading(true);
      setError(null);

      const token = Cookies.get("token");
      if (!token) {
        setError("Authentication required. Please login again.");
        return;
      }

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      console.log(`Fetching bills - page: ${page}, append: ${append}`);
      
      const response = await fetch(`/api/bills?page=${page}&limit=10`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Successfully fetched bills:', data);
      
      // Handle both response formats
      if (Array.isArray(data)) {
        // Old format
        if (append) {
          setBills(prevBills => [...prevBills, ...data]);
        } else {
          setBills(data);
        }
        setPagination({
          page: 1,
          limit: 10,
          totalCount: data.length,
          hasMore: false,
          totalPages: 1
        });
      } else if (data.bills && data.pagination) {
        // New paginated format
        if (append) {
          setBills(prevBills => [...prevBills, ...data.bills]);
        } else {
          setBills(data.bills);
        }
        setPagination(data.pagination);
      } else {
        throw new Error("Invalid response format from server");
      }

      setRetryCount(0); // Reset retry count on success
      
    } catch (error: any) {
      console.error("Error fetching bills:", error);
      
      if (error.name === 'AbortError') {
        setError("Request timed out. The server is taking too long to respond.");
      } else if (error.message.includes('401')) {
        setError("Authentication expired. Please login again.");
      } else if (error.message.includes('500')) {
        setError("Server error. Please try again in a moment.");
      } else {
        setError(`Failed to load bills: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchBills();
  };

  const loadMoreBills = () => {
    if (pagination.hasMore && !loading) {
      fetchBills(pagination.page + 1, true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Bills Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your billing records
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                asChild 
                className="w-full sm:w-auto justify-center sm:justify-start"
                size="default"
              >
                <Link href="/admin/billing/bills/create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create New Bill</span>
                  <span className="sm:hidden">Create Bill</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="mb-6">
          <BillingNav />
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Card Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Bills List</h2>
                <p className="text-sm text-gray-600">
                  {loading && bills.length === 0 ? (
                    "Loading bills..."
                  ) : error ? (
                    "Error loading bills"
                  ) : (
                    `Total: ${pagination.totalCount} bills`
                  )}
                </p>
              </div>
              
              {/* Mobile stats */}
              {!loading && !error && (
                <div className="flex gap-4 text-sm text-gray-500 sm:hidden">
                  <span>Page {pagination.page}</span>
                  <span>•</span>
                  <span>{bills.length} loaded</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Card Content */}
          <div className="p-4 sm:p-6">
            {/* Loading State */}
            {loading && bills.length === 0 && (
              <div className="text-center py-12">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-600" />
                <p className="mt-2 text-gray-600">Loading bills...</p>
                <p className="mt-1 text-sm text-gray-500">
                  This may take a moment in production
                </p>
              </div>
            )}

            {/* Error State */}
            {error && bills.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load bills</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <div className="space-y-2">
                  <Button onClick={handleRetry} variant="outline">
                    Try Again {retryCount > 0 && `(${retryCount})`}
                  </Button>
                  <p className="text-sm text-gray-500">
                    If this persists, check your internet connection
                  </p>
                </div>
              </div>
            )}

            {/* Bills List */}
            {!error && bills.length > 0 && (
              <BillsList 
                initialBills={bills}
                initialPagination={pagination}
                onLoadMore={loadMoreBills}
                loading={loading}
              />
            )}

            {/* Load More Button */}
            {pagination.hasMore && bills.length > 0 && (
              <div className="mt-6 text-center">
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
                      Load More Bills ({pagination.totalCount - bills.length} remaining)
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* End of Results */}
            {!pagination.hasMore && bills.length > 0 && pagination.totalCount > 10 && (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">You've reached the end of the bills list</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="h-20 sm:h-8"></div>
      </div>
    </div>
  );
}
