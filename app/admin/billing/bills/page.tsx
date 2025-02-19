import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BillingNav } from "@/app/admin/billing/components/billing-nav"
import BillsList from "@/app/admin/billing/components/BillsList"
import { cookies } from "next/headers"

async function getBills() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/quotations`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 0 }
    })
    
    if (!response.ok) {
      console.error('Failed to fetch quotations:', await response.text())
      return []
    }
    
    const data = await response.json()
    console.log('Server-side fetched quotations:', data) // Debug log
    return data
  } catch (error) {
    console.error("Error fetching quotations:", error)
    return []
  }
}

export default async function BillsPage() {
  const initialBills = await getBills()

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="mb-6">
        <BillingNav />
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Bills</h1>
        <Button asChild>
          <Link href="/admin/billing/bills/create">Create New Bill</Link>
        </Button>
      </div>

      <BillsList initialBills={initialBills} />
    </div>
  )
}