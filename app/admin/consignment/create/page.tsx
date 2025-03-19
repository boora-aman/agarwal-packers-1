"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Cookies from "js-cookie"
import { Calendar } from "@/components/ui/calendar" // Add a calendar component for better date selection

type TransitStop = {
  location: string
  expectedArrival: string
  expectedDeparture: string
  status: string
  notes?: string
}

type ShipmentData = {
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

export default function CreateShipmentPage() {
  const [newShipment, setNewShipment] = useState<Partial<ShipmentData>>({})
  const [transitStops, setTransitStops] = useState<TransitStop[]>([])
  const [error, setError] = useState("")
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewShipment({ ...newShipment, [name]: value })
  }

  const handleStatusChange = (value: string) => {
    setNewShipment({ ...newShipment, status: value })
  }

  const addTransitStop = () => {
    setTransitStops([
      ...transitStops,
      {
        location: "",
        expectedArrival: "",
        expectedDeparture: "",
        status: "Scheduled",
        notes: "",
      },
    ])
  }

  const updateTransitStop = (index: number, field: keyof TransitStop, value: string) => {
    const updatedStops = [...transitStops]
    updatedStops[index] = { ...updatedStops[index], [field]: value }
    setTransitStops(updatedStops)
  }

  const removeTransitStop = (index: number) => {
    setTransitStops(transitStops.filter((_, i) => i !== index))
  }

  const validateShipment = () => {
    if (!newShipment.trackingNumber?.trim()) return "Tracking number is required"
    if (!newShipment.status?.trim()) return "Status is required"
    if (!newShipment.customerName?.trim()) return "Customer name is required"
    if (!newShipment.customerMobile?.trim()) return "Customer mobile is required"
    if (!/^\d{10}$/.test(newShipment.customerMobile)) return "Invalid mobile number format"
    if (!newShipment.origin?.trim()) return "Origin is required"
    if (!newShipment.destination?.trim()) return "Destination is required"
    if (!newShipment.estimatedDelivery?.trim()) return "Estimated delivery date is required"
    if (!newShipment.bookingDate?.trim()) return "Booking date is required"

    for (const stop of transitStops) {
      if (!stop.location?.trim()) return "Transit stop location is required"
      if (!stop.expectedArrival) return "Transit stop arrival time is required"
      if (!stop.expectedDeparture) return "Transit stop departure time is required"

      const arrival = new Date(stop.expectedArrival)
      const departure = new Date(stop.expectedDeparture)

      if (isNaN(arrival.getTime())) return "Invalid arrival date"
      if (isNaN(departure.getTime())) return "Invalid departure date"
      if (arrival > departure) return "Departure time must be after arrival time"
    }

    return null
  }

  const handleAddShipment = async () => {
    try {
      setError("")
      const validationError = validateShipment()
      if (validationError) {
        setError(validationError)
        return
      }

      const token = Cookies.get("token")
      const response = await fetch("/api/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newShipment,
          transitStops,
          currentLocation: newShipment.origin,
        }),
      })

      if (response.ok) {
        router.push("/admin/consignment")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to add shipment")
      }
    } catch (error) {
      console.error("Error adding shipment:", error)
      setError("Error adding shipment. Please try again.")
    }
  }

  const statusOptions = ["Pending", "Picked Up", "In Transit", "Out for Delivery", "Delivered", "Delayed"]
  const transitStatusOptions = ["Scheduled", "Arrived", "Departed", "Delayed", "Skipped"]

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Shipment</CardTitle>
          <CardDescription>Enter the details for a new shipment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Input
              name="trackingNumber"
              placeholder="Tracking Number"
              value={newShipment.trackingNumber || ""}
              onChange={handleInputChange}
            />
            <Input
              name="customerName"
              placeholder="Customer Name"
              value={newShipment.customerName || ""}
              onChange={handleInputChange}
            />
            <Input
              name="customerMobile"
              placeholder="Customer Mobile (10 digits)"
              value={newShipment.customerMobile || ""}
              onChange={handleInputChange}
              maxLength={10}
            />
            <Input
              name="bookingDate"
              placeholder="Booking Date"
              type="datetime-local"
              value={newShipment.bookingDate || ""}
              onChange={handleInputChange}
            />
            <Select onValueChange={handleStatusChange}>
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
            <Input name="origin" placeholder="Origin" value={newShipment.origin || ""} onChange={handleInputChange} />
            <Input
              name="destination"
              placeholder="Destination"
              value={newShipment.destination || ""}
              onChange={handleInputChange}
            />
            <Input
              name="estimatedDelivery"
              placeholder="Estimated Delivery"
              value={newShipment.estimatedDelivery || ""}
              onChange={handleInputChange}
              type="datetime-local"
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Transit Stops</h3>
              <Button onClick={addTransitStop} variant="outline" size="sm">
                Add Stop
              </Button>
            </div>
            {transitStops.map((stop, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4 p-4 border rounded">
                <Input
                  placeholder="Location"
                  value={stop.location}
                  onChange={(e) => updateTransitStop(index, "location", e.target.value)}
                />
                <Input
                  type="datetime-local"
                  value={stop.expectedArrival}
                  onChange={(e) => updateTransitStop(index, "expectedArrival", e.target.value)}
                />
                <Input
                  type="datetime-local"
                  value={stop.expectedDeparture}
                  onChange={(e) => updateTransitStop(index, "expectedDeparture", e.target.value)}
                />
                <Select onValueChange={(value) => updateTransitStop(index, "status", value)}>
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
                  onChange={(e) => updateTransitStop(index, "notes", e.target.value)}
                />
                <Button onClick={() => removeTransitStop(index)} variant="destructive" size="sm">
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button onClick={handleAddShipment}>Add Shipment</Button>
        </CardContent>
      </Card>
    </div>
  )
}