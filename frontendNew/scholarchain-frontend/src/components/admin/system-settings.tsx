"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export function SystemSettings() {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="loan">Loan Settings</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure general system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="system-name">System Name</Label>
              <Input id="system-name" defaultValue="Student Loan Management System" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input id="admin-email" defaultValue="admin@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input id="support-email" defaultValue="support@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="system-currency">Default Currency</Label>
              <Input id="system-currency" defaultValue="USD" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="footer-text">Footer Text</Label>
              <Textarea id="footer-text" defaultValue="© 2023 Student Loan Management System. All rights reserved." />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="maintenance-mode" />
              <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="loan">
        <Card>
          <CardHeader>
            <CardTitle>Loan Settings</CardTitle>
            <CardDescription>Configure loan-related settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="min-loan">Minimum Loan Amount</Label>
              <Input id="min-loan" defaultValue="500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-loan">Maximum Loan Amount</Label>
              <Input id="max-loan" defaultValue="10000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-term">Default Loan Term (months)</Label>
              <Input id="default-term" defaultValue="12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grace-period">Grace Period (days)</Label>
              <Input id="grace-period" defaultValue="15" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="auto-approve" />
              <Label htmlFor="auto-approve">Auto-approve Low-risk Applications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="require-verification" defaultChecked />
              <Label htmlFor="require-verification">Require Document Verification</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure security and access settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" defaultValue="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-expiry">Password Expiry (days)</Label>
              <Input id="password-expiry" defaultValue="90" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="failed-attempts">Max Failed Login Attempts</Label>
              <Input id="failed-attempts" defaultValue="5" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="two-factor" defaultChecked />
              <Label htmlFor="two-factor">Require Two-Factor Authentication for Admins</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="ip-restriction" />
              <Label htmlFor="ip-restriction">Enable IP Restriction</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="audit-logging" defaultChecked />
              <Label htmlFor="audit-logging">Enable Audit Logging</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

