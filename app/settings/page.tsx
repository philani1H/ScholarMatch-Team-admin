"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

interface GlobalSettings {
  appInPlayStoreMode: boolean
  emailPreferencesLink: string
  emailsSent: boolean
  maintenanceMode: boolean
  maintenanceUpdatesLink: string
  showDonationPopup: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<GlobalSettings>({
    appInPlayStoreMode: false,
    emailPreferencesLink: "",
    emailsSent: true,
    maintenanceMode: false,
    maintenanceUpdatesLink: "",
    showDonationPopup: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'global'))
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data() as GlobalSettings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string) => {
    setSettings(prev => ({ ...prev, [name]: !prev[name as keyof GlobalSettings] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateDoc(doc(db, 'settings', 'global'), settings)
      alert('Settings updated successfully')
    } catch (error) {
      console.error('Error updating settings:', error)
      alert('Failed to update settings')
    }
  }

  if (loading) return <div>Loading settings...</div>

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Global Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="appInPlayStoreMode">App In Play Store Mode</label>
              <Switch
                id="appInPlayStoreMode"
                checked={settings.appInPlayStoreMode}
                onCheckedChange={() => handleSwitchChange('appInPlayStoreMode')}
              />
            </div>
            <div>
              <label htmlFor="emailPreferencesLink">Email Preferences Link</label>
              <Input
                id="emailPreferencesLink"
                name="emailPreferencesLink"
                type="text"
                value={settings.emailPreferencesLink}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="emailsSent">Emails Sent</label>
              <Switch
                id="emailsSent"
                checked={settings.emailsSent}
                onCheckedChange={() => handleSwitchChange('emailsSent')}
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="maintenanceMode">Maintenance Mode</label>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={() => handleSwitchChange('maintenanceMode')}
              />
            </div>
            <div>
              <label htmlFor="maintenanceUpdatesLink">Maintenance Updates Link</label>
              <Input
                id="maintenanceUpdatesLink"
                name="maintenanceUpdatesLink"
                type="text"
                value={settings.maintenanceUpdatesLink}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="showDonationPopup">Show Donation Popup</label>
              <Switch
                id="showDonationPopup"
                checked={settings.showDonationPopup}
                onCheckedChange={() => handleSwitchChange('showDonationPopup')}
              />
            </div>
            <Button type="submit">Update Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}