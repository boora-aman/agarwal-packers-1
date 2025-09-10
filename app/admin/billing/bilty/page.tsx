"use client"

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { BillingNav } from "@/app/admin/billing/components/billing-nav";
import BiltyList from "@/app/admin/billing/components/BiltyList";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import Cookies from "js-cookie";

const defaultPagination = {
  page: 1,
  limit: 10,
  totalCount: 0,
  hasMore: false,
  totalPages: 0
};

export default function BiltyPage() {
  const [bilty, setBilty] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchBilty = useCallback(async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      setError(null);

      const token = Cookies.get("token");
      if (!token) {
        setError("Authentication required. Please login again.");
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`/api/bilty?page=${page}&limit=10`, {
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
      
      if (Array.isArray(data)) {
        if (append) {
          setBilty(prev => [...prev, ...data]);
        } else {
          setBilty(data);
        }
        setPagination({
          page: 1,
          limit: 10,
          totalCount: data.length,
          hasMore: false,
          totalPages: 1
        });
      } else if (data.bilties && data.pagination) {
        if (append) {
          setBilty(prev => [...prev, ...data.bilties]);
        } else {
          setBilty(data.bilties);
        }
        setPagination(data.pagination);
      }

      setRetryCount(0);
      
    } catch (error) {
      console.error("Error fetching bilty:", error);
      
      if (error.name === 'AbortError') {
        setError("Request timed out. The server is taking too long to respond.");
      } else if (error.message.includes('401')) {
        setError("Authentication expired. Please login again.");
      } else {
        setError(`Failed to load bilty: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBilty();
  }, [fetchBilty]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchBilty();
  };

  const loadMore = () => {
    if (pagination.hasMore && !loading) {
      fetchBilty(pagination.page + 1, true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Bilty Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your bilty records
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                asChild 
                className="w-full sm:w-auto justify-center sm:justify-start"
                size="default"
              >
                <Link href="/admin/billing/bilty/create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create New Bilty</span>
                  <span className="sm:hidden">Create Bilty</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <BillingNav />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Bilty List</h2>
                <p className="text-sm text-gray-600">
                  {loading && bilty.length === 0 ? (
                    "Loading bilty records..."
                  ) : error ? (
                    "Error loading bilty"
                  ) : (
                    `Total: ${pagination.totalCount} bilty records`
                  )}
                </p>
              </div>
              
              {!loading && !error && (
                <div className="flex gap-4 text-sm text-gray-500 sm:hidden">
                  <span>Page {pagination.page}</span>
                  <span>•</span>
                  <span>{bilty.length} loaded</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            {loading && bilty.length === 0 && (
              <div className="text-center py-12">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-600" />
                <p className="mt-2 text-gray-600">Loading bilty records...</p>
              </div>
            )}

            {error && bilty.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load bilty</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={handleRetry} variant="outline">
                  Try Again {retryCount > 0 && `(${retryCount})`}
                </Button>
              </div>
            )}

            {!error && bilty.length > 0 && (
              <BiltyList 
                initialBilty={bilty}
                initialPagination={pagination}
              />
            )}

            {pagination.hasMore && bilty.length > 0 && (
              <div className="mt-6 text-center">
                <Button 
                  onClick={loadMore}
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
                    `Load More Bilty (${pagination.totalCount - bilty.length} remaining)`
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
