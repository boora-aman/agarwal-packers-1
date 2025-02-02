import mongoose from "mongoose"

const ShipmentSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: [true, "Please provide a tracking number"],
    unique: true,
  },
  customerName: {
    type: String,
    required: [true, "Please provide a customer name"],
  },
  customerMobile: {
    type: String,
    required: [true, "Please provide a customer mobile number"],
    validate: {
      validator: function(v: string) {
        return /^\d{10}$/.test(v)
      },
      message: "Please enter a valid 10-digit mobile number"
    }
  },
  bookingDate: {
    type: Date,
    required: [true, "Please provide a booking date"],
    default: Date.now
  },
  status: {
    type: String,
    required: [true, "Please provide a status"],
    enum: ["Pending", "Picked Up", "In Transit", "Out for Delivery", "Delivered", "Delayed"],
    default: "Pending"
  },
  origin: {
    type: String,
    required: [true, "Please provide an origin"],
  },
  destination: {
    type: String,
    required: [true, "Please provide a destination"],
  },
  currentLocation: {
    type: String,
    required: [true, "Please provide current location"],
  },
  estimatedDelivery: {
    type: Date,
    required: [true, "Please provide an estimated delivery date"],
  },
  transitStops: [{
    location: {
      type: String,
      required: true
    },
    expectedArrival: {
      type: Date,
      required: true
    },
    expectedDeparture: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["Scheduled", "Arrived", "Departed", "Delayed", "Skipped"],
      default: "Scheduled"
    },
    notes: String
  }],
  updates: [{
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    notes: String
  }],
}, {
  timestamps: true
})

// Add a pre-save middleware to update the updates array
ShipmentSchema.pre('save', function(next) {
  const shipment = this;
  
  // If it's a new shipment, add the initial booking update
  if (shipment.isNew) {
    shipment.updates = [{
      date: shipment.bookingDate || new Date(),
      status: "Booking Confirmed",
      location: shipment.origin,
      notes: "Shipment booked successfully"
    }];
  }
  
  // If status or location changed, add a new update
  else if (shipment.isModified('status') || shipment.isModified('currentLocation')) {
    shipment.updates.push({
      date: new Date(),
      status: shipment.status,
      location: shipment.currentLocation,
      notes: shipment.isModified('status') ? `Status updated to ${shipment.status}` : 'Location updated'
    });
  }
  
  next();
});

export default mongoose.models.Shipment || mongoose.model("Shipment", ShipmentSchema)
