"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

interface Rules {
  maxLoginAttempts: number
  rapidFireActionCount: number
  rapidFireTimeWindow: number
  unusualHoursStart: number
  unusualHoursEnd: number
}

export default function RulesPage() {
  const [rules, setRules] = useState<Rules>({
    maxLoginAttempts: 5,
    rapidFireActionCount: 10,
    rapidFireTimeWindow: 60,
    unusualHoursStart: 1,
    unusualHoursEnd: 5
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    setLoading(true)
    try {
      const rulesDoc = await getDoc(doc(db, 'settings', 'rules'))
      if (rulesDoc.exists()) {
        setRules(rulesDoc.data() as Rules)
      }
    } catch (error) {
      console.error('Error fetching rules:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRules(prev => ({ ...prev, [name]: parseInt(value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateDoc(doc(db, 'settings', 'rules'), rules)
      alert('Rules updated successfully')
    } catch (error) {
      console.error('Error updating rules:', error)
      alert('Failed to update rules')
    }
  }

  if (loading) return <div>Loading rules...</div>

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Unusual Activity Detection Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="maxLoginAttempts">Max Login Attempts</label>
              <Input
                id="maxLoginAttempts"
                name="maxLoginAttempts"
                type="number"
                value={rules.maxLoginAttempts}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="rapidFireActionCount">Rapid Fire Action Count</label>
              <Input
                id="rapidFireActionCount"
                name="rapidFireActionCount"
                type="number"
                value={rules.rapidFireActionCount}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="rapidFireTimeWindow">Rapid Fire Time Window (seconds)</label>
              <Input
                id="rapidFireTimeWindow"
                name="rapidFireTimeWindow"
                type="number"
                value={rules.rapidFireTimeWindow}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="unusualHoursStart">Unusual Hours Start</label>
              <Input
                id="unusualHoursStart"
                name="unusualHoursStart"
                type="number"
                min="0"
                max="23"
                value={rules.unusualHoursStart}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="unusualHoursEnd">Unusual Hours End</label>
              <Input
                id="unusualHoursEnd"
                name="unusualHoursEnd"
                type="number"
                min="0"
                max="23"
                value={rules.unusualHoursEnd}
                onChange={handleInputChange}
              />
            </div>
            <Button type="submit">Update Rules</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}