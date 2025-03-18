"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Configure system notifications and alerts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Email Notifications</h3>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-new-application">New Loan Application</Label>
              <Switch id="email-new-application" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-application-status">Application Status Change</Label>
              <Switch id="email-application-status" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-new-donation">New Donation</Label>
              <Switch id="email-new-donation" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-repayment-due">Repayment Due Reminder</Label>
              <Switch id="email-repayment-due" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-repayment-overdue">Repayment Overdue Alert</Label>
              <Switch id="email-repayment-overdue" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-system-alerts">System Alerts</Label>
              <Switch id="email-system-alerts" defaultChecked />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">In-App Notifications</h3>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="app-new-application">New Loan Application</Label>
              <Switch id="app-new-application" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="app-application-status">Application Status Change</Label>
              <Switch id="app-application-status" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="app-new-donation">New Donation</Label>
              <Switch id="app-new-donation" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="app-repayment-due">Repayment Due Reminder</Label>
              <Switch id="app-repayment-due" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="app-repayment-overdue">Repayment Overdue Alert</Label>
              <Switch id="app-repayment-overdue" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="app-system-alerts">System Alerts</Label>
              <Switch id="app-system-alerts" defaultChecked />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Notification Schedule</h3>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="schedule-daily-summary">Daily Summary</Label>
              <Switch id="schedule-daily-summary" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="schedule-weekly-report">Weekly Report</Label>
              <Switch id="schedule-weekly-report" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="schedule-monthly-report">Monthly Report</Label>
              <Switch id="schedule-monthly-report" defaultChecked />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Notification Settings</Button>
      </CardFooter>
    </Card>
  )
}

