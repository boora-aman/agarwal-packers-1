import mongoose from 'mongoose';

const consignmentSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  fromAddress: {
    type: String,
    required: true,
  },
  toAddress: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Booked', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'],
    default: 'Booked',
  },
  items: [{
    description: String,
    quantity: Number,
  }],
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  expectedDeliveryDate: {
    type: Date,
    required: true,
  },
  currentLocation: {
    type: String,
  },
  statusUpdates: [{
    status: String,
    location: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    description: String,
  }],
});

const Consignment = mongoose.models.Consignment || mongoose.model('Consignment', consignmentSchema);

export default Consignment;
