"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Truck } from "lucide-react"
import Cookies from "js-cookie"
import { useState } from "react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      // Clear all possible auth tokens/cookies
      Cookies.remove("token")
      Cookies.remove("adminLoggedIn")
      Cookies.remove("admin_token")
      localStorage.removeItem("token")
      sessionStorage.clear()
      
      router.refresh()
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-6 w-6" />
              Consignment Tracking
            </CardTitle>
            <CardDescription>Manage and track shipment consignments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">View, add, and update consignment details and tracking information.</p>
            <Button onClick={() => router.push("/admin/consignment")} className="w-full">
              Go to Consignment Tracking
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Billing Management
            </CardTitle>
            <CardDescription>Generate and manage billing documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Create and manage bills, quotations, and receipts for customers.</p>
            <Button onClick={() => router.push("/admin/billing/quotations")} className="w-full">
              Go to Billing Management
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

