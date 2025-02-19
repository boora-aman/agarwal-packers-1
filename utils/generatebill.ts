import { saveAs } from "file-saver";
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

// Function to generate a PDF
export async function generatePDF(billData: any, wordFile: File) {
  try {
    const arrayBuffer = await wordFile.arrayBuffer();
    
    // Format date properly
    const formattedDate = billData.date 
      ? new Date(billData.date.$date || billData.date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      : '';

    // Create replacements object
    const replacements = {
      billNo: billData.billNo || '',
      date: formattedDate,
      customerName: billData.customerName || '',
      address: billData.address || '',
      mobileNo: billData.mobileNo || '',
      email: billData.email || '',
      fromCity: billData.fromCity || '',
      toCity: billData.toCity || '',
      weight: billData.weight || '',
      distance: billData.distance || '',
      ClientGst: billData.ClientGst || '',
      StateCode: billData.StateCode || '',
      biltyNo: billData.biltyNo || '',
      NoPackage: billData.NoPackage || '',
      insPercentage: billData.insPercentage || '',
      insValue: billData.insValue || '',
      GstPercentage: billData.GstPercentage || '',
      freightCharges: billData.charges?.freightCharges?.toString() || '0',
      carTransportationCharges: billData.charges?.carTransportationCharges?.toString() || '0',
      packingCharges: billData.charges?.packingCharges?.toString() || '0',
      unpackingCharges: billData.charges?.unpackingCharges?.toString() || '0',
      loadingCharges: billData.charges?.loadingCharges?.toString() || '0',
      unloadingCharges: billData.charges?.unloadingCharges?.toString() || '0',
      installationCharges: billData.charges?.installationCharges?.toString() || '0',
      stationeryCharges: billData.charges?.stationeryCharges?.toString() || 'U/B',
      tollCharges: billData.charges?.tollCharges?.toString() || 'N/A',
      gstCharges: billData.charges?.gstCharges?.toString() || 'N/A',
      insuranceCharges: billData.charges?.insuranceCharges?.toString() || 'N/A',
      totalAmount: billData.totalAmount || calculateTotal(billData.charges),
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
    saveAs(docBlob, `Bill_${billData.billNo}.docx`);
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
    'installationCharges',
    'stationeryCharges',
    'tollCharges',
    'gstCharges',
    'insuranceCharges'
  ];

  return chargeTypes
    .reduce((total, type) => total + (Number(charges[type]) || 0), 0)
    .toString();
}
