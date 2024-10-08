"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function BulkEmailPage() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const handleSendEmail = async () => {
    // Implement sending bulk email using Firebase Cloud Functions (to be implemented)
    console.log('Sending bulk email:', { subject, message })
    // Reset form after sending
    setSubject('')
    setMessage('')
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Send Bulk Email</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter email message"
            rows={6}
          />
        </div>
        <Button onClick={handleSendEmail}>Send Bulk Email</Button>
      </div>
    </div>
  )
}