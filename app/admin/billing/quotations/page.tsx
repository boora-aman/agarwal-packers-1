import Link from "next/link";
import { getQuotations } from "@/app/actions/quotation";
import { Button } from "@/components/ui/button";
import { BillingNav } from "@/app/admin/billing/components/billing-nav";
import QuotationsList from "@/app/admin/billing/components/QuotationList";

export default async function QuotationsPage() {
  const quotations = await getQuotations();

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="mb-6">
        <BillingNav />
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Quotations</h1>
        <Button asChild>
          <Link href="/admin/billing/quotations/create">Create New Quotation</Link>
        </Button>
      </div>

      <QuotationsList quotations={quotations} />
    </div>
  );
}