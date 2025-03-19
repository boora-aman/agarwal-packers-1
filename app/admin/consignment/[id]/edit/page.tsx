"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Cookies from "js-cookie"

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

export default function EditShipmentPage() {
  const [shipment, setShipment] = useState<ShipmentData | null>(null)
  const [editTransitStops, setEditTransitStops] = useState<TransitStop[]>([])
  const [error, setError] = useState("")
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const token = Cookies.get("token")
        const response = await fetch(`/api/shipments/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setShipment(data)
          setEditTransitStops(data.transitStops)
        } else {
          console.error("Failed to fetch shipment")
          if (response.status === 401) {
            router.push("/admin/login")
          }
        }
      } catch (error) {
        console.error("Error fetching shipment:", error)
      }
    }

    fetchShipment()
  }, [params.id, router])

  const handleInputChange = (field: keyof ShipmentData, value: string) => {
    if (!shipment) return
    setShipment({ ...shipment, [field]: value })
  }

  const handleEditTransitStopChange = (index: number, field: keyof TransitStop, value: string) => {
    const updatedStops = [...editTransitStops]
    updatedStops[index] = { ...updatedStops[index], [field]: value }
    setEditTransitStops(updatedStops)
  }

  const addEditTransitStop = () => {
    setEditTransitStops([
      ...editTransitStops,
      {
        location: "",
        expectedArrival: "",
        expectedDeparture: "",
        status: "Scheduled",
        notes: "",
      },
    ])
  }

  const removeEditTransitStop = (index: number) => {
    setEditTransitStops(editTransitStops.filter((_, i) => i !== index))
  }

  const handleUpdateShipment = async () => {
    if (!shipment) return

    try {
      setError("")
      const token = Cookies.get("token")
      const response = await fetch(`/api/shipments/${shipment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...shipment,
          transitStops: editTransitStops,
        }),
      })

      if (response.ok) {
        router.push("/admin/consignment")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update shipment")
      }
    } catch (error) {
      console.error("Error updating shipment:", error)
      setError("Error updating shipment. Please try again.")
    }
  }

  const statusOptions = ["Pending", "Picked Up", "In Transit", "Out for Delivery", "Delivered", "Delayed"]
  const transitStatusOptions = ["Scheduled", "Arrived", "Departed", "Delayed", "Skipped"]

  if (!shipment) return <div className="text-center py-10">Loading shipment...</div>

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Shipment</CardTitle>
          <CardDescription>Update shipment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Tracking Number"
              value={shipment.trackingNumber}
              onChange={(e) => handleInputChange("trackingNumber", e.target.value)}
            />
            <Input
              placeholder="Customer Name"
              value={shipment.customerName}
              onChange={(e) => handleInputChange("customerName", e.target.value)}
            />
            <Input
              placeholder="Customer Mobile"
              value={shipment.customerMobile}
              onChange={(e) => handleInputChange("customerMobile", e.target.value)}
            />
            <Input
              type="datetime-local"
              value={shipment.bookingDate}
              onChange={(e) => handleInputChange("bookingDate", e.target.value)}
            />
            <Select value={shipment.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Origin"
              value={shipment.origin}
              onChange={(e) => handleInputChange("origin", e.target.value)}
            />
            <Input
              placeholder="Destination"
              value={shipment.destination}
              onChange={(e) => handleInputChange("destination", e.target.value)}
            />
            <Input
              placeholder="Current Location"
              value={shipment.currentLocation}
              onChange={(e) => handleInputChange("currentLocation", e.target.value)}
            />
            <Input
              type="date"
              value={shipment.estimatedDelivery}
              onChange={(e) => handleInputChange("estimatedDelivery", e.target.value)}
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Transit Stops</h3>
              <Button onClick={addEditTransitStop} variant="outline" size="sm">
                Add Stop
              </Button>
            </div>
            {editTransitStops.map((stop, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4 p-4 border rounded"
              >
                <Input
                  placeholder="Location"
                  value={stop.location}
                  onChange={(e) => handleEditTransitStopChange(index, "location", e.target.value)}
                />
                <Input
                  type="datetime-local"
                  value={stop.expectedArrival}
                  onChange={(e) => handleEditTransitStopChange(index, "expectedArrival", e.target.value)}
                />
                <Input
                  type="datetime-local"
                  value={stop.expectedDeparture}
                  onChange={(e) => handleEditTransitStopChange(index, "expectedDeparture", e.target.value)}
                />
                <Select
                  value={stop.status}
                  onValueChange={(value) => handleEditTransitStopChange(index, "status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {transitStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Notes"
                  value={stop.notes || ""}
                  onChange={(e) => handleEditTransitStopChange(index, "notes", e.target.value)}
                />
                <Button onClick={() => removeEditTransitStop(index)} variant="destructive" size="sm">
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button onClick={handleUpdateShipment}>Save Changes</Button>
            <Button onClick={() => router.push("/admin/consignment")} variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}