import TrackingForm from '@/components/tracking-form';

export default function TrackingPage() {
  return (
    <main className="flex flex-col min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center">
            Track Your Shipment
          </h1>
        </div>
        <div className="max-w-6xl mx-auto">
          <TrackingForm />
        </div>
      </div>
    </main>
  );
}