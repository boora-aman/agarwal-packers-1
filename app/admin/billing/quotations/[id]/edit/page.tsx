"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Cookies from "js-cookie"

interface QuotationCharges {
  freightCharges: number
  carTransportationCharges: number
  loadingCharges: number
  unloadingCharges: number
  packingCharges: number
  unpackingCharges: number
  installationCharges: number
  stationeryCharges: number
  tollCharges: number
  gstCharges: number
  insuranceCharges: number
}

interface Quotation {
  _id: string
  quotationNo: string
  date: string
  vehicleType: string
  customerName: string
  address: string
  mobileNo: string
  email?: string
  fromCity: string
  toCity: string
  charges: QuotationCharges
}

export default function EditQuotationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [quotation, setQuotation] = useState<Quotation | null>(null)

  useEffect(() => {
    fetchQuotation()
  }, [params.id])

  const fetchQuotation = async () => {
    try {
      const token = Cookies.get("token")
      const response = await fetch(`/api/quotations/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setQuotation(data)
      } else {
        setError("Failed to fetch quotation")
      }
    } catch (err) {
      console.error("Error fetching quotation:", err)
      setError("An unexpected error occurred")
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")

      const formData = new FormData(e.currentTarget)
      const data = {
        quotationNo: formData.get("quotationNo"),
        date: formData.get("date"),
        vehicleType: formData.get("vehicleType"),
        customerName: formData.get("customerName"),
        address: formData.get("address"),
        mobileNo: formData.get("mobileNo"),
        email: formData.get("email"),
        fromCity: formData.get("fromCity"),
        toCity: formData.get("toCity"),
        charges: {
          freightCharges: Number(formData.get("freightCharges")),
          carTransportationCharges: Number(formData.get("carTransportationCharges")),
          loadingCharges: Number(formData.get("loadingCharges")),
          unloadingCharges: Number(formData.get("unloadingCharges")),
          packingCharges: Number(formData.get("packingCharges")),
          unpackingCharges: Number(formData.get("unpackingCharges")),
          installationCharges: Number(formData.get("installationCharges")),
          stationeryCharges: Number(formData.get("stationeryCharges")),
          tollCharges: Number(formData.get("tollCharges")),
          gstCharges: Number(formData.get("gstCharges")),
          insuranceCharges: Number(formData.get("insuranceCharges"))
        }
      }

      const token = Cookies.get("token")
      const response = await fetch(`/api/quotations/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        router.push("/admin/billing/quotations")
        router.refresh()
      } else {
        setError(result.error || "Failed to update quotation")
      }
    } catch (err) {
      console.error("Form submission error:", err)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!quotation) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  const chargeFields = [
    { key: "freightCharges", label: "Freight Charges" },
    { key: "carTransportationCharges", label: "Car Transportation" },
    { key: "loadingCharges", label: "Loading Charges" },
    { key: "unloadingCharges", label: "Unloading Charges" },
    { key: "packingCharges", label: "Packing Charges" },
    { key: "unpackingCharges", label: "Unpacking Charges" },
    { key: "installationCharges", label: "Installation Charges" },
    { key: "stationeryCharges", label: "Stationery Charges" },
    { key: "tollCharges", label: "Toll Charges (7%)" },
    { key: "gstCharges", label: "GST Charges (18%)" },
    { key: "insuranceCharges", label: "Insurance Charges (3%)" }
  ]

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Quotation #{quotation.quotationNo}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quotationNo">Quotation No.</Label>
                <Input 
                  id="quotationNo" 
                  name="quotationNo" 
                  defaultValue={quotation.quotationNo}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  name="date" 
                  type="date" 
                  defaultValue={quotation.date?.split("T")[0]}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Input 
                  id="vehicleType" 
                  name="vehicleType" 
                  defaultValue={quotation.vehicleType}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input 
                  id="customerName" 
                  name="customerName" 
                  defaultValue={quotation.customerName}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  name="address" 
                  defaultValue={quotation.address}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNo">Mobile No.</Label>
                <Input 
                  id="mobileNo" 
                  name="mobileNo" 
                  defaultValue={quotation.mobileNo}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  defaultValue={quotation.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromCity">From City</Label>
                <Input 
                  id="fromCity" 
                  name="fromCity" 
                  defaultValue={quotation.fromCity}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toCity">To City</Label>
                <Input 
                  id="toCity" 
                  name="toCity" 
                  defaultValue={quotation.toCity}
                  required 
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Charges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chargeFields.map(({ key, label }) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      name={key}
                      type="number"
                      defaultValue={quotation.charges[key as keyof QuotationCharges]}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

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
                {loading ? "Updating..." : "Update Quotation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}