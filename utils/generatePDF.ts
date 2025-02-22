import { saveAs } from "file-saver";
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

// Function to generate a PDF
export async function generatePDF(quotationData: any, wordFile: File) {
  try {
    const arrayBuffer = await wordFile.arrayBuffer();
    
    // Format date properly
    const formattedDate = quotationData.date 
      ? new Date(quotationData.date.$date || quotationData.date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      : '';

    // Create replacements object
    const replacements = {
      quotationNo: quotationData.quotationNo || '',
      date: formattedDate,
      customerName: quotationData.customerName || '',
      address: quotationData.address || '',
      mobileNo: quotationData.mobileNo || '',
      email: quotationData.email || '',
      fromCity: quotationData.fromCity || '',
      toCity: quotationData.toCity || '',
      vehicleType: quotationData.vehicleType || '',
      companyName: quotationData.companyName || '',
      ClientGst: quotationData.ClientGst || '',
      insPercentage: quotationData.insPercentage || '',
      gstPercentage: quotationData.gstPercentage || '',
      installationCharges: quotationData.installationCharges || '',
      stationeryCharges: quotationData.stationeryCharges || '',
      tollCharges: quotationData.tollCharges || '',
      gstCharges: quotationData.gstCharges || '',
      insuranceCharges: quotationData.insuranceCharges || '',
      freightCharges: quotationData.charges?.freightCharges?.toString() || '0',
      carTransportationCharges: quotationData.charges?.carTransportationCharges?.toString() || '0',
      packingCharges: quotationData.charges?.packingCharges?.toString() || '0',
      unpackingCharges: quotationData.charges?.unpackingCharges?.toString() || '0',
      loadingCharges: quotationData.charges?.loadingCharges?.toString() || '0',
      unloadingCharges: quotationData.charges?.unloadingCharges?.toString() || '0',
      totalAmount: quotationData.totalAmount || calculateTotal(quotationData.charges),
    };

    // Initialize template with PizZip
    const zip = new PizZip(arrayBuffer);
    
    // Create docxtemplater instance
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true
    });
    
    // Set the template variables
    doc.setData(replacements);

    try {
      // Render the document (replace all placeholders with values)
      doc.render();
    } catch (error) {
      console.error('Error rendering document:', error);
      throw error;
    }

    // Get the modified document as a blob
    const docBlob = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    // Save the DOCX file
    saveAs(docBlob, `Quotation_${quotationData.quotationNo}.docx`);
  } catch (error) {
    console.error("Error generating document:", error);
    throw error;
  }
}

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
