"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/utils/generatebill";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";

export default function DownloadBill({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [bill, setBill] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchBill();
  }, [params.id]);

  const fetchBill = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`/api/bills/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setBill(data);
      } else {
        console.error("Failed to fetch bill");
      }
    } catch (err) {
      console.error("Error fetching bill:", err);
    }
  };

  const handleDownload = async () => {
    if (!bill) {
      alert("Bill data not available.");
      return;
    }

    setIsGenerating(true);
    try {
      // Fetch the template from public folder
      const templateResponse = await fetch('/templates/bills-template.docx');
      const templateBlob = await templateResponse.blob();
      const templateFile = new File([templateBlob], 'bills-template.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      await generatePDF(bill, templateFile);
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Failed to generate document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!bill) return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 pt-24 py-8">
      <h1 className="text-2xl font-bold mb-4">Download Bill</h1>
      
      <div className="mb-4">
        <p className="text-gray-600">Bill Number: {bill.billNo}</p>
        <p className="text-gray-600">Customer: {bill.customerName}</p>
      </div>
      
      <Button 
        onClick={handleDownload} 
        disabled={isGenerating}
        className="flex items-center gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating Document...
          </>
        ) : (
          'Download Document'
        )}
      </Button>
    </div>
  );
}
