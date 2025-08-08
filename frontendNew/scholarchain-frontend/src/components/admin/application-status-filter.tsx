"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

export function ApplicationStatusFilter() {
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
          <DropdownMenuCheckboxItem checked>
            Pending Review
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>
            Under Review
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Approved</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Rejected</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-4 w-4" />
            Risk Score
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by Risk</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Low</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Medium</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>High</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-4 w-4" />
            Purpose
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by Purpose</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Tuition</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>
            Books & Supplies
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>
            Living Expenses
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Other</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="sm" className="h-8 px-2">
        Reset Filters
      </Button>
    </div>
  );
}
