/* eslint-disable prettier/prettier */
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { Loan } from "@/lib/types";

interface LoansTableProps {
  loans: Loan[];
}

export function LoansTable({ loans }: LoansTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>("");

  const filterLoans = loans.filter((loan) =>
    loan.username.toLowerCase().includes(search.toLocaleLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search borrower..."
            className="h-9 w-[250px] md:w-[300px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead className="text-center">Loan ID</TableHead>
              <TableHead className="text-center">Borrower</TableHead>
              <TableHead className="text-center">Amount</TableHead>
              <TableHead className="hidden text-center md:table-cell">
                Installments
              </TableHead>
              <TableHead className="hidden text-center md:table-cell">
                Amount Repaid
              </TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">
                Installments Completed
              </TableHead>
              <TableHead className="text-center">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterLoans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell className="text-center font-medium">
                  {loan.id}
                </TableCell>
                <TableCell className="text-center">{loan.username}</TableCell>
                <TableCell className="text-center">
                  {loan.loan_amount}
                </TableCell>
                <TableCell className="hidden text-center md:table-cell">
                  {loan.no_of_installments}
                </TableCell>
                <TableCell className="hidden text-center md:table-cell">
                  {loan.loan_amount_repaid}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      loan.status === "ongoing"
                        ? "default"
                        : loan.status === "completed"
                          ? "outline" // Replaced "success" with "outline"
                          : "destructive"
                    }
                  >
                    {loan.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {loan.installments_completed}
                </TableCell>
                <TableCell className="text-center">
                  {loan.created_at}
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Loan</DropdownMenuItem>
                      <DropdownMenuItem>View Repayments</DropdownMenuItem>
                      <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}