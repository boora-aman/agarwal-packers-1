"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Cookies from "js-cookie"
import { Pencil, Truck, Trash2, MapPin } from "lucide-react"

type TransitStop = {
  location: string
  expectedArrival: string
  expectedDeparture: string
  status: string
  notes?: string
}

type ShipmentData = {
  _id: string
  trackingNumber: string
  status: string
  customerName: string
  customerMobile: string
  origin: string
  destination: string
  currentLocation: string
  estimatedDelivery: string
  bookingDate: string
  transitStops: TransitStop[]
}

export default function ShipmentList() {
  const [shipments, setShipments] = useState<ShipmentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchShipments()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchShipments, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchShipments = async () => {
    try {
      setLoading(true)
      const token = Cookies.get("token")
      const response = await fetch("/api/shipments", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setShipments(data)
      } else if (response.status === 401) {
        router.push("/admin/login")
      } else {
        setError("Failed to fetch shipments")
      }
    } catch (error) {
      console.error("Error fetching shipments:", error)
      setError("Error fetching shipments")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (shipmentId: string) => {
    router.push(`/admin/consignment/${shipmentId}/edit`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shipment?")) return

    try {
      const token = Cookies.get("token")
      const response = await fetch(`/api/shipments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        setShipments(shipments.filter(s => s._id !== id))
      } else {
        setError("Failed to delete shipment")
      }
    } catch (error) {
      console.error("Error deleting shipment:", error)
      setError("Error deleting shipment")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Shipments</h1>
        <div className="flex gap-4">
          <Button 
            onClick={() => router.push("/admin/consignment/create")}
            className="w-full sm:w-auto"
          >
            Add New Shipment
          </Button>
          <Button 
            onClick={() => router.push("/admin/dashboard")}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
      {loading ? (
        <div className="text-center py-10">Loading shipments...</div>
      ) : shipments.length === 0 ? (
        <div className="text-center py-10">No shipments found</div>
      ) : (
        <div className="grid gap-4">
          {shipments.map((shipment) => (
            <Card key={shipment._id} className="border border-gray-200">
              <CardContent className="p-0">
                {/* Header with tracking number and actions */}
                <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
                  <h3 className="font-medium">#{shipment.trackingNumber} {shipment.customerName}</h3>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-blue-700" onClick={() => handleEdit(shipment._id)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-blue-700" onClick={() => handleDelete(shipment._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Shipment status with icon */}
                <div className="p-3 flex items-center border-b">
                  <Truck className="h-5 w-5 mr-2 text-gray-500" />
                  <span className={`font-medium ${
                    shipment.status === "Delivered" ? "text-green-600" : 
                    shipment.status === "Delayed" ? "text-red-600" : 
                    "text-blue-600"
                  }`}>
                    {shipment.status}
                  </span>
                  <div className="ml-auto text-sm text-gray-500">{shipment.customerMobile}</div>
                </div>

                {/* Route details */}
                <div className="p-3 text-sm">
                  <div className="flex items-center mb-1">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{shipment.origin} → {shipment.destination}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <div>Current: {shipment.currentLocation}</div>
                    <div>ETA: {formatDate(shipment.estimatedDelivery)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}