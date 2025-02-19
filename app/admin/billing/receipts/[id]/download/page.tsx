"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/utils/generatereceipt";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";

export default function DownloadReceipt({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [receipt, setReceipt] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchReceipt();
  }, [params.id]);

  const fetchReceipt = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`/api/receipts/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setReceipt(data);
      } else {
        console.error("Failed to fetch receipt");
      }
    } catch (err) {
      console.error("Error fetching receipt:", err);
    }
  };

  const handleDownload = async () => {
    if (!receipt) {
      alert("Receipt data not available.");
      return;
    }

    setIsGenerating(true);
    try {
      // Fetch the template from public folder
      const templateResponse = await fetch('/templates/receipt-template.docx');
      const templateBlob = await templateResponse.blob();
      const templateFile = new File([templateBlob], 'receipt-template.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      await generatePDF(receipt, templateFile);
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Failed to generate document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!receipt) return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 pt-24 py-8">
      <h1 className="text-2xl font-bold mb-4">Download Money Receipt</h1>
      
      <div className="mb-4">
        <p className="text-gray-600">Receipt Number: {receipt.mrNo}</p>
        <p className="text-gray-600">Customer: {receipt.customerName}</p>
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
