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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowUpDown,
  MoreHorizontal,
  Search,
  Eye,
  Download,
  ExternalLink,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlockchainTransaction } from "@/lib/types";
import { truncateAddress } from "@/lib/utils";
import { toast } from "sonner";
import { useBlockchainTransactions } from "@/hooks/use-blockchain-transactions";

export function BlockchainTransactionsTable() {
  const { transactions, isLoading, error } = useBlockchainTransactions();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<BlockchainTransaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  if (error) {
    return (
      <div className="text-red-500">
        Error loading transactions: {error.message}
      </div>
    );
  }

  const filteredTransactions = transactions.filter((transaction) => {
    return (
      transaction.transaction_hash
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.from_address
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.to_address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleViewDetails = (transaction: BlockchainTransaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };

  const handleViewOnExplorer = (hash: string) => {
    toast.success("Opening transaction in block explorer");
    window.open(`https://etherscan.io/tx/${hash}`, "_blank");
  };

  const handleExportCSV = () => {
    toast.success("Transaction exported successfully");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="relative w-full sm:w-64">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input
            placeholder="Search by hash or address..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
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
                <TableHead>
                  <div className="flex items-center">
                    Block
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Transaction Hash</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Value
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.transaction_hash}>
                    <TableCell>{transaction.block_number}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {truncateAddress(transaction.transaction_hash)}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {truncateAddress(transaction.from_address)}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {truncateAddress(transaction.to_address)}
                    </TableCell>
                    <TableCell>{transaction.value} ETH</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(transaction)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleViewOnExplorer(transaction.transaction_hash)
                            }
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View on explorer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleExportCSV}>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
              Detailed information about this blockchain transaction.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Block:</span>
                <span className="col-span-3">
                  {selectedTransaction.block_number}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Hash:</span>
                <span className="col-span-3 font-mono text-xs break-all">
                  {selectedTransaction.transaction_hash}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">From:</span>
                <span className="col-span-3 font-mono text-xs break-all">
                  {selectedTransaction.from_address}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">To:</span>
                <span className="col-span-3 font-mono text-xs break-all">
                  {selectedTransaction.to_address}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Value:</span>
                <span className="col-span-3">
                  {selectedTransaction.value} ETH
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Gas Used:</span>
                <span className="col-span-3">
                  {selectedTransaction.gas_used}
                </span>
              </div>
              <Button
                className="mt-2"
                onClick={() =>
                  handleViewOnExplorer(selectedTransaction.transaction_hash)
                }
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Block Explorer
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
