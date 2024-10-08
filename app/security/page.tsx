"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

interface PasswordResetAttempt {
  id: string
  userId: string
  timestamp: string
  success: boolean
}

interface SecurityEvent {
  id: string
  userId: string
  eventType: string
  timestamp: string
  details: string
}

export default function SecurityPage() {
  const [passwordResetAttempts, setPasswordResetAttempts] = useState<PasswordResetAttempt[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSecurityData()
  }, [])

  const fetchSecurityData = async () => {
    setLoading(true)
    try {
      const passwordResetQuery = query(collection(db, 'passwordResetAttempts'), orderBy('timestamp', 'desc'), limit(10))
      const passwordResetSnapshot = await getDocs(passwordResetQuery)
      setPasswordResetAttempts(passwordResetSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PasswordResetAttempt)))

      const securityEventsQuery = query(collection(db, 'securityEvents'), orderBy('timestamp', 'desc'), limit(10))
      const securityEventsSnapshot = await getDocs(securityEventsQuery)
      setSecurityEvents(securityEventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SecurityEvent)))
    } catch (error) {
      console.error('Error fetching security data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading security data...</div>

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Security Dashboard</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Password Reset Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Success</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {passwordResetAttempts.map((attempt) => (
                <TableRow key={attempt.id}>
                  <TableCell>{attempt.userId}</TableCell>
                  <TableCell>{new Date(attempt.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{attempt.success ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.userId}</TableCell>
                  <TableCell>{event.eventType}</TableCell>
                  <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{event.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}