"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/utils/generatePDF";
import Cookies from "js-cookie";

export default function DownloadQuotation({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [quotation, setQuotation] = useState<any>(null);
  const [wordFile, setWordFile] = useState<File | null>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setWordFile(event.target.files[0]);
    }
  };

  const handleDownload = () => {
    if (quotation && wordFile) {
      generatePDF(quotation, wordFile);
    } else {
      alert("Please select a template file before downloading.");
    }
  };

  if (!quotation) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Download Quotation</h1>
      
      <input type="file" accept=".docx" onChange={handleFileChange} className="mb-4" />
      
      <Button onClick={handleDownload}>Download PDF</Button>
    </div>
  );
}
