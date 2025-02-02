"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type TransitStop = {
  location: string
  expectedArrival: string
  expectedDeparture: string
  status: string
  notes?: string
}

type ShipmentData = {
  _id?: string
  trackingNumber: string
  customerName: string
  customerMobile: string
  status: string
  origin: string
  destination: string
  currentLocation: string
  estimatedDelivery: string
  bookingDate: string
  transitStops: TransitStop[]
}

interface EditShipmentFormProps {
  shipment: ShipmentData
  onClose: () => void
  onUpdate: (updatedShipment: ShipmentData) => void
}

// Helper function to format date for datetime-local input
const formatDateForInput = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // Format: YYYY-MM-DDThh:mm
    return date.toISOString().slice(0, 16);
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return new Date().toISOString().slice(0, 16);
  }
};

export default function EditShipmentForm({ shipment, onClose, onUpdate }: EditShipmentFormProps) {
  // Format dates before setting initial state
  const formattedShipment = {
    ...shipment,
    estimatedDelivery: shipment.estimatedDelivery,
    bookingDate: shipment.bookingDate,
    transitStops: shipment.transitStops.map(stop => ({
      ...stop,
      expectedArrival: stop.expectedArrival,
      expectedDeparture: stop.expectedDeparture
    }))
  };

  const [formData, setFormData] = useState<ShipmentData>(formattedShipment)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: keyof ShipmentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTransitStopChange = (index: number, field: keyof TransitStop, value: string) => {
    const newTransitStops = [...formData.transitStops]
    newTransitStops[index] = { ...newTransitStops[index], [field]: value }
    setFormData(prev => ({ ...prev, transitStops: newTransitStops }))
  }

  const addTransitStop = () => {
    const newStop: TransitStop = {
      location: "",
      expectedArrival: new Date().toISOString(),
      expectedDeparture: new Date().toISOString(),
      status: "Scheduled",
      notes: ""
    }
    setFormData(prev => ({
      ...prev,
      transitStops: [...prev.transitStops, newStop]
    }))
  }

  const removeTransitStop = (index: number) => {
    setFormData(prev => ({
      ...prev,
      transitStops: prev.transitStops.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`/api/shipments/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        onUpdate(data)
        onClose()
      } else {
        setError(data.error || "Failed to update shipment")
      }
    } catch (error) {
      console.error("Error updating shipment:", error)
      setError("Error updating shipment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Picked Up">Picked Up</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currentLocation">Current Location</Label>
              <Input
                id="currentLocation"
                value={formData.currentLocation}
                onChange={(e) => handleInputChange("currentLocation", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
              <Input
                id="estimatedDelivery"
                type="datetime-local"
                value={formatDateForInput(formData.estimatedDelivery)}
                onChange={(e) => handleInputChange("estimatedDelivery", new Date(e.target.value).toISOString())}
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Transit Stops</h3>
              <Button type="button" onClick={addTransitStop}>Add Stop</Button>
            </div>

            {formData.transitStops.map((stop, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={stop.location}
                      onChange={(e) => handleTransitStopChange(index, "location", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Status</Label>
                    <Select
                      value={stop.status}
                      onValueChange={(value) => handleTransitStopChange(index, "status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="Arrived">Arrived</SelectItem>
                        <SelectItem value="Departed">Departed</SelectItem>
                        <SelectItem value="Delayed">Delayed</SelectItem>
                        <SelectItem value="Skipped">Skipped</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Expected Arrival</Label>
                    <Input
                      type="datetime-local"
                      value={formatDateForInput(stop.expectedArrival)}
                      onChange={(e) => handleTransitStopChange(index, "expectedArrival", new Date(e.target.value).toISOString())}
                    />
                  </div>

                  <div>
                    <Label>Expected Departure</Label>
                    <Input
                      type="datetime-local"
                      value={formatDateForInput(stop.expectedDeparture)}
                      onChange={(e) => handleTransitStopChange(index, "expectedDeparture", new Date(e.target.value).toISOString())}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={stop.notes || ""}
                      onChange={(e) => handleTransitStopChange(index, "notes", e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeTransitStop(index)}
                    >
                      Remove Stop
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Shipment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}