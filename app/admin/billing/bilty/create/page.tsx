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


const chargeLabels = {
  freightCharges: "Freight Charges (Transportation)",
  carTransportationCharges: "Car Transportation Charges",
  packunpackingCharges: "Packing/Unpacking Charges (Material + Labor)",
  loadingCharges: "Loading Charges (Labor)",
  unloadingCharges: "Unloading Charges (Labor)",
}

export default function CreateBilty() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    biltyNo: "",
    date: new Date().toISOString().split('T')[0],
    senderName: "",
    senderaddress: "",
    receiverName: "",
    receiveraddress: "",
    fromGst: "N/A",
    toGst: "N/A",
    email: "null@gmail.com",
    fromContactNo: "",
    toContactNo: "",
    fromCity: "",
    toCity: "",
    description: "Old & Used Household Goods",
    weight: "Fixed",
    distance: "N/A",
    NoPackage: "Full Load",
    packingType: "Carton Box",
    deliverytype: "Door Delivery",
    billno: "N/A",
    bikeno: "N/A",
    carno: "N/A",
    vehicleNo: "N/A",
    vehicleType: "Full Load",
    paidAmount: "0",
    topayAmount: "0",
    trucktopayAmount: "0",
    gstserviceinsCharges: "0",
    insPercentage: "3",
    insAmount: "0",
    insType: "None",
    stcharges: "0",
    gstPercentage: "18",
    charges: {
      freightCharges: "0",
      carTransportationCharges: "0",
      packunpackingCharges: "0",
      loadingCharges: "0",
      unloadingCharges: "0",
    },
    totalAmount: "0"
  })


  // Calculate total whenever charges change
  useEffect(() => {
    const total = calculateTotal(formData.charges)
    setFormData(prev => ({ ...prev, totalAmount: total }))
  }, [formData.charges])

  const handleChargeChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      charges: {
        ...prev.charges,
        [field]: value
      }
    }))
  }

  const calculateTotal = (charges: Record<string, string>) => {
    // Simply sum up all numeric values
    return Object.values(charges).reduce((total, value) => {
      const numValue = Number(value);
      return total + (isNaN(numValue) ? 0 : numValue);
    }, 0).toFixed(2).toString();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = Cookies.get("token")
      const response = await fetch("/api/bilty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
        }),
      })

      if (response.ok) {
        router.push("/admin/billing/bilty")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to create bilty")
      }
    } catch (error) {
      console.error("Error creating bilty:", error)
      alert("Failed to create bilty")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Bilty</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            {/* Basic Details */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="biltyNo">Bilty Number</Label>
                <Input
                  id="biltyNo"
                  placeholder="Enter Bilty Number"
                  value={formData.biltyNo}
                  onChange={e => setFormData(prev => ({ ...prev, biltyNo: e.target.value }))}
                  required
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
              <h2 className="text-lg font-semibold">Sender Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senderName">Sender Name</Label>
                  <Input
                    id="senderName"
                    placeholder="Enter Sender Name"
                    value={formData.senderName}
                    onChange={e => setFormData(prev => ({ ...prev, senderName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiverName">Receiver Name</Label>
                  <Input
                    id="receiverName"
                    placeholder="Enter Receiver Name"
                    value={formData.receiverName}
                    onChange={e => setFormData(prev => ({ ...prev, receiverName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderaddress">Sender Address</Label>
                  <Input
                    id="senderaddress"
                    placeholder="Enter Address"
                    value={formData.senderaddress}
                    onChange={e => setFormData(prev => ({ ...prev, senderaddress: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiveraddress">Receiver Address</Label>
                  <Input
                    id="receiveraddress"
                    placeholder="Enter Address"
                    value={formData.receiveraddress}
                    onChange={e => setFormData(prev => ({ ...prev, receiveraddress: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromContactNo">Sender Mobile Number</Label>
                  <Input
                    id="fromContactNo"
                    placeholder="Enter Mobile Number"
                    value={formData.fromContactNo}
                    onChange={e => setFormData(prev => ({ ...prev, fromContactNo: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toContactNo">Receiver Mobile Number</Label>
                  <Input
                    id="toContactNo"
                    placeholder="Enter Mobile Number"
                    value={formData.toContactNo}
                    onChange={e => setFormData(prev => ({ ...prev, toContactNo: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromGst">Sender GST</Label>
                  <Input
                    id="fromGst"
                    placeholder="Enter Sender GST"
                    value={formData.fromGst}
                    onChange={e => setFormData(prev => ({ ...prev, fromGst: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toGst">Receiver GST</Label>
                  <Input
                    id="toGst"
                    placeholder="Enter Receiver GST"  
                    value={formData.toGst}
                    onChange={e => setFormData(prev => ({ ...prev, toGst: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            {}

            {/* Location & Freight Details */}
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold">Location & Freight Details</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromCity">From City</Label>
                  <Input
                    id="fromCity"
                    placeholder="Enter Origin City"
                    value={formData.fromCity}
                    onChange={e => setFormData(prev => ({ ...prev, fromCity: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toCity">To City</Label>
                  <Input
                    id="toCity"
                    placeholder="Enter Destination City"
                    value={formData.toCity}
                    onChange={e => setFormData(prev => ({ ...prev, toCity: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (KM)</Label>
                  <Input
                    id="distance"
                    type="number"
                    placeholder="Enter Distance"
                    value={formData.distance}
                    onChange={e => setFormData(prev => ({ ...prev, distance: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold">Package Details</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">Goods Description</Label>
                <Input
                  id="description"
                  placeholder="Enter Description"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
                <div className="space-y-2">          
                  <Label htmlFor="NoPackage">Number of Packages</Label>
                  <Input
                    id="NoPackage"
                    type="number"
                    placeholder="Enter Number of Packages"
                    value={formData.NoPackage}
                    onChange={e => setFormData(prev => ({ ...prev, NoPackage: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bikeno">Bike Number</Label>
                  <Input
                    id="bikeno"
                    placeholder="Enter Bike Number"
                    value={formData.bikeno}
                    onChange={e => setFormData(prev => ({ ...prev, bikeno: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carno">Car Number</Label>
                  <Input
                    id="carno"
                    placeholder="Enter Car Number"
                    value={formData.carno}
                    onChange={e => setFormData(prev => ({ ...prev, carno: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (KG)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter Weight"
                    value={formData.weight}
                    onChange={e => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="packingType">Packing Type</Label>
                  <Select
                    value={formData.packingType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, packingType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select packing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="box">Carton Box, Plastic Packaging, Wooden Crate, Thermocol</SelectItem>
                      <SelectItem value="carton">Plastic Packaging</SelectItem>
                      <SelectItem value="crate">Wooden Crate</SelectItem>
                      <SelectItem value="pallet">Thermocol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            <div className="space-y-2">
                  <Label htmlFor="deliverytype">Delivery Type</Label>
                  <Select
                    value={formData.deliverytype}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, deliverytype: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="N/A">N/A</SelectItem>
                      <SelectItem value="Door Delivery">Door Delivery</SelectItem>
                      <SelectItem value="Godown Delivery">Godown Delivery</SelectItem>
                      <SelectItem value="On Hold Warehouse">On Hold Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select
                    value={formData.vehicleType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Part Load">Part Load</SelectItem>
                      <SelectItem value="19-Foot">14-Foot</SelectItem>
                      <SelectItem value="14-Foot">19-Foot</SelectItem>
                      <SelectItem value="10-Foot">21-Foot</SelectItem>
                      <SelectItem value="Full Load">Full Load</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleNo">Vehicle Number</Label>
                  <Input
                    id="vehicleNo"
                    placeholder="Enter Vehicle Number"
                    value={formData.vehicleNo}
                    onChange={e => setFormData(prev => ({ ...prev, vehicleNo: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billno">Bill Number</Label>
                  <Input
                    id="billno"
                    placeholder="Enter Bill Number"
                    value={formData.billno}
                    onChange={e => setFormData(prev => ({ ...prev, billno: e.target.value }))}
                  />
                </div>
              </div>
            </div>


            {/* Insurance & GST Details */}
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold">Insurance & GST Details</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insType">Insurance Type</Label>
                  <Select
                    value={formData.insType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, insType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Transit">Transit</SelectItem>
                      <SelectItem value="Comprehensive">Comprehensive </SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insPercentage">Insurance Percentage</Label>
                  <Input
                    id="insPercentage"
                    type="number"
                    placeholder="Enter Insurance %"
                    value={formData.insPercentage}
                    onChange={e => setFormData(prev => ({ ...prev, insPercentage: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insAmount">Value of Goods</Label>
                  <Input
                    id="insAmount"
                    type="number"
                    placeholder="Enter Insurance Amount"
                    value={formData.insAmount}
                    onChange={e => setFormData(prev => ({ ...prev, insAmount: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstPercentage">GST Percentage</Label>
                  <Input
                    id="gstPercentage"
                    type="number"
                    placeholder="Enter GST %"
                    value={formData.gstPercentage}
                    onChange={e => setFormData(prev => ({ ...prev, gstPercentage: e.target.value }))}
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
                      placeholder="Enter amount or N/A"
                      value={formData.charges[key as keyof typeof formData.charges]}
                      onChange={e => handleChargeChange(key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                  <Label htmlFor="stcharges">ST Charges</Label>
                  <Input
                    id="stcharges"
                    type="number"
                    placeholder="Enter ST Charges"
                    value={formData.stcharges}
                    onChange={e => setFormData(prev => ({ ...prev, stcharges: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstserviceinsCharges">GST & Service Charges</Label>
                  <Input
                    id="gstserviceinsCharges"
                    type="number"
                    placeholder="Enter GST/Insurance & Service Charges"
                    value={formData.gstserviceinsCharges}
                    onChange={e => setFormData(prev => ({ ...prev, gstserviceinsCharges: e.target.value }))}
                  />
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

            {/* Payment Details */}
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold">Payment Details</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paidAmount">Paid Amount</Label>
                  <Input
                    id="paidAmount"
                    type="number"
                    placeholder="Enter Paid Amount"
                    value={formData.paidAmount}
                    onChange={e => setFormData(prev => ({ ...prev, paidAmount: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topayAmount">To Pay Amount</Label>
                  <Input
                    id="topayAmount"
                    type="number"
                    placeholder="Enter To Pay Amount"
                    value={formData.topayAmount}
                    onChange={e => setFormData(prev => ({ ...prev, topayAmount: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trucktopayAmount">Truck To Pay Amount</Label>
                  <Input
                    id="trucktopayAmount"
                    type="number"
                    placeholder="Enter Truck To Pay Amount"
                    value={formData.trucktopayAmount}
                    onChange={e => setFormData(prev => ({ ...prev, trucktopayAmount: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Create Bilty
        </Button>
      </form>
    </div>
  )
}

