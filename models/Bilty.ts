import mongoose from "mongoose"

const ChargesSchema = new mongoose.Schema({
  freightCharges: { type: Number, default: 0 },
  carTransportationCharges: { type: Number, default: 0 },
  packunpackingCharges: { type: Number, default: 0 },
  loadingCharges: { type: Number, default: 0 },
  unloadingCharges: { type: Number, default: 0 }
}, { _id: false })

const BiltySchema = new mongoose.Schema({
  biltyNo: {
    type: String,
    required: [true, "Bilty number is required"],
    unique: true,
    trim: true
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
    default: Date.now
  },
  senderName: {
    type: String,
    required: [true, "Customer name is required"],
    trim: true
  },
  senderaddress: {
    type: String,
    required: [true, "Address is required"],
    trim: true
  },
  receiverName: {
    type: String,
    required: [true, "Receiver name is required"],
    trim: true
  },
  receiveraddress: {
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
  fromContactNo: {
    type: String,
    required: [true, "Mobile number is required"],
    trim: true
  },
  toContactNo: {
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
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true
  },
  weight: {
    type: String,
    required: [true, "Weight is required"],
    default: 0
  },
  distance: {
    type: String,
    required: [true, "Distance is required"],
    default: ""
  },
  NoPackage: {
    type: String,
    required: [true, "No of Package is required"],
    default: 0
  },
  packingType: {
    type: String,
    required: [true, "Packing type is required"],
    default: "N/A"
  },
  deliverytype: {
    type: String,
    required: [true, "Delivery type is required"],
    default: "N/A"
  },
  billno: {
    type: String,
    required: [true, "Bill number is required"],
    default: "N/A"
  },
  bikeno: {
    type: String,
    required: [true, "Bike number is required"],
    default: 0
  },
  carno: {
    type: String,
    required: [true, "Car number is required"],
    default: 0
  },
  vehicleNo: {
    type: String,
    required: [true, "Vehicle number is required"],
    default: 0
  },
  vehicleType: {
    type: String,
    required: [true, "Vehicle type is required"],
    default: "N/A"
  },
  paidAmount: {
    type: Number,
    required: [true, "Paid amount is required"],
    default: 0
  },
  topayAmount: {
    type: Number,
    required: [true, "To pay amount is required"],
    default: 0
  },
  trucktopayAmount: {
    type: Number,
    required: [true, "Truck to pay amount is required"],
    default: 0
  },
  gstserviceinsCharges: {
    type: String,
    required: [false, "GST charges are required"],
    default: "Extra"
  },
  fromGst: {
    type: String,
    required: [false, "Client GST is required"],
    default: "N/A"
  },
  toGst: {
    type: String,
    required: [false, "Client GST is required"],
    default: "N/A"
  },
  insPercentage: {
    type: String,
    required: [false, "Insurance percentage is required"],
    default: "3"
  },
  insAmount: {
    type: String ,
    required: [false, "Insurance amount is required"],
    default: "N/A"
  },
  insType: {
    type: String,
    required: [false, "Insurance type is required"],
    default: "N/A"
  },
  stcharges: {
    type: String,
    required: [false, "ST charges are required"],
    default: "N/A"
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
      packunpackingCharges: 0,
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

export const Bilty = mongoose.models.Bilty || mongoose.model("Bilty", BiltySchema)


