import mongoose from "mongoose";

const ChargesSchema = new mongoose.Schema({
    freight: { type: Number, default: 0 },
    carTransport: { type: Number, default: 0 },
    PackUnpack: { type: Number, default: 0 },
    LoadUnload: { type: Number, default: 0 },
    GstCharges: { type: Number, default: 0 },
    insCharges: { type: Number, default: 0 },
    StCharges: { type: Number, default: 0 }
}, { _id: false })

const ReceiptSchema = new mongoose.Schema({
    mrNo: { type: String, required: true, unique: true },
    date: { type: Date, required: true, default: Date.now },
    customerName: { type: String, required: true },
    fromCity: { type: String, required: true },
    biltyNo: { type: String, required: true },
    billNo: { type: String, required: true },
    NoPackage: { type: String, required: true },
    datebook: { type: Date, required: true },
    cash: { type: String, required: false, default: 0 },
    cheque: { type: String, required: false, default: 0 },
    account: { type: String, required: false, default: 0 },
    rupeestext: { type: String, required: false },
    charges: {
        type: ChargesSchema,
        default: () => ({
            freight: 0,
            carTransport: 0,
            PackUnpack: 0,
            LoadUnload: 0,
            GstCharges: 0,
            insCharges: 0,
            StCharges: 0
        })
    },
    totalamount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
})

export const Receipt = mongoose.models.Receipt || mongoose.model("Receipt", ReceiptSchema)


