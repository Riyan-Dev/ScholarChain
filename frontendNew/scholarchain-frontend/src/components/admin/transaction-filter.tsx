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
import { Filter, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

export function TransactionFilter() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-4 w-4" />
            Type
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Donation</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Loan Disbursement</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Repayment</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>System Transfer</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
          <DropdownMenuCheckboxItem checked>Completed</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Pending</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Failed</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent mode="range" numberOfMonths={2} />
        </PopoverContent>
      </Popover>

      <Input placeholder="Search transactions..." className="h-8 w-[200px] md:w-[250px]" />

      <Button variant="ghost" size="sm" className="h-8 px-2">
        Reset Filters
      </Button>
    </div>
  )
}

