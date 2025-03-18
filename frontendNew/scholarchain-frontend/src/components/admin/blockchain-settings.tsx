"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function BlockchainSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockchain Settings</CardTitle>
        <CardDescription>Configure blockchain integration settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="network">Ethereum Network</Label>
          <Select defaultValue="mainnet">
            <SelectTrigger id="network">
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mainnet">Mainnet</SelectItem>
              <SelectItem value="goerli">Goerli Testnet</SelectItem>
              <SelectItem value="sepolia">Sepolia Testnet</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="wallet-address">System Wallet Address</Label>
          <Input id="wallet-address" defaultValue="0x1234567890abcdef1234567890abcdef12345678" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contract-address">Smart Contract Address</Label>
          <Input id="contract-address" defaultValue="0xabcdef1234567890abcdef1234567890abcdef12" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gas-price">Gas Price Strategy</Label>
          <Select defaultValue="medium">
            <SelectTrigger id="gas-price">
              <SelectValue placeholder="Select gas price strategy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (Slower)</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High (Faster)</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmation-blocks">Required Confirmation Blocks</Label>
          <Input id="confirmation-blocks" defaultValue="3" />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="auto-sync" defaultChecked />
          <Label htmlFor="auto-sync">Auto-sync Blockchain Transactions</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="tokenized-loans" />
          <Label htmlFor="tokenized-loans">Enable Tokenized Loans</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="blockchain-verification" defaultChecked />
          <Label htmlFor="blockchain-verification">Require Blockchain Verification for Large Transactions</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Blockchain Settings</Button>
      </CardFooter>
    </Card>
  )
}

