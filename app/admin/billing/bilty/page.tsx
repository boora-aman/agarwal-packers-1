import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BillingNav } from "@/app/admin/billing/components/billing-nav"
import BiltyList from "@/app/admin/billing/components/BiltyList"
import { cookies } from "next/headers"

async function getBilty() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/bilty`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 0 }
    })
    
    if (!response.ok) {
      console.error('Failed to fetch bills:', await response.text())
      return []
    }
    
    const data = await response.json()
    console.log('Server-side fetched bills:', data) // Debug log
    return data
  } catch (error) {
    console.error("Error fetching bills:", error)
    return []
  }
}

export default async function BiltyPage() {
  const initialBilty = await getBilty()

  return (
    <div className="container mx-auto px-4 pt-6 pb-8">
      <div className="mb-6">
        <BillingNav />
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Bilty</h1>
        <Button asChild>
          <Link href="/admin/billing/bilty/create">Create New Bilty</Link>
        </Button>
      </div>

      <BiltyList initialBilty={initialBilty} />
    </div>
  )
}