"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UnusualActivity {
  id: string
  userId: string
  action: string
  timestamp: string
  severity: 'low' | 'medium' | 'high'
}

export default function UnusualActivitiesPage() {
  const [unusualActivities, setUnusualActivities] = useState<UnusualActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUnusualActivities()
  }, [])

  const fetchUnusualActivities = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/unusual-activities')
      if (!response.ok) throw new Error('Failed to fetch unusual activities')
      const data = await response.json()
      setUnusualActivities(data)
    } catch (error) {
      console.error('Error fetching unusual activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500 text-white'
      case 'medium':
        return 'bg-yellow-500 text-black'
      case 'low':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  if (loading) return <div>Loading unusual activities...</div>

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Unusual Activities</h1>
      <div className="grid gap-4">
        {unusualActivities.map((activity) => (
          <Card key={activity.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {activity.userId}
                <Badge className={getSeverityColor(activity.severity)}>
                  {activity.severity}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{activity.action}</p>
              <p className="text-sm text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}