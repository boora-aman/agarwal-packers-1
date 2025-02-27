import { saveAs } from "file-saver";
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { ToWords } from 'to-words';

// Function to generate a PDF
export async function generatePDF(receiptData: any, wordFile: File) {
  try {
    const arrayBuffer = await wordFile.arrayBuffer();
    
    // Format date properly
    const formattedDate = receiptData.date 
      ? new Date(receiptData.date.$date || receiptData.date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      : '';

    // Format datebook properly
    const formattedDatebook = receiptData.datebook 
      ? new Date(receiptData.datebook.$date || receiptData.datebook).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      : '';

    // Create replacements object
    const replacements = {
      mrNo: receiptData.mrNo || '',
      date: formattedDate,
      customerName: receiptData.customerName || '',
      fromCity: receiptData.fromCity || '',
      biltyNo: receiptData.biltyNo || '',
      billNo: receiptData.billNo || '',
      NoPackage: receiptData.NoPackage || '',
      datebook: formattedDatebook || '',
      Cash: receiptData.cash || '',
      Cheque: receiptData.cheque || '',
      Account: receiptData.account || '',
      RupeesText: (() => {
        const toWords = new ToWords({
          localeCode: 'en-IN',
          converterOptions: {
            currency: true,
            ignoreDecimal: false,
            ignoreZeroCurrency: false,
          }
        });
        const amount = parseFloat(receiptData.totalamount) || 0;
        return toWords.convert(Math.round(amount), { currency: true }) || '';
      })(),
      freight: receiptData.charges?.freight.toString() || '',
      carTransport: receiptData.charges?.carTransport.toString() || '',
      PackUnpack: receiptData.charges?.PackUnpack.toString() || '',
      LoadUnload: receiptData.charges?.LoadUnload.toString() || '',
      GstCharges: receiptData.charges?.GstCharges.toString() || '',
      StCharges: receiptData.charges?.StCharges.toString() || '',
      InsCharges: receiptData.charges?.insCharges.toString() || '',
      TotalAmount: receiptData.totalamount || calculateTotal(receiptData.charges),

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
    saveAs(docBlob, `Receipt_${receiptData.customerName}_${receiptData.mrNo}.docx`);
  } catch (error) {
    console.error("Error generating document:", error);
    throw error;
  }
}

// Helper function to calculate total amount
function calculateTotal(charges: any) {
  if (!charges) return '0';
  
  const chargeTypes = [
    'freight',
    'carTransport',
    'PackUnpack',
    'LoadUnload',
    'GstCharges',
    'insCharges',
    'totalAmount'
  ];

  return chargeTypes
    .reduce((total, type) => total + (Number(charges[type]) || 0), 0)
    .toString();
}
