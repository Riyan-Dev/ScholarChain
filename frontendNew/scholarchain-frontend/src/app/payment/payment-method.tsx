"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Landmark, Wallet } from "lucide-react"

interface PaymentMethodProps {
  selectedMethod: string
  onSelectMethod: (method: string) => void
}

export function PaymentMethod({ selectedMethod, onSelectMethod }: PaymentMethodProps) {
  return (
    <RadioGroup value={selectedMethod} onValueChange={onSelectMethod} className="space-y-4">
      <div
        className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer ${
          selectedMethod === "card" ? "border-primary bg-primary/5" : ""
        }`}
        onClick={() => onSelectMethod("card")}
      >
        <RadioGroupItem value="card" id="card" />
        <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer">
          <div className="bg-primary/10 p-2 rounded-md">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Credit / Debit Card</p>
            <p className="text-sm text-muted-foreground">Pay with Visa, Mastercard, etc.</p>
          </div>
        </Label>
      </div>

      <div
        className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer ${
          selectedMethod === "bank" ? "border-primary bg-primary/5" : ""
        }`}
        onClick={() => onSelectMethod("bank")}
      >
        <RadioGroupItem value="bank" id="bank" />
        <Label htmlFor="bank" className="flex items-center gap-3 cursor-pointer">
          <div className="bg-primary/10 p-2 rounded-md">
            <Landmark className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Bank Transfer</p>
            <p className="text-sm text-muted-foreground">Pay directly from your bank account</p>
          </div>
        </Label>
      </div>

      <div
        className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer ${
          selectedMethod === "wallet" ? "border-primary bg-primary/5" : ""
        }`}
        onClick={() => onSelectMethod("wallet")}
      >
        <RadioGroupItem value="wallet" id="wallet" />
        <Label htmlFor="wallet" className="flex items-center gap-3 cursor-pointer">
          <div className="bg-primary/10 p-2 rounded-md">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Digital Wallet</p>
            <p className="text-sm text-muted-foreground">Pay with PayPal, Apple Pay, etc.</p>
          </div>
        </Label>
      </div>
    </RadioGroup>
  )
}

