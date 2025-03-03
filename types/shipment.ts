export type ShipmentStatus = 'pending' | 'in_transit' | 'delayed' | 'delivered';

export interface TransitStop {
  location: string;
  expectedArrival: string;
  expectedDeparture: string;
  status: ShipmentStatus;
  notes?: string;
  coords?: { lat: number; lng: number };
}

export interface ShipmentUpdate {
  date: string;
  status: string;
  location: string;
  notes?: string;
}

export interface ShipmentData {
  _id?: string;
  trackingNumber: string;
  customerName: string;
  customerMobile: string;
  status: string;
  origin: string;
  destination: string;
  currentLocation: string;
  estimatedDelivery: string;
  bookingDate: string;
  transitStops: TransitStop[];
  updates: ShipmentUpdate[];
  updatedAt: string;
} 