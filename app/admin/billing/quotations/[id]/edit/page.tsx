"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Cookies from "js-cookie"

const vehicleTypes = [
  "Part Load",
  "14-Foot",
  "17-Foot",
  "19-Foot",
  "22-Foot",
  "Custom"
]

const chargeLabels = {
  freightCharges: "Freight Charges (Transportation)",
  carTransportationCharges: "Car Transportation Charges",
  packingCharges: "Packing Charges (Material + Labor)",
  unpackingCharges: "Unpacking Charges (Labor)",
  loadingCharges: "Loading Charges (Labor)",
  unloadingCharges: "Unloading Charges (Labor)",
}

export default function EditQuotation({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isCustomVehicle, setIsCustomVehicle] = useState(false)
  const [formData, setFormData] = useState({
    quotationNo: "",
    date: "",
    customerName: "",
    address: "",
    mobileNo: "",
    email: "",
    fromCity: "",
    toCity: "",
    vehicleType: "",
    customVehicleType: "",
    installationCharges: "",
    stationeryCharges: "",
    tollCharges: "",
    gstCharges: "",
    insuranceCharges: "",
    ClientGst: "",
    companyName: "",
    insPercentage: "",
    gstPercentage: "",
    charges: {
      freightCharges: "",
      carTransportationCharges: "",
      packingCharges: "",
      unpackingCharges: "",
      loadingCharges: "",
      unloadingCharges: "",
    },
    totalAmount: "0"
  })

  useEffect(() => {
    fetchQuotation()
  }, [params.id])

  const fetchQuotation = async () => {
    try {
      const token = Cookies.get("token")
      const response = await fetch(`/api/quotations/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setFormData({
          ...data,
          date: new Date(data.date).toISOString().split('T')[0],
          customVehicleType: vehicleTypes.includes(data.vehicleType) ? "" : data.vehicleType
        })
        setIsCustomVehicle(!vehicleTypes.includes(data.vehicleType))
      }
    } catch (error) {
      console.error("Error fetching quotation:", error)
    }
  }

  const handleChargeChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      charges: {
        ...prev.charges,
        [field]: value
      }
    }))
  }

  const handleVehicleTypeChange = (value: string) => {
    setIsCustomVehicle(value === "Custom")
    setFormData(prev => ({
      ...prev,
      vehicleType: value === "Custom" ? prev.customVehicleType : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = Cookies.get("token")
      const response = await fetch(`/api/quotations/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          vehicleType: isCustomVehicle ? formData.customVehicleType : formData.vehicleType
        }),
      })

      if (response.ok) {
        router.push("/admin/billing/quotations")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update quotation")
      }
    } catch (error) {
      console.error("Error updating quotation:", error)
      alert("Failed to update quotation")
    }
  }

  return (
    <div className="container mx-auto px-4 pt-24 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Quotation</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            {/* Basic Details */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="quotationNo">Quotation Number</Label>
                <Input
                  id="quotationNo"
                  value={formData.quotationNo}
                  onChange={e => setFormData(prev => ({ ...prev, quotationNo: e.target.value }))}
                  required
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold">Customer Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={e => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ClientGst">Client GST</Label>
                  <Input
                    id="ClientGst"
                    placeholder="Enter Client GST"
                    value={formData.ClientGst}
                    onChange={e => setFormData(prev => ({ ...prev, ClientGst: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter Company Name"
                    value={formData.companyName}
                    onChange={e => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobileNo">Mobile Number</Label>
                  <Input
                    id="mobileNo"
                    value={formData.mobileNo}
                    onChange={e => setFormData(prev => ({ ...prev, mobileNo: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location & Vehicle Details */}
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold">Location & Vehicle Details</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromCity">From City</Label>
                  <Input
                    id="fromCity"
                    value={formData.fromCity}
                    onChange={e => setFormData(prev => ({ ...prev, fromCity: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toCity">To City</Label>
                  <Input
                    id="toCity"
                    value={formData.toCity}
                    onChange={e => setFormData(prev => ({ ...prev, toCity: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select
                    value={isCustomVehicle ? "Custom" : formData.vehicleType}
                    onValueChange={handleVehicleTypeChange}
                  >
                    <SelectTrigger id="vehicleType">
                      <SelectValue placeholder="Select Vehicle Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isCustomVehicle && (
                    <Input
                      className="mt-2"
                      placeholder="Enter Custom Vehicle Type"
                      value={formData.customVehicleType}
                      onChange={e => setFormData(prev => ({ 
                        ...prev, 
                        customVehicleType: e.target.value,
                        vehicleType: e.target.value 
                      }))}
                      required={isCustomVehicle}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Charges */}
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold">Charges</h2>
              
              {/* Basic Charges */}
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(chargeLabels).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      placeholder="Enter numeric amount only"
                      value={formData.charges[key as keyof typeof formData.charges]}
                      onChange={e => handleChargeChange(key, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              {/* Additional Charges */}
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="installationCharges">Installation Charges</Label>
                  <Input
                    id="installationCharges"
                    placeholder="Enter Amount Or N/A"
                    value={formData.installationCharges}
                    onChange={e => setFormData(prev => ({ ...prev, installationCharges: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stationeryCharges">Stationery Charges</Label>
                  <Input
                    id="stationeryCharges"
                    placeholder="Enter Amount Or N/A"
                    value={formData.stationeryCharges}
                    onChange={e => setFormData(prev => ({ ...prev, stationeryCharges: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tollCharges">Toll Charges</Label>
                  <Input
                    id="tollCharges"
                    placeholder="Enter Amount Or N/A"
                    value={formData.tollCharges}
                    onChange={e => setFormData(prev => ({ ...prev, tollCharges: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstCharges">GST Charges</Label>
                  <Input
                    id="gstCharges"
                    placeholder="Enter Amount Or N/A"
                    value={formData.gstCharges}
                    onChange={e => setFormData(prev => ({ ...prev, gstCharges: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insuranceCharges">Insurance Charges</Label>
                  <Input
                    id="insuranceCharges"
                    placeholder="Enter Amount Or N/A"
                    value={formData.insuranceCharges}
                    onChange={e => setFormData(prev => ({ ...prev, insuranceCharges: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Percentage */}
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold">Percentage</h2>
              <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="insPercentage">Insurance Percentage</Label>
                  <Input
                    id="insPercentage"
                    placeholder="Enter Insurance Percentage"
                    value={formData.insPercentage}
                    onChange={e => setFormData(prev => ({ ...prev, insPercentage: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstPercentage">GST Percentage</Label>
                  <Input
                    id="gstPercentage"
                    placeholder="Enter GST Percentage"
                    value={formData.gstPercentage}
                    onChange={e => setFormData(prev => ({ ...prev, gstPercentage: e.target.value }))}
                  />
                </div>
                
              </div>
            </div>
            {/* Total Amount */}
            <div className="flex items-center space-x-4">
              <Label htmlFor="totalAmount" className="font-semibold">Total Amount:</Label>
              <Input
                id="totalAmount"
                value={formData.totalAmount}
                onChange={e => setFormData(prev => ({ ...prev, totalAmount: e.target.value }))}
                className="w-48"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            Update Quotation
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}