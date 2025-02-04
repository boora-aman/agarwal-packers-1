"use server"

import { revalidatePath } from "next/cache"
import { Quotation } from '@/models/Quotation'
import dbConnect from "@/lib/db"  // Change this line - import default

export async function createQuotation(formData: FormData) {
  try {
    await dbConnect()
    console.log("DB Connected")  // Debug log

    const quotationData = {
      quotationNo: formData.get("quotationNo"),
      date: new Date(formData.get("date") as string),
      vehicleType: formData.get("vehicleType"),
      customerName: formData.get("customerName"),
      address: formData.get("address"),
      email: formData.get("email"),
      mobileNo: formData.get("mobileNo"),
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
        insuranceCharges: Number(formData.get("insuranceCharges")),
      },
    }

    console.log("Attempting to save quotation:", quotationData)  // Debug log

    const newQuotation = new Quotation(quotationData)
    await newQuotation.save()
    console.log("Quotation saved successfully")  // Debug log

    revalidatePath("/admin/billing/quotations")
    return { success: true }
  } catch (error) {
    console.error("Error in createQuotation:", error)  // Detailed error log
    return { success: false, error: error instanceof Error ? error.message : "Failed to create quotation" }
  }
}

export async function getQuotations() {
  try {
    await dbConnect()
    const quotations = await Quotation.find().sort({ createdAt: -1 })
    return quotations
  } catch (error) {
    console.error("Error in getQuotations:", error)
    return []
  }
}

export async function deleteQuotation(id: string) {
  try {
    await dbConnect()
    await Quotation.findByIdAndDelete(id)
    revalidatePath("/admin/billing/quotations")
    return { success: true }
  } catch (error) {
    console.error("Error in deleteQuotation:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete quotation" }
  }
}