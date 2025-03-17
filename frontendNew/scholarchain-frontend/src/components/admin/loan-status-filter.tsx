"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"

export function LoanStatusFilter() {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-4 w-4" />
            Status
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Completed</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Defaulted</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-4 w-4" />
            Repayment
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by Repayment</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>On Time</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Late</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>At Risk</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Defaulted</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Paid</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-4 w-4" />
            Amount
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by Amount</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Under $1,000</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>$1,000 - $3,000</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>$3,000 - $5,000</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Over $5,000</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="sm" className="h-8 px-2">
        Reset Filters
      </Button>
    </div>
  )
}

