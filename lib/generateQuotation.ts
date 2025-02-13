import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Function to generate and download the PDF
export async function generateAndDownloadQuotation(quotationData: any) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]); // Adjust page size as needed

  // Set up fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const lineHeight = 15;

  // Set initial position for text
  let y = 750; // Start from the top of the page

  // Function to add text to the page
  const addText = (text: string, x: number, y: number, options?: { fontSize?: number; bold?: boolean }) => {
    page.drawText(text, {
      x,
      y,
      size: options?.fontSize || fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  };

  // Add header
  addText('AGRAWAL PACKERS AND MOVERS', 50, y, { fontSize: 16, bold: true });
  y -= lineHeight * 2;

  addText('INDIA. Record of Largest Movers. An ISO 9001:2015', 50, y);
  y -= lineHeight;

  addText('18002707001, 8120087001', 50, y);
  y -= lineHeight;

  addText('www.agrawalpacker.in | info@agrawalpacker.in', 50, y);
  y -= lineHeight * 2;

  // Add quotation details
  addText(`Quotation No.: ${quotationData.quotationNo}`, 50, y);
  y -= lineHeight;

  addText(`Date: ${quotationData.date}`, 50, y);
  y -= lineHeight;

  addText(`Vehicle Type: ${quotationData.vehicleType}`, 50, y);
  y -= lineHeight;

  addText(`Address: ${quotationData.address}`, 50, y);
  y -= lineHeight;

  addText(`Email ID: ${quotationData.email}`, 50, y);
  y -= lineHeight;

  addText(`Mobile No.: ${quotationData.mobileNo}`, 50, y);
  y -= lineHeight;

  addText(`GST NO.: 23BYNPA8832JfZ9`, 50, y);
  y -= lineHeight;

  addText(`Registration No.: C/891162`, 50, y);
  y -= lineHeight;

  addText(`Trade Mark No.: 4001096`, 50, y);
  y -= lineHeight * 2;

  // Add customer details
  addText('To,', 50, y);
  y -= lineHeight;

  addText(`Mr./Ms./Mss: ${quotationData.customerName}`, 50, y);
  y -= lineHeight;

  addText(`Name of Company: ${quotationData.companyName || 'N/A'}`, 50, y);
  y -= lineHeight;

  addText(`Client GST No.: ${quotationData.clientGSTNo || 'N/A'}`, 50, y);
  y -= lineHeight * 2;

  // Add charges table
  addText('TRANSPORTATION OF USED HOUSE HOLD GOODS & CAR', 50, y, { fontSize: 14, bold: true });
  y -= lineHeight * 2;

  const charges = [
    { label: 'Freight charges of used household goods for personal use', value: quotationData.freightCharges },
    { label: 'Car Transportation Charges', value: quotationData.carTransportationCharges },
    { label: 'Loading in truck Charges', value: quotationData.loadingCharges },
    { label: 'Unloading from truck Charges', value: quotationData.unloadingCharges },
    { label: 'Packing charges (Inclusive of material used Charges)', value: quotationData.packingCharges },
    { label: 'Unpacking charges (Inclusive of Carnage Charges)', value: quotationData.unpackingCharges },
    { label: 'Installation Charges (LEG, Gyser, AC etc.)', value: quotationData.installationCharges },
    { label: 'Stationery Charges', value: quotationData.stationeryCharges },
    { label: 'Toll & Highway charges @ 7.00%', value: quotationData.tollCharges },
    { label: 'GST Charges & Service Charges @ 18%', value: quotationData.gstCharges },
    { label: 'Insurance Charges @ 3%', value: quotationData.insuranceCharges },
  ];

  charges.forEach((charge) => {
    addText(charge.label, 50, y);
    addText(`Rs ${charge.value}`, 400, y);
    y -= lineHeight;
  });

  // Add grand total
  addText('Gross Freight', 50, y);
  addText(`Rs ${quotationData.grossFreight}`, 400, y);
  y -= lineHeight;

  addText('GRAND TOTAL', 50, y, { bold: true });
  addText(`Rs ${quotationData.grandTotal}`, 400, y, { bold: true });
  y -= lineHeight * 2;

  // Add terms and conditions
  addText('TERMS & CONDITIONS:', 50, y, { bold: true });
  y -= lineHeight;

  const terms = [
    'a) Packing will be done using the best packing materials (such as brown paper, Cora cloth, bubble warp, foam, thermocol, polythene, plastic, high quality corrugated rolls, etc.)',
    'b) We Would request you to pay as @15% of all charges in advance along with your order & balance charges on completion of packing.',
    'c) For insurance the full amount of the premium to be paid in full before departure of the consignment.',
    'd) All payments should be made in favour of MS ARGAWAL PACKERS & MOVERS (IND)',
    'e) We request you to give us 3 days advance notice to give you a prompt service.',
    'f) Service chargers extra (as per Government rules).',
    'g) Gas cylinders will be accepted only in empty condition.',
    'h) Minimum 10 ltrs. petrol / diesel should be available in your car to run up to the ramp point and from ramp to door at delivery point.',
  ];

  terms.forEach((term) => {
    addText(term, 50, y);
    y -= lineHeight;
  });

  // Add footer
  addText('Authorized Sig.', 50, y);
  y -= lineHeight;

  addText('AGRAWAL PACKERS & MOVERS IND', 50, y);
  y -= lineHeight;

  addText('Regd Off: Flat No. 176, Rajendra Park, 3rd Floor, Nangloi New Delhi-110041', 50, y);
  y -= lineHeight;

  addText('Phone No. 9802645555, 18002707001', 50, y);
  y -= lineHeight;

  addText('Please keep your Cash, Jewellery in you Custody Lock. Carrying of Liquor, Gas Cylinder, Acid or any type of Liquid (like Ghee Tin, Oil, Etc.) is totally prohibited)', 50, y);
  y -= lineHeight;

  // Serialize the PDF
  const pdfBytes = await pdfDoc.save();

  // Trigger download
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Quotation_${quotationData.quotationNo}.pdf`;
  link.click();
}