"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export default function AdminDashboardPage() {
  const [shipments, setShipments] = useState<ShipmentData[]>([])
  const [newShipment, setNewShipment] = useState<Partial<ShipmentData>>({})
  const [transitStops, setTransitStops] = useState<TransitStop[]>([])
  const [editingShipment, setEditingShipment] = useState<ShipmentData | null>(null)
  const [editTransitStops, setEditTransitStops] = useState<TransitStop[]>([])
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchShipments()
  }, [])

  const fetchShipments = async () => {
    try {
      const token = Cookies.get("token")
      const response = await fetch("/api/shipments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setShipments(data)
      } else {
        console.error("Failed to fetch shipments")
        if (response.status === 401) {
          router.push("/admin/login")
        }
      }
    } catch (error) {
      console.error("Error fetching shipments:", error)
    }
  }

  const handleLogout = () => {
    Cookies.remove("token")
    Cookies.remove("adminLoggedIn")
    router.push("/admin/login")
  }

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
        notes: ""
      }
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
    
    // Validate transit stops
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
          currentLocation: newShipment.origin
        }),
      })

      if (response.ok) {
        fetchShipments()
        setNewShipment({})
        setTransitStops([])
      } else {
        const data = await response.json()
        setError(data.error || "Failed to add shipment")
        if (response.status === 401) {
          router.push("/admin/login")
        }
      }
    } catch (error) {
      console.error("Error adding shipment:", error)
      setError("Error adding shipment. Please try again.")
    }
  }

  const handleEdit = (shipment: ShipmentData) => {
    setEditingShipment(shipment)
    setEditTransitStops([...shipment.transitStops])
  }

  const handleCancelEdit = () => {
    setEditingShipment(null)
    setEditTransitStops([])
  }

  const handleUpdateShipment = async () => {
    if (!editingShipment) return

    try {
      setError("")
      const token = Cookies.get("token")
      const response = await fetch(`/api/shipments/${editingShipment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editingShipment,
          transitStops: editTransitStops,
        }),
      })

      if (response.ok) {
        fetchShipments()
        setEditingShipment(null)
        setEditTransitStops([])
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update shipment")
        if (response.status === 401) {
          router.push("/admin/login")
        }
      }
    } catch (error) {
      console.error("Error updating shipment:", error)
      setError("Error updating shipment. Please try again.")
    }
  }

  const handleEditInputChange = (field: keyof ShipmentData, value: string) => {
    if (!editingShipment) return
    setEditingShipment({ ...editingShipment, [field]: value })
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
        notes: ""
      }
    ])
  }

  const removeEditTransitStop = (index: number) => {
    setEditTransitStops(editTransitStops.filter((_, i) => i !== index))
  }

  const statusOptions = [
    "Pending",
    "Picked Up",
    "In Transit",
    "Out for Delivery",
    "Delivered",
    "Delayed"
  ]

  const transitStatusOptions = [
    "Scheduled",
    "Arrived",
    "Departed",
    "Delayed",
    "Skipped"
  ]

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">  {/* Changed py-8 to pt-24 pb-8 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>

      <Card className="mb-8">
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
            <Input 
              name="origin"
              placeholder="Origin"
              value={newShipment.origin || ""}
              onChange={handleInputChange}
            />
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
              type="date"
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

      <Card>
        <CardHeader>
          <CardTitle>Shipments</CardTitle>
          <CardDescription>Manage and update shipment information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking Number</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Current Location</TableHead>
                <TableHead>Estimated Delivery</TableHead>
                <TableHead>Transit Stops</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.map((shipment) => (
                <TableRow key={shipment._id}>
                  <TableCell>{shipment.trackingNumber}</TableCell>
                  <TableCell>{shipment.customerName}</TableCell>
                  <TableCell>{shipment.customerMobile}</TableCell>
                  <TableCell>{new Date(shipment.bookingDate).toLocaleString()}</TableCell>
                  <TableCell>{shipment.status}</TableCell>
                  <TableCell>{shipment.origin}</TableCell>
                  <TableCell>{shipment.destination}</TableCell>
                  <TableCell>{shipment.currentLocation}</TableCell>
                  <TableCell>{new Date(shipment.estimatedDelivery).toLocaleDateString()}</TableCell>
                  <TableCell>{shipment.transitStops.length} stops</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(shipment)} variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingShipment && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Edit Shipment</CardTitle>
            <CardDescription>Update shipment information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <Input
                placeholder="Tracking Number"
                value={editingShipment.trackingNumber}
                onChange={(e) => handleEditInputChange("trackingNumber", e.target.value)}
              />
              <Input
                placeholder="Customer Name"
                value={editingShipment.customerName}
                onChange={(e) => handleEditInputChange("customerName", e.target.value)}
              />
              <Input
                placeholder="Customer Mobile"
                value={editingShipment.customerMobile}
                onChange={(e) => handleEditInputChange("customerMobile", e.target.value)}
              />
              <Input
                type="datetime-local"
                value={editingShipment.bookingDate}
                onChange={(e) => handleEditInputChange("bookingDate", e.target.value)}
              />
              <Select
                value={editingShipment.status}
                onValueChange={(value) => handleEditInputChange("status", value)}
              >
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
                value={editingShipment.origin}
                onChange={(e) => handleEditInputChange("origin", e.target.value)}
              />
              <Input
                placeholder="Destination"
                value={editingShipment.destination}
                onChange={(e) => handleEditInputChange("destination", e.target.value)}
              />
              <Input
                placeholder="Current Location"
                value={editingShipment.currentLocation}
                onChange={(e) => handleEditInputChange("currentLocation", e.target.value)}
              />
              <Input
                type="date"
                value={editingShipment.estimatedDelivery}
                onChange={(e) => handleEditInputChange("estimatedDelivery", e.target.value)}
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
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4 p-4 border rounded">
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
              <Button onClick={handleCancelEdit} variant="outline">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
