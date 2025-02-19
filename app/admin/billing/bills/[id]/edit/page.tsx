"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import Cookies from "js-cookie"


const chargeLabels = {
  freightCharges: "Freight Charges (Transportation)",
  carTransportationCharges: "Car Transportation Charges",
  packingCharges: "Packing Charges (Material + Labor)",
  unpackingCharges: "Unpacking Charges (Labor)",
  loadingCharges: "Loading Charges (Labor)",
  unloadingCharges: "Unloading Charges (Labor)",
  installationCharges: "Installation Charges (LEG, Gyser, AC etc.)",
  stationeryCharges: "Stationery Charges",
  tollCharges: "Toll & Highway Charges",
  gstCharges: "GST Charges & Service Charges",
  insuranceCharges: "Insurance Charges"
}

export default function EditBill({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    billNo: "",
    date: "",
    customerName: "",
    address: "",
    mobileNo: "",
    email: "",
    fromCity: "",
    toCity: "",
    weight: "",
    distance: "",
    ClientGst: "",
    StateCode: "",
    biltyNo: "",
    NoPackage: "",
    insPercentage: "",
    insValue: "",
    GstPercentage: "",
    charges: {
      freightCharges: "",
      carTransportationCharges: "",
      packingCharges: "",
      unpackingCharges: "",
      loadingCharges: "",
      unloadingCharges: "",
      installationCharges: "",
      stationeryCharges: "",
      tollCharges: "",
      gstCharges: "",
      insuranceCharges: ""
    },
    totalAmount: "0"
  })

  useEffect(() => {
    fetchBill()
  }, [params.id])

  const fetchBill = async () => {
    try {
      const token = Cookies.get("token")
      const response = await fetch(`/api/bills/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setFormData({
          ...data,
          date: new Date(data.date).toISOString().split('T')[0],
        })
      }
    } catch (error) {
      console.error("Error fetching bill:", error)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = Cookies.get("token")
      const response = await fetch(`/api/bills/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
        }),
      })

      if (response.ok) {
        router.push("/admin/billing/bills")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update bill")
      }
    } catch (error) {
      console.error("Error updating bill:", error)
      alert("Failed to update bill")
    }
  }

  return (
    <div className="container mx-auto px-4 pt-24 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Bill</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            {/* Basic Details */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="billNo">Bill Number</Label>
                <Input
                  id="billNo"
                  value={formData.billNo}
                  onChange={e => setFormData(prev => ({ ...prev, billNo: e.target.value }))}
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

            {/* Location & Freight Details */}
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold">Location & Freight Details</h2>
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
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    placeholder="Enter Weight"
                    value={formData.weight}
                    onChange={e => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  />  
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance</Label>
                  <Input
                    id="distance"
                    placeholder="Enter Distance"
                    value={formData.distance}
                    onChange={e => setFormData(prev => ({ ...prev, distance: e.target.value }))}
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
                  <Label htmlFor="StateCode">State Code</Label>
                  <Input
                    id="StateCode"
                    placeholder="Enter State Code"
                    value={formData.StateCode}
                    onChange={e => setFormData(prev => ({ ...prev, StateCode: e.target.value }))}
                  />
                </div>  
                <div className="space-y-2">
                  <Label htmlFor="biltyNo">Bilty Number</Label>
                  <Input
                    id="biltyNo"
                    placeholder="Enter Bilty Number"
                    value={formData.biltyNo}
                    onChange={e => setFormData(prev => ({ ...prev, biltyNo: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="NoPackage">Number of Packages</Label>
                  <Input
                    id="NoPackage"
                    placeholder="Enter Number of Packages"
                    value={formData.NoPackage}
                    onChange={e => setFormData(prev => ({ ...prev, NoPackage: e.target.value }))}
                  />
                </div>
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
                  <Label htmlFor="insValue">Insurance Value</Label>
                  <Input
                    id="insValue"
                    placeholder="Enter Insurance Value"
                    value={formData.insValue}
                    onChange={e => setFormData(prev => ({ ...prev, insValue: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="GstPercentage">GST Percentage</Label>
                  <Input
                    id="GstPercentage"
                    placeholder="Enter GST Percentage"
                    value={formData.GstPercentage}
                    onChange={e => setFormData(prev => ({ ...prev, GstPercentage: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Charges */}
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold">Charges</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(chargeLabels).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      value={formData.charges[key as keyof typeof formData.charges]}
                      onChange={e => handleChargeChange(key, e.target.value)}
                    />
                  </div>
                ))}
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
            Update Bill
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}