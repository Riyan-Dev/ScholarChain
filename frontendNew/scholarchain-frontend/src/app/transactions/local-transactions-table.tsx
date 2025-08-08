"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpDown,
  MoreHorizontal,
  Search,
  Eye,
  Download,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalTransactions } from "@/hooks/use-local-transactions";
import type { TokenTransaction } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface DataTableColumnHeader {
  title: string;
  sortable?: boolean;
  value: keyof TokenTransaction;
}

export function LocalTransactionsTable() {
  const { transactions, isLoading, error } = useLocalTransactions();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TokenTransaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sortBy, setSortBy] = useState<keyof TokenTransaction | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  if (error) {
    return (
      <div className="text-red-500">
        Error loading transactions: {error.message}
      </div>
    );
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.username
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesAction =
        !actionFilter || transaction.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [transactions, searchQuery, actionFilter]);

  const sortedTransactions = useMemo(() => {
    if (!sortBy) {
      return filteredTransactions;
    }

    return [...filteredTransactions].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === undefined || bValue === undefined) {
        return 0;
      }

      let comparison = 0;
      if (sortBy === "timestamp") {
        // Sort by full timestamp (including time)
        const dateA = new Date(aValue as string).getTime();
        const dateB = new Date(bValue as string).getTime();
        comparison = dateA - dateB;
      } else if (sortBy === "amount") {
        // Sort by amount (assuming it's a number)
        comparison = (aValue as number) - (bValue as number);
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else {
        // Fallback if types are different and not handled above
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === "asc" ? comparison : comparison * -1;
    });
  }, [filteredTransactions, sortBy, sortDirection]);

  const handleSort = (column: keyof TokenTransaction) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc"); // Default to descending on new sort
    }
  };

  const handleViewDetails = (transaction: TokenTransaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };

  const handleExportCSV = () => {
    toast.success("Transaction exported successfully");
  };

  const columns: DataTableColumnHeader[] = [
    {
      title: "Username",
      value: "username",
    },
    {
      title: "Action",
      value: "action",
    },
    {
      title: "Amount",
      sortable: true,
      value: "amount",
    },
    {
      title: "Timestamp",
      sortable: true,
      value: "timestamp",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="relative w-full sm:w-64">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            onValueChange={(value) =>
              setActionFilter(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="debit">Debit</SelectItem>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="burn">Burn</SelectItem>
            </SelectContent>
          </Select>
          {/* <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button> */}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.value}>
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        className="w-full justify-start p-0"
                        onClick={() => handleSort(column.value)}
                      >
                        {column.title}
                        {sortBy === column.value && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </Button>
                    ) : (
                      column.title
                    )}
                  </TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-24 text-center"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedTransactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {transaction.username}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.action === "credit"
                            ? "default"
                            : transaction.action === "buy"
                              ? "outline"
                              : transaction.action === "burn"
                                ? "secondary"
                                : "destructive"
                        }
                      >
                        {transaction.action}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                    <TableCell className="text-right">
                      {transaction.description}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Detailed information about this transaction.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Username:</span>
                <span className="col-span-3">
                  {selectedTransaction.username}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Action:</span>
                <span className="col-span-3">
                  <Badge
                    variant={
                      selectedTransaction.action === "buy"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {selectedTransaction.action}
                  </Badge>
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Amount:</span>
                <span className="col-span-3">{selectedTransaction.amount}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Timestamp:</span>
                <span className="col-span-3">
                  {formatDate(selectedTransaction.timestamp)}
                </span>
              </div>
              {selectedTransaction.description && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Description:</span>
                  <span className="col-span-3">
                    {selectedTransaction.description}
                  </span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
