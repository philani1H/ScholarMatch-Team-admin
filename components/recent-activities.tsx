"use client"

import { useEffect, useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

interface Activity {
  id: string
  userId: string
  action: string
  timestamp: string
}

export function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities')
      if (!response.ok) throw new Error('Failed to fetch activities')
      const data = await response.json()
      setActivities(data.slice(0, 5))  // Get only the 5 most recent activities
    } catch (error) {
      console.error('Error fetching activities:', error)
    }
  }

  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{activity.userId.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.userId}</p>
            <p className="text-sm text-muted-foreground">
              {activity.action}
            </p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {new Date(activity.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}