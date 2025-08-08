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

interface UserFilterProps {
  filterChecked: string;
  setFilterChecked: (checked: string) => void;
}

export function UserFilter({
  filterChecked,
  setFilterChecked,
}: UserFilterProps) {
  // const [filterChecked, setFilterChecked] = useState("all");

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-4 w-4" />
            Role
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={filterChecked == "all"}
            onClick={() => setFilterChecked("all")}
          >
            All
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filterChecked == "admin"}
            onClick={() => setFilterChecked("admin")}
          >
            Admin
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filterChecked == "donatorr"}
            onClick={() => setFilterChecked("donator")}
          >
            Donor
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filterChecked == "applicant"}
            onClick={() => setFilterChecked("applicant")}
          >
            Applicant
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <DropdownMenu>
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
          <DropdownMenuCheckboxItem checked>Pending</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Inactive</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu> */}

      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2"
        onClick={() => setFilterChecked("all")}
      >
        Reset Filters
      </Button>
    </div>
  );
}
