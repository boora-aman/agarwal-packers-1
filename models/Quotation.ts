import mongoose from "mongoose"

const QuotationSchema = new mongoose.Schema({
  quotationNo: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: String,
  mobileNo: {
    type: String,
    required: true,
  },
  fromCity: {
    type: String,
    required: true,
  },
  toCity: {
    type: String,
    required: true,
  },
  charges: {
    freightCharges: Number,
    carTransportationCharges: Number,
    loadingCharges: Number,
    unloadingCharges: Number,
    packingCharges: Number,
    unpackingCharges: Number,
    installationCharges: Number,
    stationeryCharges: Number,
    tollCharges: Number,
    gstCharges: Number,
    insuranceCharges: Number,
  },
  grossFreight: Number,
  grandTotal: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const Quotation = mongoose.models.Quotation || mongoose.model("Quotation", QuotationSchema)


