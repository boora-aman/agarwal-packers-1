'use client'

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditQuotationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quotationId = searchParams.get("id");
  const [quotationData, setQuotationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (quotationId) {
      fetchQuotationData();
    }
  }, [quotationId]);

  async function fetchQuotationData() {
    try {
      const response = await fetch(`/api/quotations/${quotationId}`);
      if (response.ok) {
        const data = await response.json();
        setQuotationData(data);
      } else {
        console.error("Failed to fetch quotation");
      }
    } catch (err) {
      console.error("Error fetching quotation:", err);
    }
  }

  async function handleUpdate(formData: FormData) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/quotations/${quotationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      if (response.ok) {
        router.push("/admin/billing/quotations");
      } else {
        setError("Failed to update the quotation.");
      }
    } catch (err) {
      console.error("Error updating quotation:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  if (!quotationData) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Quotation #{quotationData.quotationNo}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleUpdate(formData);
          }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quotationNo">Quotation No.</Label>
                <Input id="quotationNo" name="quotationNo" defaultValue={quotationData.quotationNo} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" defaultValue={quotationData.date} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input id="customerName" name="customerName" defaultValue={quotationData.customerName} required />
              </div>
              {/* Repeat similar fields for all other inputs */}
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/billing/quotations")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Quotation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
