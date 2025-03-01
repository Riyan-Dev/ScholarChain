import { BarChart3, ChevronDown, CreditCard, Search, Settings, Users } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/sidebar"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-4 flex-1">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input placeholder="Search for anything..." className="w-full max-w-sm border-none bg-muted/30" />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <CreditCard className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className="gap-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xX4gxZDKPXRw44cQZcOcj5n3i71pzy.png"
                alt="Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <main className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
              <p className="text-sm text-muted-foreground">All time, lifetime stats</p>
            </div>
            <Button variant="outline" className="gap-2">
              Last 7 Days
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12.80k</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,200</div>
                  <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pre-approved Client</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">820</div>
                  <p className="text-xs text-muted-foreground">+19.1% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-primary text-primary-foreground">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <Button variant="secondary" size="icon" className="h-8 w-8">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$98,220.00</div>
                  <p className="text-xs opacity-90">Your active balance</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Payment Analytics</CardTitle>
                    <p className="text-sm text-muted-foreground">$30,500 last payment</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    Last 7 Days
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] mt-4">
                    {/* Chart would go here - using placeholder for demo */}
                    <div className="w-full h-full bg-muted/20 rounded-lg" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle>Allocation Loan</CardTitle>
                    <p className="text-sm text-muted-foreground">Progress</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-4">
                      <Image src="/placeholder.svg" alt="iPhone" width={40} height={40} className="rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">iPhone 15 Pro</p>
                        <p className="text-sm text-muted-foreground">Device</p>
                      </div>
                      <div className="text-sm font-medium">80.85%</div>
                    </div>
                    <Progress value={80.85} />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-4">
                      <Image src="/placeholder.svg" alt="Trade Boost" width={40} height={40} className="rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Air Jordan Trade Boost</p>
                        <p className="text-sm text-muted-foreground">Fashion</p>
                      </div>
                      <div className="text-sm font-medium">40.85%</div>
                    </div>
                    <Progress value={40.85} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

