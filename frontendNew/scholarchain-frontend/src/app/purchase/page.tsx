/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardHeader } from "@/components/donor-dash/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
import { buyTokens } from "@/services/donor.service";
import { useRouter } from "next/navigation";

export default function PurchasePage() {
  const [selectedPackage, setSelectedPackage] = useState("popular");
  const [customAmount, setCustomAmount] = useState<number | undefined>();
  const [activeTab, setActiveTab] = useState("packages");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading
  const router = useRouter();

  const packages = useMemo(
    () => [
      {
        value: "starter",
        label: "Starter",
        price: "PKR 100",
        tokens: 100,
      },
      {
        value: "popular",
        label: "Popular",
        price: "PKR 500",
        tokens: 500,
      },
      {
        value: "premium",
        label: "Premium",
        price: "PKR 1200",
        tokens: 1200,
      },
      {
        value: "platinum",
        label: "Platinum",
        price: "PKR 3000",
        tokens: 3000,
      },
    ],
    []
  );

  // Find the selected package details.  Handles undefined case gracefully.
  const selectedPackageDetails = useMemo(() =>
    packages.find((pkg) => pkg.value === selectedPackage), [packages, selectedPackage]
  );

  // Calculate estimated tokens for custom amount
  const estimatedTokens = useMemo(() => {
    return customAmount ? customAmount : 0;  //Returns 0, if customAmount is falsy
  }, [customAmount]);


  // Calculate total price
  const totalPrice = useMemo(() => {
    if (activeTab === "packages" && selectedPackageDetails) {
      return parseFloat(selectedPackageDetails.price.replace("PKR ", ""));
    } else if (activeTab === "custom" && customAmount) {
      return customAmount;
    }
    return 0;
  }, [activeTab, selectedPackageDetails, customAmount]);

  // Calculate total tokens
  const totalTokens = useMemo(() => {
    if (activeTab === "packages" && selectedPackageDetails) {
      return selectedPackageDetails.tokens;
    } else if (activeTab === "custom") {
      return estimatedTokens;
    }
    return 0;
  }, [activeTab, selectedPackageDetails, estimatedTokens]);



  // Update selected package when radio button changes
  const handlePackageChange = (value: string) => {
    setSelectedPackage(value);
    setActiveTab("packages")
  };

  // Update custom amount when input changes, include input validation
  const handleCustomAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "") {
      setCustomAmount(undefined);
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 0) { //allow 0
        setCustomAmount(numValue);
      }
    }
    setActiveTab("custom");
  };

  const handlePaymentSubmit = async () => { // Make async
    // 1. Validate the input
    if (!cardNumber || !expiryDate || !cvc || !name) {
      toast.error("Please fill in all fields."); // Error toast
      return;
    }

    // 2.  Set isSubmitting to true to disable the button
    setIsSubmitting(true);


    // 3. Use the buyTokens service
    try {
      const amount = activeTab === "packages" && selectedPackageDetails ? selectedPackageDetails.tokens : estimatedTokens;
      const result = await buyTokens(amount);

      if (result.error) {
        toast.error(result.error); // Display the error
      } else {
        toast.success(result.message); // Success
        setIsDialogOpen(false);
        if (result.new_balance !== undefined) {
          // You would have a state variable for the user's balance, e.g., setUserBalance
          // setUserBalance(result.new_balance);
          console.log("new balance", result.new_balance)
        }
      }
      router.push("/donor"); // Redirect to dashboard

    } catch (error) {
      // This should ideally not be reached due to error handling in buyTokens,
      // but it's here as a safety net.
      console.error("Unexpected error in component:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false); // Re-enable the button after the request
    }
  };

  //Handle tab Change
  useEffect(() => {
    if (activeTab === "packages") {
      setCustomAmount(undefined); // Reset on tab change
    }
  }, [activeTab])

  return (
    <div>
      <DashboardHeader
        heading="Purchase Tokens"
        text="Buy tokens to use for donations on the platform."
      />
      <div className="grid gap-8 md:grid-cols-2">
        {/* Token Packages Card */}
        <Card>
          <CardHeader>
            <CardTitle>Token Packages</CardTitle>
            <CardDescription>
              Select a pre-defined token package or customize your amount.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="packages" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="packages">Packages</TabsTrigger>
                <TabsTrigger value="custom">Custom Amount</TabsTrigger>
              </TabsList>
              <TabsContent value="packages" className="space-y-4">
                <RadioGroup value={selectedPackage} onValueChange={handlePackageChange}>
                  {packages.map((pkg) => (
                    <div
                      key={pkg.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem value={pkg.value} id={pkg.value} />
                      <Label
                        htmlFor={pkg.value}
                        className="flex flex-1 cursor-pointer justify-between"
                      >
                        <span>
                          {pkg.label} - {pkg.tokens} tokens
                        </span>
                        <span className="font-semibold">{pkg.price}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </TabsContent>
              <TabsContent value="custom" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-amount">Amount in PKR</Label>
                  <Input
                    id="custom-amount"
                    placeholder="Enter amount..."
                    type="number"
                    min="0"
                    step="1"
                    value={customAmount === undefined ? "" : customAmount}
                    onChange={handleCustomAmountChange}
                  />
                  <p className="text-muted-foreground text-sm">
                    You&apos;ll receive 1 token(s) per PKR 1 spent
                  </p>
                </div>
                <div className="bg-muted rounded-md p-4">
                  <div className="flex justify-between text-sm">
                    <span>Estimated tokens:</span>
                    <span className="font-medium">{estimatedTokens} tokens</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
              Continue to Payment
            </Button>
          </CardFooter>
        </Card>

        {/* Order Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>
              Review your token purchase before checkout.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Selected Package:</span>
              <span>
                {activeTab === "packages"
                  ? selectedPackageDetails?.label || "None"
                  : "Custom"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Token Amount:</span>
              <span>{totalTokens} tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Price per Token:</span>
              <span>PKR 1</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>PKR {totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- The Dialog Component --- */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Enter Payment Details</DialogTitle>
              <DialogDescription>
                Please enter your banking information to complete the purchase.
              </DialogDescription>
            </DialogHeader>
            {/* --- Form Fields (inside the Dialog) --- */}
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cardNumber" className="text-right">
                  Card Number
                </Label>
                <Input id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" className="col-span-3" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expiryDate" className="text-right">
                  Expiry Date
                </Label>
                <Input id="expiryDate" placeholder="MM/YY" className="col-span-3" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cvc" className="text-right">
                  CVC/CVV
                </Label>
                <Input id="cvc" placeholder="XXX" className="col-span-3" value={cvc} onChange={(e) => setCvc(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name on Card
                </Label>
                <Input id="name" placeholder="John Doe" className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handlePaymentSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Confirm Purchase"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Why Buy Tokens? Card - Full Width */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Why Buy Tokens?</CardTitle>
              <CardDescription>
                Learn about the benefits of our token system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Transparent Donation Tracking</h4>
                <p className="text-muted-foreground text-sm">
                  See exactly where your donations go and track the impact of
                  your contributions.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Premium Features Access</h4>
                <p className="text-muted-foreground text-sm">
                  Gain access to detailed reports, ledgers, and application
                  information with premium token packages.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Bonus Token Opportunities</h4>
                <p className="text-muted-foreground text-sm">
                  Administrators may top up your account with bonus tokens based
                  on your donation activity.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  );
}