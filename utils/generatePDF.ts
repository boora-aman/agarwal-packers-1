import { saveAs } from "file-saver";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import Mammoth from "mammoth";

// Function to extract text from a Word template
async function extractTextFromDocx(file: File) {
  const reader = new FileReader();
  return new Promise<string>((resolve, reject) => {
    reader.onload = async (event) => {
      if (event.target && event.target.result) {
        const arrayBuffer = event.target.result as ArrayBuffer;
        const result = await Mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

// Function to generate a PDF
export async function generatePDF(quotationData: any, wordFile: File) {
  try {
    const extractedText = await extractTextFromDocx(wordFile);

    // Replace placeholders in the extracted text with actual data
    let pdfContent = extractedText
      .replace("{quotationNo}", quotationData.quotationNo)
      .replace("{date}", new Date(quotationData.date.$date).toLocaleDateString())
      .replace("{customerName}", quotationData.customerName)
      .replace("{address}", quotationData.address)
      .replace("{mobileNo}", quotationData.mobileNo)
      .replace("{email}", quotationData.email)
      .replace("{fromCity}", quotationData.fromCity)
      .replace("{toCity}", quotationData.toCity)
      .replace("{freightCharges}", quotationData.charges.freightCharges.toString())
      .replace("{carTransportationCharges}", quotationData.charges.carTransportationCharges.toString());

    // Create a PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;

    // Add text to the PDF
    const lines = pdfContent.split("\n");
    let yPosition = 750;

    lines.forEach((line) => {
      page.drawText(line, { x: 50, y: yPosition, font, size: fontSize, color: rgb(0, 0, 0) });
      yPosition -= 20;
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, `Quotation_${quotationData.quotationNo}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}
