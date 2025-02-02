'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Timeline, TimelineItem, TimelineDot, TimelineContent, TimelineSeparator, TimelineConnector } from '@/components/ui/timeline';
import EditShipmentForm from "./edit-shipment-form";

type TransitStop = {
  location: string;
  expectedArrival: string;
  expectedDeparture: string;
  status: string;
  notes?: string;
};

type ShipmentUpdate = {
  date: string;
  status: string;
  location: string;
  notes?: string;
};

type ShipmentData = {
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
};

const getTransitStopStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-500';
    case 'in_progress':
      return 'bg-blue-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'delayed':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-500';
    case 'in_progress':
      return 'bg-blue-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'delayed':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getCurrentStatus = (transitStops: TransitStop[], bookingDate: string): { status: string, currentLocation: string } => {
  const now = new Date();
  
  // If there are no transit stops, return booking confirmed
  if (!transitStops || transitStops.length === 0) {
    return { status: 'Booking Confirmed', currentLocation: '' };
  }

  // Find the most recent active or completed stop
  for (let i = transitStops.length - 1; i >= 0; i--) {
    const stop = transitStops[i];
    const status = stop.status.toLowerCase();
    
    // If this stop is arrived/completed/departed, this is our current location
    if (status === 'arrived' || status === 'completed' || status === 'departed') {
      return { 
        status: 'In Transit', 
        currentLocation: stop.location 
      };
    }
  }

  // If no stops are marked as arrived/completed, check the current time against stop schedules
  for (let i = 0; i < transitStops.length; i++) {
    const stop = transitStops[i];
    const arrivalDate = new Date(stop.expectedArrival);
    const departureDate = new Date(stop.expectedDeparture);

    if (now < arrivalDate) {
      // If we haven't reached this stop yet
      if (i === 0) {
        return { 
          status: 'Booking Confirmed', 
          currentLocation: transitStops[0].location 
        };
      } else {
        return { 
          status: 'In Transit', 
          currentLocation: transitStops[i-1].location 
        };
      }
    } else if (now >= arrivalDate && now <= departureDate) {
      // If we're currently at this stop
      return { 
        status: 'At Stop', 
        currentLocation: stop.location 
      };
    }
  }

  // If we've passed all stops
  const lastStop = transitStops[transitStops.length - 1];
  return { 
    status: 'Delivered', 
    currentLocation: lastStop.location 
  };
};

const ShipmentDetails = ({ shipment }: { shipment: ShipmentData }) => {
  console.log('Rendering ShipmentDetails with shipment:', shipment);
  
  // Calculate current status and location based on transit stops
  const { status, currentLocation } = getCurrentStatus(shipment.transitStops, shipment.bookingDate);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Shipment Details</CardTitle>
        <CardDescription>Tracking Number: {shipment.trackingNumber}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Customer Details</h3>
            <p><span className="font-medium">Name:</span> {shipment.customerName}</p>
            <p><span className="font-medium">Mobile:</span> {shipment.customerMobile}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Shipment Details</h3>
            <p><span className="font-medium">Status:</span> {status}</p>
            <p><span className="font-medium">Booking Date:</span> {new Date(shipment.bookingDate).toLocaleDateString()}</p>
            <p><span className="font-medium">Expected Delivery:</span> {new Date(shipment.estimatedDelivery).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Route Information</h3>
          <p><span className="font-medium">Origin:</span> {shipment.origin}</p>
          <p><span className="font-medium">Destination:</span> {shipment.destination}</p>
          <p><span className="font-medium">Current Location:</span> {currentLocation}</p>
        </div>

        {shipment.transitStops && shipment.transitStops.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Transit Stops</h3>
            <Timeline>
              {shipment.transitStops.map((stop, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot className={getTransitStopStatusColor(stop.status)} />
                    {index < shipment.transitStops.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <div className="ml-4">
                      <h4 className="font-medium">{stop.location}</h4>
                      <p className="text-sm text-gray-600">
                        Arrival: {new Date(stop.expectedArrival).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Departure: {new Date(stop.expectedDeparture).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Status: {stop.status}</p>
                      {stop.notes && (
                        <p className="text-sm text-gray-600 mt-1">Notes: {stop.notes}</p>
                      )}
                    </div>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        )}

        {shipment.updates && shipment.updates.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Recent Updates</h3>
            <Timeline>
              {shipment.updates.map((update, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot className={getStatusColor(update.status)} />
                    {index < shipment.updates.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <div className="ml-4">
                      <p className="font-medium">{update.status}</p>
                      <p className="text-sm text-gray-600">{new Date(update.date).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{update.location}</p>
                      {update.notes && <p className="text-sm text-gray-600">{update.notes}</p>}
                    </div>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function TrackingForm() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const mockShipmentData: ShipmentData = {
    trackingNumber: '2234',
    customerName: 'Aman Boora',
    customerMobile: '2222222222',
    status: 'Booking Confirmed',
    origin: 'dehra',
    destination: 'fdfdf',
    currentLocation: 'dehra',
    bookingDate: '2025-02-02T10:00:00',
    estimatedDelivery: '2025-02-04T18:00:00',
    transitStops: [
      {
        location: 'dehra',
        expectedArrival: '2025-02-02T14:00:00',
        expectedDeparture: '2025-02-02T16:00:00',
        status: 'Scheduled'
      },
      {
        location: 'fdfdf',
        expectedArrival: '2025-02-04T14:00:00',
        expectedDeparture: '2025-02-04T16:00:00',
        status: 'Scheduled'
      }
    ],
    updates: [
      {
        date: '2025-02-02T10:00:00',
        status: 'Booking Confirmed',
        location: 'dehra',
        notes: 'Shipment booked successfully'
      }
    ]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShipment(null);
    setLoading(true);

    try {
      console.log('Fetching shipment for tracking number:', trackingNumber);
      const response = await fetch(`/api/shipments?trackingNumber=${encodeURIComponent(trackingNumber)}`);
      const data = await response.json();
      console.log('API Response:', { status: response.status, data });

      if (response.ok) {
        console.log('Setting shipment data:', data);
        setShipment(data);
      } else {
        console.error('API error:', data.error);
        setError(data.error || 'Failed to fetch shipment details');
      }
    } catch (error) {
      console.error('Error fetching shipment:', error);
      setError('Error fetching shipment details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedShipment: ShipmentData) => {
    setShipment(updatedShipment);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return dateString;
    }
  };

  return (
    <div className="w-full">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Track Your Shipment</CardTitle>
          <CardDescription>Enter your tracking number to get real-time updates</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter Tracking Number"
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Tracking...' : 'Track'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {shipment && (
        <div className="mt-6">
          <ShipmentDetails shipment={shipment} />
        </div>
      )}
    </div>
  );
}
