"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/utils/generatePDF";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";

export default function DownloadQuotation({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [quotation, setQuotation] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchQuotation();
  }, [params.id]);

  const fetchQuotation = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`/api/quotations/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setQuotation(data);
      } else {
        console.error("Failed to fetch quotation");
      }
    } catch (err) {
      console.error("Error fetching quotation:", err);
    }
  };

  const handleDownload = async () => {
    if (!quotation) {
      alert("Quotation data not available.");
      return;
    }

    setIsGenerating(true);
    try {
      // Fetch the template from public folder
      const templateResponse = await fetch('/templates/quotation-template.docx');
      const templateBlob = await templateResponse.blob();
      const templateFile = new File([templateBlob], 'quotation-template.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      await generatePDF(quotation, templateFile);
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Failed to generate document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!quotation) return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 pt-24 py-8">
      <h1 className="text-2xl font-bold mb-4">Download Quotation</h1>
      
      <div className="mb-4">
        <p className="text-gray-600">Quotation Number: {quotation.quotationNo}</p>
        <p className="text-gray-600">Customer: {quotation.customerName}</p>
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
