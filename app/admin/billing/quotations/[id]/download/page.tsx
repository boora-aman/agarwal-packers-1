"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/utils/generatePDF";
import { Loader2, FileText, Printer } from "lucide-react";
import Cookies from "js-cookie";
import { saveAs } from "file-saver";

export default function DownloadQuotation({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [quotation, setQuotation] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  const handleDownloadDocx = async () => {
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
  
  const handleDownloadPdf = async () => {
    if (!quotation) {
      alert("Quotation data not available.");
      return;
    }

    setIsGeneratingPDF(true);
    try {
      // First, generate the DOCX file
      const templateResponse = await fetch('/templates/quotation-template.docx');
      const templateBlob = await templateResponse.blob();
      const templateFile = new File([templateBlob], `Quotation_${quotation.quotationNo}.docx`, {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      
      // Generate the filled DOCX in memory
      const docxBlob = await generateDocxBlob(quotation, templateFile);
      
      // Send the DOCX for server-side PDF conversion
      const formData = new FormData();
      formData.append('file', docxBlob, `Quotation_${quotation.quotationNo}.docx`);
      
      // Use the server-side conversion API
      const pdfResponse = await fetch('/api/convert-to-pdf', {
        method: 'POST',
        body: formData,
      });
      
      if (pdfResponse.status === 503) {
        // LibreOffice not available, fall back to browser-based solution
        console.log("Server-side conversion not available, falling back to browser-based conversion");
        await handleBrowserPdfConversion(docxBlob, `Quotation_${quotation.quotationNo}.pdf`);
        return;
      }
      
      if (!pdfResponse.ok) {
        throw new Error('PDF conversion failed');
      }
      
      // Get the PDF blob
      const pdfBlob = await pdfResponse.blob();
      
      // Save the PDF file
      saveAs(pdfBlob, `Quotation_${quotation.quotationNo}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  // Fallback function to use browser print to PDF
  const handleBrowserPdfConversion = async (docxBlob: Blob, filename: string) => {
    try {
      // Create a URL for the docx blob
      const docxUrl = URL.createObjectURL(docxBlob);
      
      // Open the document in a new window
      const printWindow = window.open(docxUrl, '_blank');
      
      if (!printWindow) {
        alert('Pop-up blocked. Please allow pop-ups for this site to print as PDF.');
        // Fallback to docx download if pop-up is blocked
        saveAs(docxBlob, filename.replace('.pdf', '.docx'));
        return;
      }
      
      // Wait for the window to load
      const checkLoadInterval = setInterval(() => {
        if (printWindow.document.readyState === 'complete') {
          clearInterval(checkLoadInterval);
          
          // Add a message to the print window
          const messageDiv = printWindow.document.createElement('div');
          messageDiv.style.position = 'fixed';
          messageDiv.style.top = '0';
          messageDiv.style.left = '0';
          messageDiv.style.right = '0';
          messageDiv.style.padding = '20px';
          messageDiv.style.background = '#f0f9ff';
          messageDiv.style.zIndex = '9999';
          messageDiv.style.textAlign = 'center';
          messageDiv.innerHTML = `
            <h3>Please use your browser's "Print" function (Ctrl+P / Cmd+P) and select "Save as PDF"</h3>
            <p>This document will print automatically in a few seconds...</p>
          `;
          printWindow.document.body.prepend(messageDiv);
          
          // Trigger print after a short delay
          setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            
            // Clean up
            setTimeout(() => {
              URL.revokeObjectURL(docxUrl);
            }, 60000); // Cleanup after 1 minute
          }, 2000);
        }
      }, 100);
    } catch (error) {
      console.error('Error in browser PDF conversion:', error);
      alert('Failed to generate PDF. Downloading DOCX instead.');
      saveAs(docxBlob, filename.replace('.pdf', '.docx'));
    }
  };
  
  // Helper function to generate a DOCX blob but not save it
  const generateDocxBlob = async (data: any, wordFile: File): Promise<Blob> => {
    const arrayBuffer = await wordFile.arrayBuffer();
    
    // Format date properly
    const formattedDate = data.date 
      ? new Date(data.date.$date || data.date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      : '';

    // Create replacements object
    const replacements = {
      quotationNo: data.quotationNo || '',
      date: formattedDate,
      customerName: data.customerName || '',
      address: data.address || '',
      mobileNo: data.mobileNo || '',
      email: data.email || '',
      fromCity: data.fromCity || '',
      toCity: data.toCity || '',
      vehicleType: data.vehicleType || '',
      companyName: data.companyName || '',
      ClientGst: data.ClientGst || '',
      insPercentage: data.insPercentage || '',
      gstPercentage: data.gstPercentage || '',
      installationCharges: data.installationCharges || '',
      stationeryCharges: data.stationeryCharges || '',
      tollCharges: data.tollCharges || '',
      gstCharges: data.gstCharges || '',
      insuranceCharges: data.insuranceCharges || '',
      freightCharges: data.charges?.freightCharges?.toString() || '0',
      carTransportationCharges: data.charges?.carTransportationCharges?.toString() || '0',
      packingCharges: data.charges?.packingCharges?.toString() || '0',
      unpackingCharges: data.charges?.unpackingCharges?.toString() || '0',
      loadingCharges: data.charges?.loadingCharges?.toString() || '0',
      unloadingCharges: data.charges?.unloadingCharges?.toString() || '0',
      totalAmount: data.totalAmount || calculateTotal(data.charges),
    };

    // Use libraries to generate the document
    const PizZip = (await import('pizzip')).default;
    const Docxtemplater = (await import('docxtemplater')).default;
    
    // Initialize template with PizZip
    const zip = new PizZip(arrayBuffer);
    
    // Create docxtemplater instance
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true
    });
    
    // Set the template variables
    doc.setData(replacements);
    
    // Render the document
    doc.render();
    
    // Return the blob but don't save it
    return doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
  };
  
  // Helper function to calculate total amount
  function calculateTotal(charges: any) {
    if (!charges) return '0';
    
    const chargeTypes = [
      'freightCharges',
      'carTransportationCharges',
      'packingCharges',
      'unpackingCharges',
      'loadingCharges',
      'unloadingCharges',
    ];
  
    return chargeTypes
      .reduce((total, type) => total + (Number(charges[type]) || 0), 0)
      .toString();
  }

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
      
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={handleDownloadDocx}
          disabled={isGenerating || isGeneratingPDF}
          className="flex items-center gap-2"
          variant="default"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating DOCX...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Download as DOCX
            </>
          )}
        </Button>

        <Button 
          onClick={handleDownloadPdf}
          disabled={isGenerating || isGeneratingPDF}
          className="flex items-center gap-2"
          variant="outline"
        >
          {isGeneratingPDF ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Printer className="h-4 w-4" />
              Save as PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
