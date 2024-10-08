"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

interface Application {
  id: string
  userId: string
  status: string
  submittedAt: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const applicationsSnapshot = await getDocs(collection(db, 'applications'))
      const applicationsList = applicationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application))
      setApplications(applicationsList)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading applications...</div>

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Applications</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>{application.userId}</TableCell>
              <TableCell>{application.status}</TableCell>
              <TableCell>{new Date(application.submittedAt).toLocaleString()}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2">View</Button>
                <Button variant="outline">Update Status</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}