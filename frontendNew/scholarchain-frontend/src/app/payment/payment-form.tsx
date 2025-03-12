"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Landmark, Wallet } from "lucide-react"

interface PaymentFormProps {
  paymentMethod: string
}

export function PaymentForm({ paymentMethod }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("")

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
  }

  if (paymentMethod === "card") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Credit / Debit Card</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardName">Name on Card</Label>
          <Input id="cardName" placeholder="John Smith" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <div className="grid grid-cols-2 gap-2">
              <Select defaultValue="01">
                <SelectTrigger id="month">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = (i + 1).toString().padStart(2, "0")
                    return (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>

              <Select defaultValue="25">
                <SelectTrigger id="year">
                  <SelectValue placeholder="YY" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = (new Date().getFullYear() + i).toString().slice(-2)
                    return (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input id="cvc" placeholder="123" maxLength={3} />
          </div>
        </div>
      </div>
    )
  }

  if (paymentMethod === "bank") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Landmark className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Bank Transfer</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountName">Account Holder Name</Label>
          <Input id="accountName" placeholder="John Smith" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input id="accountNumber" placeholder="123456789" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="routingNumber">Routing Number</Label>
          <Input id="routingNumber" placeholder="123456789" />
        </div>
      </div>
    )
  }

  if (paymentMethod === "wallet") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Digital Wallet</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="walletType">Select Wallet</Label>
          <Select defaultValue="paypal">
            <SelectTrigger id="walletType">
              <SelectValue placeholder="Select wallet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="applepay">Apple Pay</SelectItem>
              <SelectItem value="googlepay">Google Pay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="walletEmail">Email Address</Label>
          <Input id="walletEmail" type="email" placeholder="john@example.com" />
        </div>
      </div>
    )
  }

  return null
}

