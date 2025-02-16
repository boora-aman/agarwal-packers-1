'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

interface Quotation {
  _id: string;
  quotationNo: string;
  date: string;
  customerName: string;
}

interface QuotationsListProps {
  quotations: Quotation[];
}

export default function QuotationsList({ quotations }: QuotationsListProps) {
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this quotation?")) {
      try {
        const token = Cookies.get("token");
        const response = await fetch(`/api/quotations/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert("Quotation deleted successfully.");
          window.location.reload();
        } else {
          alert("Failed to delete the quotation.");
        }
      } catch (error) {
        console.error("Error deleting quotation:", error);
        alert("An error occurred while deleting the quotation.");
      }
    }
  };

  return (
    <div className="grid gap-4">
      {quotations.map((quotation) => (
        <div key={quotation._id} className="border rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="font-medium">Quotation #{quotation.quotationNo}</p>
            <p className="text-sm text-muted-foreground">{new Date(quotation.date).toLocaleDateString()}</p>
            <p className="text-sm">{quotation.customerName}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/billing/quotations/${quotation._id}/download`}>Download</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/admin/billing/quotations/${quotation._id}/edit`}>Edit</Link>
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(quotation._id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
} 