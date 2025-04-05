import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';

// Function to execute a command and return a promise
function executeCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing command: ${error.message}`);
        return;
      }
      if (stderr) {
        console.warn(`Command stderr: ${stderr}`);
      }
      resolve(stdout);
    });
  });
}

// Check if LibreOffice is installed on the server
async function isLibreOfficeInstalled(): Promise<boolean> {
  try {
    await executeCommand('libreoffice --version');
    return true;
  } catch (error) {
    console.warn('LibreOffice not found:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the form data with the docx file
    const formData = await request.formData();
    const docxFile = formData.get('file') as File;
    
    if (!docxFile) {
      return NextResponse.json(
        { error: 'No DOCX file provided' },
        { status: 400 }
      );
    }
    
    // Check if LibreOffice is installed
    const libreOfficeAvailable = await isLibreOfficeInstalled();
    
    if (libreOfficeAvailable) {
      // Use LibreOffice for conversion (best quality)
      return await convertWithLibreOffice(docxFile);
    } else {
      // Use browser-based conversion as fallback
      return NextResponse.json(
        { 
          error: 'LibreOffice not available on server',
          fallback: true,
          message: 'Please use browser-based conversion'
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    );
  }
}

// Function to convert DOCX to PDF using LibreOffice
async function convertWithLibreOffice(docxFile: File) {
  try {
    // Create temporary file paths
    const tempDir = os.tmpdir();
    const uniqueId = uuidv4();
    const docxPath = path.join(tempDir, `${uniqueId}.docx`);
    const pdfPath = path.join(tempDir, `${uniqueId}.pdf`);
    
    // Save the uploaded DOCX to a temporary file
    const buffer = Buffer.from(await docxFile.arrayBuffer());
    await fs.writeFile(docxPath, buffer);
    
    // Convert DOCX to PDF using LibreOffice
    // This command runs LibreOffice in headless mode to convert the file
    const libreOfficeCommand = `libreoffice --headless --convert-to pdf --outdir "${tempDir}" "${docxPath}"`;
    
    // Execute the LibreOffice command
    await executeCommand(libreOfficeCommand);
    
    // Read the generated PDF
    const pdfBuffer = await fs.readFile(pdfPath);
    
    // Clean up temporary files
    try {
      await fs.unlink(docxPath);
      await fs.unlink(pdfPath);
    } catch (cleanupError) {
      console.error('Error cleaning up temp files:', cleanupError);
    }
    
    // Return the PDF as a response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${docxFile.name.replace('.docx', '.pdf')}"`,
      },
    });
  } catch (error) {
    console.error('LibreOffice conversion error:', error);
    throw error;
  }
} 