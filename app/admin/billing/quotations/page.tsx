import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BillingNav } from "@/app/admin/billing/components/billing-nav";
import QuotationsList from "@/app/admin/billing/components/QuotationList";
import { cookies } from "next/headers";
import { Plus } from "lucide-react";

// Default fallback data structure
const defaultData = {
  quotations: [],
  pagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    hasMore: false,
    totalPages: 0
  }
};

async function getInitialQuotations() {
  try {
    console.log("Server: Starting to fetch initial quotations...");
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      console.log("Server: No token found for quotations");
      return defaultData;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/quotations?page=1&limit=10`;
    console.log("Server: Fetching quotations from:", apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      },
      next: { revalidate: 0 }
    });

    console.log("Server: Quotations response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server: Failed to fetch quotations:', response.status, errorText);
      return defaultData;
    }

    const data = await response.json();
    console.log('Server: Successfully fetched quotations data:', data);
    
    // Validate the response structure
    if (!data || typeof data !== 'object') {
      console.error('Server: Invalid quotations response format:', data);
      return defaultData;
    }

    // Handle both old format (array) and new format (object with quotations and pagination)
    if (Array.isArray(data)) {
      console.log('Server: Received old quotations format (array), converting...');
      return {
        quotations: data,
        pagination: {
          page: 1,
          limit: 10,
          totalCount: data.length,
          hasMore: false,
          totalPages: 1
        }
      };
    }

    // New paginated format
    const result = {
      quotations: Array.isArray(data.quotations) ? data.quotations : [],
      pagination: {
        page: data.pagination?.page || 1,
        limit: data.pagination?.limit || 10,
        totalCount: data.pagination?.totalCount || 0,
        hasMore: data.pagination?.hasMore || false,
        totalPages: data.pagination?.totalPages || 0
      }
    };

    console.log('Server: Final processed quotations data:', result);
    return result;

  } catch (error) {
    console.error("Server: Error fetching quotations:", error);
    return defaultData;
  }
}

export default async function QuotationsPage() {
  console.log("Server: Rendering QuotationsPage...");
  const initialData = await getInitialQuotations();
  
  console.log("Server: Passing quotations to QuotationsList:", {
    quotationsCount: initialData.quotations.length,
    pagination: initialData.pagination
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-first responsive container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Responsive Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Quotations Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your quotation records
              </p>
            </div>
            
            {/* Mobile-optimized Create Button */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                asChild 
                className="w-full sm:w-auto justify-center sm:justify-start"
                size="default"
              >
                <Link href="/admin/billing/quotations/create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create New Quotation</span>
                  <span className="sm:hidden">Create Quotation</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Navigation - Mobile Responsive */}
        <div className="mb-6">
          <BillingNav />
        </div>
        
        {/* Main Content - Mobile Responsive Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Card Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Quotations List</h2>
                <p className="text-sm text-gray-600">
                  Total: {initialData.pagination.totalCount} quotations
                </p>
              </div>
              
              {/* Mobile stats */}
              <div className="flex gap-4 text-sm text-gray-500 sm:hidden">
                <span>Page {initialData.pagination.page}</span>
                <span>•</span>
                <span>{initialData.quotations.length} loaded</span>
              </div>
            </div>
          </div>
          
          {/* Card Content */}
          <div className="p-4 sm:p-6">
            <QuotationsList 
              initialQuotations={initialData.quotations}
              initialPagination={initialData.pagination}
            />
          </div>
        </div>
        
        {/* Mobile-friendly footer space */}
        <div className="h-20 sm:h-8"></div>
      </div>
    </div>
  );
}
