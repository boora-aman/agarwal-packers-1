import TrackingForm from '@/components/tracking-form';

export default function TrackingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Track Your Shipment</h1>
      <div className="max-w-6xl mx-auto">
        <TrackingForm />
      </div>
    </div>
  );
}
