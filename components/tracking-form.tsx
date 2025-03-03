'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence, useTransform } from 'framer-motion';
import { TruckIcon, MapPinIcon, CalendarIcon, UserIcon, PhoneIcon } from 'lucide-react';


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

const getStatusBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'delayed':
        return 'destructive';
      default:
        return 'outline';
  }
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

const getCurrentStatus = (transitStops: TransitStop[], bookingDate: string): { status: string; currentLocation: string } => {
  const now = new Date();

  if (!transitStops || transitStops.length === 0) {
    return { status: 'Booking Confirmed', currentLocation: '' };
  }

  for (let i = transitStops.length - 1; i >= 0; i--) {
    const stop = transitStops[i];
    const status = stop.status.toLowerCase();

    if (status === 'arrived' || status === 'completed' || status === 'departed') {
      return { status: 'In Transit', currentLocation: stop.location };
    }
  }

  for (let i = 0; i < transitStops.length; i++) {
    const stop = transitStops[i];
    const arrivalDate = new Date(stop.expectedArrival);
    const departureDate = new Date(stop.expectedDeparture);

    if (now < arrivalDate) {
      if (i === 0) {
        return { status: 'Booking Confirmed', currentLocation: transitStops[0].location };
      } else {
        return { status: 'In Transit', currentLocation: transitStops[i - 1].location };
      }
    } else if (now >= arrivalDate && now <= departureDate) {
      return { status: 'At Stop', currentLocation: stop.location };
    }
  }

  const lastStop = transitStops[transitStops.length - 1];
  return { status: 'Delivered', currentLocation: lastStop.location };
};

const TransitTimeline = ({ stops }: { stops: TransitStop[] }) => {
  return (
    <div className="py-4">
      {stops.map((stop, index) => (
        <div key={index} className="relative">
          {/* Vertical line connecting dots */}
          {index < stops.length - 1 && (
            <div className="absolute left-3 top-6 w-0.5 h-full bg-gray-200 z-0"></div>
          )}
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4 mb-6 relative z-10"
          >
            {/* Status dot */}
              <div className={`w-2 h-2 rounded-full 
                ${stop.status.toLowerCase() === 'completed' ? 'bg-green-500' : 
                  stop.status.toLowerCase() === 'in_progress' ? 'bg-blue-500' :
                  stop.status.toLowerCase() === 'pending' ? 'bg-yellow-500' :
                  stop.status.toLowerCase() === 'delayed' ? 'bg-red-500' :
                  'bg-gray-400'}`}
              >
        </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900">{stop.location}</h4>
                <Badge variant={getStatusBadgeVariant(stop.status)}>{stop.status}</Badge>
        </div>
              <div className="text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <p className="flex items-center gap-1.5">
                  <span className="text-gray-400">Arrival:</span> {formatDate(stop.expectedArrival)}
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-gray-400">Departure:</span> {formatDate(stop.expectedDeparture)}
                </p>
          </div>
              {stop.notes && <p className="text-sm text-gray-600 mt-1 italic">{stop.notes}</p>}
          </div>
          </motion.div>
          </div>
      ))}
          </div>
  );
};





const ShipmentDetails = ({ shipment, onEdit }: { shipment: ShipmentData; onEdit: () => void }) => {
  const { status, currentLocation } = getCurrentStatus(shipment.transitStops, shipment.bookingDate);
  const stopIndex = shipment.transitStops.findIndex(stop => stop.location === currentLocation);
  const progress = shipment.transitStops.length > 1 
    ? (stopIndex / (shipment.transitStops.length - 1)) * 100 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-blue-700 text-white">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold">Shipment Details</CardTitle>
              <CardDescription className="text-orange-100 mt-1">
                Tracking Number: {shipment.trackingNumber}
              </CardDescription>
                      </div>
            <Badge variant={getStatusBadgeVariant(status)} className="text-white px-3 py-1">
              {status}
            </Badge>
                    </div>
        </CardHeader>
        
        <CardContent className="pt-4">
            
            <div className="mt-4 flex justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <MapPinIcon size={24} className="text-blue-600" />
                <span>{currentLocation || 'Processing'} - Last Updated Location</span>
              </div>
          </div>
        


          {/* Transit Stops */}
          {shipment.transitStops && shipment.transitStops.length > 0 && (
            <div className="mb-8 pt-4">
              <h3 className="text-gray-800 font-semibold mb-2 px-1.5 pt-2 flex items-center gap-2">
                <MapPinIcon size={18} />
                Transit Stops
              </h3>
              <TransitTimeline stops={shipment.transitStops} />
            </div>
          )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                <TruckIcon size={18} />
                Shipment Information
            </h3>
            <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-500">Booking Date:</span>
                  <span className="font-medium">{formatDate(shipment.bookingDate)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Expected Delivery:</span>
                  <span className="font-medium">{formatDate(shipment.estimatedDelivery)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Current Location:</span>
                  <span className="font-medium">{currentLocation || 'Processing'}</span>
              </p>
            </div>
          </div>

            {/* Customer Details */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                <UserIcon size={18} />
              Customer Details
            </h3>
            <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium">{shipment.customerName}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Mobile:</span>
                  <span className="font-medium">{shipment.customerMobile}</span>
              </p>
            </div>
          </div>
          </div>
      </CardContent>
        
    </Card>
    </motion.div>
  );
};

export default function TrackingForm() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShipment(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/shipments?trackingNumber=${encodeURIComponent(trackingNumber)}`);
      const data = await response.json();

      if (response.ok) {
        setShipment(data);
      } else {
        setError(data.error || 'Failed to fetch shipment details');
      }
    } catch (error) {
      setError('Error fetching shipment details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedShipment: ShipmentData) => {
    setShipment(updatedShipment);
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="mb-8 border-0 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-700 to-orange-600 text-white">
            <CardTitle className="text-xl sm:text-2xl font-bold">Track Your Shipment</CardTitle>
            <CardDescription className="text-blue-100">
              Enter your tracking number to get real-time updates
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-6">
            <form onSubmit={handleSubmit}>
              <div className="relative flex gap-2">
                <Input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter Tracking Number"
                  className="focus-visible:ring-orange-500"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-orange-600 hover:bg-orange-700 transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      <span>Tracking...</span>
                    </div>
                  ) : (
                    'Track'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="mb-8">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {shipment && !isEditing && (
        <ShipmentDetails shipment={shipment} onEdit={handleEdit} />
      )}

    </div>
  );
}