"use client";

import { useState } from "react";
import { BookOpen, GraduationCap, HeartHandshake, School } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DonateTokensProps {
  balance: number;
  onDonate: (amount: number) => void;
}

export function DonateTokens({ balance, onDonate }: DonateTokensProps) {
  const [amount, setAmount] = useState(500);
  const [donationPurpose, setDonationPurpose] = useState("education");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDonate = () => {
    if (amount <= 0 || amount > balance) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onDonate(amount);
      setIsSubmitting(false);
      setSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Donate Tokens</CardTitle>
          <CardDescription>
            Support ScholarChain by donating your tokens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <HeartHandshake className="h-4 w-4" />
              <AlertTitle>Donation Successful!</AlertTitle>
              <AlertDescription>
                Thank you for your generous donation of{" "}
                {amount.toLocaleString()} tokens.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="amount">Donation Amount</Label>
              <span className="text-muted-foreground text-sm">
                Balance: {balance.toLocaleString()} Tokens
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Slider
                id="amount"
                max={balance}
                step={100}
                defaultValue={[500]}
                value={[amount]}
                onValueChange={(values) => setAmount(values[0])}
                className="flex-1"
              />
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-24"
                min={0}
                max={balance}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Donation Purpose</Label>
            <RadioGroup
              defaultValue="education"
              value={donationPurpose}
              onValueChange={setDonationPurpose}
              className="grid grid-cols-1 gap-4 pt-2"
            >
              <Label
                htmlFor="education"
                className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary flex flex-col items-center justify-between rounded-md border-2 p-4"
              >
                <RadioGroupItem
                  value="education"
                  id="education"
                  className="sr-only"
                />
                <GraduationCap className="mb-3 h-6 w-6" />
                <div className="space-y-1 text-center">
                  <h3 className="font-medium">Education Fund</h3>
                  <p className="text-muted-foreground text-sm">
                    Support students' educational expenses
                  </p>
                </div>
              </Label>
              <Label
                htmlFor="research"
                className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary flex flex-col items-center justify-between rounded-md border-2 p-4"
              >
                <RadioGroupItem
                  value="research"
                  id="research"
                  className="sr-only"
                />
                <BookOpen className="mb-3 h-6 w-6" />
                <div className="space-y-1 text-center">
                  <h3 className="font-medium">Research Grants</h3>
                  <p className="text-muted-foreground text-sm">
                    Fund innovative academic research
                  </p>
                </div>
              </Label>
              <Label
                htmlFor="scholarship"
                className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary flex flex-col items-center justify-between rounded-md border-2 p-4"
              >
                <RadioGroupItem
                  value="scholarship"
                  id="scholarship"
                  className="sr-only"
                />
                <School className="mb-3 h-6 w-6" />
                <div className="space-y-1 text-center">
                  <h3 className="font-medium">Scholarship Program</h3>
                  <p className="text-muted-foreground text-sm">
                    Help deserving students access education
                  </p>
                </div>
              </Label>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleDonate}
            disabled={amount <= 0 || amount > balance || isSubmitting}
            className="w-full"
          >
            {isSubmitting
              ? "Processing..."
              : `Donate ${amount.toLocaleString()} Tokens`}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Impact</CardTitle>
          <CardDescription>
            See how your donations make a difference
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-card rounded-lg border p-6 text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
              <HeartHandshake className="text-primary h-10 w-10" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              Your Donation Matters
            </h3>
            <p className="text-muted-foreground text-sm">
              Every token you donate helps students achieve their educational
              goals and dreams.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">What Your Donation Provides:</h3>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <div className="bg-primary h-2 w-2 rounded-full"></div>
                <p className="text-sm">
                  100 Tokens = Educational materials for one student
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary h-2 w-2 rounded-full"></div>
                <p className="text-sm">
                  500 Tokens = One month of online course access
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary h-2 w-2 rounded-full"></div>
                <p className="text-sm">
                  1,000 Tokens = Partial scholarship for one semester
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary h-2 w-2 rounded-full"></div>
                <p className="text-sm">
                  5,000 Tokens = Full scholarship for one semester
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary h-2 w-2 rounded-full"></div>
                <p className="text-sm">
                  10,000 Tokens = Research grant for innovative projects
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">
              <strong>Tax Benefits:</strong> Your donations to ScholarChain may
              be tax-deductible. Please consult with your tax advisor for more
              information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
