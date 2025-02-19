"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import Cookies from "js-cookie"


const chargeLabels = {
    freight: "Freight Charges",
    carTransport: "Car Transportation Charges",
    PackUnpack: "Packing & Unpacking Charges",
    LoadUnload: "Loading & Unloading Charges",
    StCharges: "Stationery Charges",
    GstCharges: "GST Charges",
    insCharges: "Insurance Charges" 
}

export default function EditReceipt({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    mrNo: "",
    date: "",
    customerName: "",
    fromCity: "",
    biltyNo: "",
    billNo: "",
    NoPackage: "",
    datebook: "",
    cash: "",
    cheque: "",
    account: "",
    rupeestext: "",
    charges: {
      freight: "",
      carTransport: "",
      PackUnpack: "",
      LoadUnload: "",
      StCharges: "",
      GstCharges: "",
      insCharges: ""
    },
    totalamount: "0"
  })

  useEffect(() => {
    fetchReceipt()
  }, [params.id])

  const fetchReceipt = async () => {
    try {
      const token = Cookies.get("token")
      const response = await fetch(`/api/receipts/${params.id}`, {
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
      console.error("Error fetching receipt:", error)
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
      const response = await fetch(`/api/receipts/${params.id}`, {
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
        router.push("/admin/billing/receipts")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update receipt")
      }
    } catch (error) {
      console.error("Error updating receipt:", error)
      alert("Failed to update receipt")
    }
  }

  return (
    <div className="container mx-auto px-4 pt-24 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Money Receipt</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <Card>
          <CardContent className="pt-6">
            {/* Basic Details */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="mrNo">Receipt Number</Label>
                <Input
                  id="mrNo"
                  placeholder="Enter Receipt Number"
                  value={formData.mrNo}
                  onChange={e => setFormData(prev => ({ ...prev, mrNo: e.target.value }))}
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
              <h2 className="text-lg font-semibold">Customer Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    placeholder="Enter Customer Name"
                    value={formData.customerName}
                    onChange={e => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location & Freight Details */}
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold">Location & Booking Details</h2>
              <div className="grid md:grid-cols-3 gap-4">
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
                  <Label htmlFor="billNo">Bill Number</Label>
                  <Input
                    id="billNo"
                    placeholder="Enter Bill Number"
                    value={formData.billNo}
                    onChange={e => setFormData(prev => ({ ...prev, billNo: e.target.value }))}
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
                  <Label htmlFor="datebook">Date of Booking</Label>
                  <Input
                    id="datebook"
                    type="date"
                    placeholder="Enter Date of Booking"
                    value={formData.datebook}
                    onChange={e => setFormData(prev => ({ ...prev, datebook: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cash">Amount Paid in Cash</Label>
                  <Input
                    id="cash"
                    placeholder="Enter Amount Paid in Cash"
                    value={formData.cash}
                    onChange={e => setFormData(prev => ({ ...prev, cash: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cheque">Amount Paid by Cheque</Label>
                  <Input
                    id="cheque"
                    placeholder="Enter Amount Paid by Cheque"
                    value={formData.cheque}
                    onChange={e => setFormData(prev => ({ ...prev, cheque: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account">Amount Paid Online</Label>
                  <Input
                    id="account"  
                    placeholder="Enter Amount Paid Online"
                    value={formData.account}
                    onChange={e => setFormData(prev => ({ ...prev, account: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rupeestext">Amount in Words</Label>
                  <Input
                    id="rupeestext"
                    placeholder="Enter Amount in Words"
                    value={formData.rupeestext}
                    onChange={e => setFormData(prev => ({ ...prev, rupeestext: e.target.value }))}
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
            </div>

            {/* Total Amount */}
            <div className="flex items-center space-x-4">
              <Label htmlFor="totalAmount" className="font-semibold">Total Amount:</Label>
              <Input
                id="totalAmount"
                value={formData.totalamount}
                onChange={e => setFormData(prev => ({ ...prev, totalamount: e.target.value }))}
                className="w-48"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            Update Receipt
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}