import { BarChart3, CreditCard, Download, Home, Settings, Users } from "lucide-react"
import Link from "next/link"

import { Button } from "@/src/components/ui/button"
import { ScrollArea } from "@/src/components/ui/scroll-area"

export function Sidebar() {
  return (
    <div className="min-w-[240px] bg-[#0D0B21] text-white p-6">
      <div className="flex items-center gap-2 font-semibold text-lg mb-8">
        <div className="w-8 h-8 rounded-lg bg-primary" />
        Loanup
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-1">
          <Button
            variant="ghost"
            asChild
            className="w-full justify-start gap-4 text-white hover:text-white hover:bg-white/10"
          >
            <Link href="#">
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="w-full justify-start gap-4 text-white/60 hover:text-white hover:bg-white/10"
          >
            <Link href="#">
              <Download className="w-5 h-5" />
              Templates
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="w-full justify-start gap-4 text-white/60 hover:text-white hover:bg-white/10"
          >
            <Link href="#">
              <CreditCard className="w-5 h-5" />
              Loan Graph
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="w-full justify-start gap-4 text-white/60 hover:text-white hover:bg-white/10"
          >
            <Link href="#">
              <Users className="w-5 h-5" />
              Partners
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="w-full justify-start gap-4 text-white/60 hover:text-white hover:bg-white/10"
          >
            <Link href="#">
              <BarChart3 className="w-5 h-5" />
              Reports
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="w-full justify-start gap-4 text-white/60 hover:text-white hover:bg-white/10"
          >
            <Link href="#">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </Button>
        </div>
      </ScrollArea>
    </div>
  )
}

