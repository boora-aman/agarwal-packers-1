"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createQuotation } from "@/app/actions/quotation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateQuotationPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
  
    async function onSubmit(formData: FormData) {
      try {
        setLoading(true)
        setError("")
        console.log("Submitting form data")  // Debug log
        
        const result = await createQuotation(formData)
        console.log("Submission result:", result)  // Debug log
  
        if (result.success) {
          router.push("/admin/billing/quotations")
        } else {
          setError(result.error || "Failed to create quotation")
        }
      } catch (err) {
        console.error("Form submission error:", err)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Quotation</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quotationNo">Quotation No.</Label>
                <Input id="quotationNo" name="quotationNo" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Input id="vehicleType" name="vehicleType" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input id="customerName" name="customerName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNo">Mobile No.</Label>
                <Input id="mobileNo" name="mobileNo" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromCity">From City</Label>
                <Input id="fromCity" name="fromCity" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toCity">To City</Label>
                <Input id="toCity" name="toCity" required />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Charges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="freightCharges">Freight Charges</Label>
                  <Input id="freightCharges" name="freightCharges" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carTransportationCharges">Car Transportation</Label>
                  <Input id="carTransportationCharges" name="carTransportationCharges" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loadingCharges">Loading Charges</Label>
                  <Input id="loadingCharges" name="loadingCharges" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unloadingCharges">Unloading Charges</Label>
                  <Input id="unloadingCharges" name="unloadingCharges" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="packingCharges">Packing Charges</Label>
                  <Input id="packingCharges" name="packingCharges" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unpackingCharges">Unpacking Charges</Label>
                  <Input id="unpackingCharges" name="unpackingCharges" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="installationCharges">Installation Charges</Label>
                  <Input id="installationCharges" name="installationCharges" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stationeryCharges">Stationery Charges</Label>
                  <Input id="stationeryCharges" name="stationeryCharges" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tollCharges">Toll Charges (7%)</Label>
                  <Input id="tollCharges" name="tollCharges" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstCharges">GST Charges (18%)</Label>
                  <Input id="gstCharges" name="gstCharges" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceCharges">Insurance Charges (3%)</Label>
                  <Input id="insuranceCharges" name="insuranceCharges" type="number" required />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/billing/quotations")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Quotation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

