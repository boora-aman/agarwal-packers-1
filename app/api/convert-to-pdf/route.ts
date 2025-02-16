import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Using CloudConvert API (you'll need to sign up for an API key)
    const cloudConvertApiKey = process.env.CLOUD_CONVERT_API_KEY;
    
    // Create job
    const createJobResponse = await fetch('https://api.cloudconvert.com/v2/jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cloudConvertApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tasks: {
          'import-1': {
            operation: 'import/upload'
          },
          'convert-1': {
            operation: 'convert',
            input: 'import-1',
            output_format: 'pdf',
            engine: 'office'
          },
          'export-1': {
            operation: 'export/url',
            input: 'convert-1'
          }
        }
      })
    });

    const job = await createJobResponse.json();

    // Upload file
    const uploadTask = job.data.tasks.find((task: any) => task.operation === 'import/upload');
    const formData2 = new FormData();
    formData2.append('file', file);
    
    await fetch(uploadTask.result.form.url, {
      method: 'POST',
      body: formData2
    });

    // Wait for conversion
    let exportTask;
    while (!exportTask?.result?.files?.[0]?.url) {
      const jobStatusResponse = await fetch(`https://api.cloudconvert.com/v2/jobs/${job.data.id}`, {
        headers: {
          'Authorization': `Bearer ${cloudConvertApiKey}`
        }
      });
      const jobStatus = await jobStatusResponse.json();
      exportTask = jobStatus.data.tasks.find((task: any) => task.operation === 'export/url');
      if (!exportTask?.result?.files?.[0]?.url) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Download converted file
    const pdfResponse = await fetch(exportTask.result.files[0].url);
    const pdfBlob = await pdfResponse.blob();

    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quotation.pdf"`
      }
    });
  } catch (error) {
    console.error('PDF conversion error:', error);
    return NextResponse.json({ error: 'PDF conversion failed' }, { status: 500 });
  }
} 