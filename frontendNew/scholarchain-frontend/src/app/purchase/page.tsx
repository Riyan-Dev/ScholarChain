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

export default function PurchasePage() {
  return (
    <div>
      <DashboardHeader
        heading="Purchase Tokens"
        text="Buy tokens to use for donations on the platform."
      />
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Token Packages</CardTitle>
              <CardDescription>
                Select a pre-defined token package or customize your amount.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="packages" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="packages">Packages</TabsTrigger>
                  <TabsTrigger value="custom">Custom Amount</TabsTrigger>
                </TabsList>
                <TabsContent value="packages" className="space-y-4">
                  <RadioGroup defaultValue="option-two">
                    {[
                      {
                        value: "starter",
                        label: "Starter",
                        price: "$10",
                        tokens: "100",
                      },
                      {
                        value: "popular",
                        label: "Popular",
                        price: "$50",
                        tokens: "550",
                      },
                      {
                        value: "premium",
                        label: "Premium",
                        price: "$100",
                        tokens: "1200",
                      },
                      {
                        value: "platinum",
                        label: "Platinum",
                        price: "$250",
                        tokens: "3000",
                      },
                    ].map((pkg) => (
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
                    <Label htmlFor="custom-amount">Amount in $</Label>
                    <Input
                      id="custom-amount"
                      placeholder="Enter amount..."
                      type="number"
                      min="1"
                      step="1"
                    />
                    <p className="text-muted-foreground text-sm">
                      You'll receive 10 tokens per $1 spent
                    </p>
                  </div>
                  <div className="bg-muted rounded-md p-4">
                    <div className="flex justify-between text-sm">
                      <span>Estimated tokens:</span>
                      <span className="font-medium">0 tokens</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Continue to Payment</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="space-y-6">
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
                <span>Popular</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Token Amount:</span>
                <span>550 tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Price per Token:</span>
                <span>$0.09</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>$50.00</span>
                </div>
              </div>
            </CardContent>
          </Card>
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
    </div>
  );
}
