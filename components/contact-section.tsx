"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    const form = e.target
    const formData = {
      name: form.elements.name.value,
      phone: form.elements.phone.value,
      email: form.elements.email.value,
      movingFrom: form.elements.movingFrom.value,
      movingTo: form.elements.movingTo.value,
      details: form.elements.details.value,
    }

    try {
      console.log('Sending request with data:', formData)
      
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        // Handle non-JSON responses
        const text = await response.text()
        console.error('Received non-JSON response:', text)
        throw new Error('Received invalid response from server')
      }
      
      if (response.ok) {
        console.log('Success response:', data)
        setStatus({ 
          type: 'success', 
          message: 'Thank you! We will get back to you shortly.' 
        })
        form.reset()
      } else {
        console.error('Error response:', data)
        throw new Error(data.message || 'Failed to send email')
      }
    } catch (error) {
      console.error('Detailed error:', error)
      setStatus({ 
        type: 'error', 
        message: error instanceof Error && error.message === 'Received invalid response from server'
          ? 'Unable to reach the server. Please try again later.'
          : `Error: ${error instanceof Error ? error.message : 'Failed to send email. Please try again.'}`
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              Contact us for a free quote or any queries about our services.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600">+91 93681 08590</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">info@agarwalpackersnmovers.in</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600">
                    175, EC Road, Race Course, Dehradun, Uttarakhand 248001, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {status.message && (
                <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
                  <AlertDescription>{status.message}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid sm:grid-cols-2 gap-4">
                <Input name="name" placeholder="Your Name" required />
                <Input name="phone" type="tel" placeholder="Phone Number" required />
              </div>
              
              <Input name="email" type="email" placeholder="Email Address" required />
              
              <div className="grid sm:grid-cols-2 gap-4">
                <Input name="movingFrom" placeholder="Moving From" required />
                <Input name="movingTo" placeholder="Moving To" required />
              </div>
              
              <Textarea name="details" placeholder="Additional Details" rows={4} />
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Get Free Quote"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}