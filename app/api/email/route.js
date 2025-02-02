import nodemailer from 'nodemailer'

export async function POST(req) {
  try {
    const body = await req.json()
    const { name, phone, email, movingFrom, movingTo, details } = body
    
    console.log('Received request with data:', { name, phone, email, movingFrom, movingTo, details })

    // Validate required fields
    if (!name || !phone || !email || !movingFrom || !movingTo) {
      console.error('Missing required fields')
      return Response.json({ message: 'Required fields are missing' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email)
      return Response.json({ message: 'Invalid email format' }, { status: 400 })
    }

    // Verify environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing email configuration')
      return Response.json({ message: 'Server email configuration error' }, { status: 500 })
    }

    console.log('Creating transport with:', { 
      user: process.env.EMAIL_USER,
      pass: 'exists:' + !!process.env.EMAIL_PASS 
    })

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: 'professionalhomemoverspackers@gmail.com',
      subject: 'New Moving Quote Request',
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Moving From:</strong> ${movingFrom}</p>
        <p><strong>Moving To:</strong> ${movingTo}</p>
        ${details ? `<p><strong>Additional Details:</strong> ${details}</p>` : ''}
      `,
      text: `
        New Quote Request
        
        Name: ${name}
        Phone: ${phone}
        Email: ${email}
        Moving From: ${movingFrom}
        Moving To: ${movingTo}
        ${details ? `Additional Details: ${details}` : ''}
      `,
    }

    console.log('Attempting to send email with options:', mailOptions)

    await transporter.sendMail(mailOptions)
    console.log('Email sent successfully')
    return Response.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Detailed email error:', error)
    return Response.json({ 
      message: 'Failed to send email', 
      error: error.message,
      details: error.toString()
    }, { status: 500 })
  }
}

// Optionally add GET method to handle direct browser visits
export async function GET() {
  return Response.json({ message: 'Email API endpoint' }, { status: 200 })
}