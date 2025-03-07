import mongoose from "mongoose"

const ChargesSchema = new mongoose.Schema({
  freightCharges: { type: Number, default: 0 },
  carTransportationCharges: { type: Number, default: 0 },
  packingCharges: { type: Number, default: 0 },
  unpackingCharges: { type: Number, default: 0 },
  loadingCharges: { type: Number, default: 0 },
  unloadingCharges: { type: Number, default: 0 },
  installationCharges: { type: Number, default: 0 },
  stationeryCharges: { type: Number, default: 0 },
  tollCharges: { type: Number, default: 0 },
  gstCharges: { type: Number, default: 0 },
  insuranceCharges: { type: Number, default: 0 }
}, { _id: false })

const BillsSchema = new mongoose.Schema({
  billNo: {
    type: String,
    required: [true, "Bill number is required"],
    unique: true,
    trim: true
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
    default: Date.now
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
  weight: {
    type: String,
    required: [false, "Weight is not required"],
    default: "Fixed"
  },
  distance: {
    type: String,
    required: [false, "Distance is not required"],
    default: "Fixed"
  },
  ClientGst: {
    type: String,
    required: [false, "Client GST is not required"],
    default: "N/A"
  },
  StateCode: {
    type: String,
    required: [false, "State code is not required"],
    default: "N/A"
  },
  biltyNo: {
    type: String,
    required: [false, "Bilty number is not required"],
    default: "N/A"
  },
  NoPackage: {
    type: String,
    required: [false, "Number of packages is not required"],
    default: "Fixed"
  },
  insPercentage: {
    type: Number,
    required: [false, "Insurance percentage is not required"],
    default: 3
  },
  insValue: {
    type: Number,
    required: [false, "Insurance value is not required"],
    default: 0
  },
  GstPercentage: {
    type: Number,
    required: [false, "GST percentage is not required"],
    default: 18
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
      installationCharges: 0,
      stationeryCharges: 0,
      tollCharges: 0,
      gstCharges: 0,
      insuranceCharges: 0
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

export const Bills = mongoose.models.Bills || mongoose.model("Bills", BillsSchema)


