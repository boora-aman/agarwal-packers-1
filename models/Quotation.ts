import mongoose from "mongoose"

const ChargesSchema = new mongoose.Schema({
  freightCharges: { type: Number, default: 0 },
  carTransportationCharges: { type: Number, default: 0 },
  packingCharges: { type: Number, default: 0 },
  unpackingCharges: { type: Number, default: 0 },
  loadingCharges: { type: Number, default: 0 },
  unloadingCharges: { type: Number, default: 0 },
}, { _id: false })

const QuotationSchema = new mongoose.Schema({
  quotationNo: {
    type: String,
    required: [true, "Quotation number is required"],
    unique: true,
    trim: true
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
    default: Date.now
  },
  vehicleType: {
    type: String,
    required: [true, "Vehicle type is required"],
    trim: true
  },
  customerName: {
    type: String,
    required: [true, "Customer name is required"],
    trim: true
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    required: [false, "Email is required"],
    default: ""
  },
  mobileNo: {
    type: String,
    required: [true, "Mobile number is required"],
    trim: true
  },
  fromCity: {
    type: String,
    required: [true, "Origin city is required"],
    trim: true
  },
  toCity: {
    type: String,
    required: [true, "Destination city is required"],
    trim: true
  },
  installationCharges: {
    type: String,
    required: [false, "Installation charges are required"],
    default: "N/A"
  },
  stationeryCharges: {
    type: String,
    required: [false, "Stationery charges are required"],
    default: "U/B"
  },
  tollCharges: {
    type: String,
    required: [false, "Toll charges are required"],
    default: "N/A"
  },
  gstCharges: {
    type: String,
    required: [false, "GST charges are required"],
    default: "Extra"
  },
  insuranceCharges: {
    type: String,
    required: [false, "Insurance charges are required"],
    default: "Extra"
  },
  ClientGst: {
    type: String,
    required: [false, "Client GST is required"],
    default: "N/A"
  },
  companyName: {
    type: String,
    required: [false, "Company name is required"],
    default: "N/A"
  },
  insPercentage: {
    type: String,
    required: [false, "Insurance percentage is required"],
    default: "3"
  },
  gstPercentage: {
    type: String,
    required: [false, "GST percentage is required"],
    default: "18"
  },
  charges: {
    type: ChargesSchema,
    default: () => ({
      freightCharges: 0,
      carTransportationCharges: 0,
      packingCharges: 0,
      unpackingCharges: 0,
      loadingCharges: 0,
      unloadingCharges: 0,
    })
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  strict: false
})

export const Quotation = mongoose.models.Quotation || mongoose.model("Quotation", QuotationSchema)


