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
  Copy,
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`"${truncateAddress(text)}" copied to clipboard.`);
    } catch (err) {
      toast.error("Failed to copy to clipboard.");
      console.error("Failed to copy: ", err);
    }
  };

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
        {/* <Button variant="outline" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button> */}
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
                 <TableHead>
                  <div className="flex items-center">
                    Type
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
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell
                      className="cursor-pointer font-mono text-xs hover:underline"
                      onClick={() =>
                        copyToClipboard(transaction.transaction_hash)
                      }
                    >
                      <span
                        title={transaction.transaction_hash}
                        className="flex items-center gap-1"
                      >
                        {truncateAddress(transaction.transaction_hash)}
                        <Copy className="text-muted-foreground h-3 w-3" />
                      </span>
                    </TableCell>
                    <TableCell
                      className="cursor-pointer font-mono text-xs hover:underline"
                      onClick={() => copyToClipboard(transaction.from_address)}
                    >
                      <span
                        title={transaction.from_address}
                        className="flex items-center gap-1"
                      >
                        {truncateAddress(transaction.from_address)}
                        <Copy className="text-muted-foreground h-3 w-3" />
                      </span>
                    </TableCell>
                    <TableCell
                      className="cursor-pointer font-mono text-xs hover:underline"
                      onClick={() => copyToClipboard(transaction.to_address)}
                    >
                      <span
                        title={transaction.to_address}
                        className="flex items-center gap-1"
                      >
                        {truncateAddress(transaction.to_address)}
                        <Copy className="text-muted-foreground h-3 w-3" />
                      </span>
                    </TableCell>
                    <TableCell>{transaction.value} ETH</TableCell>
                    <TableCell className="text-right">
                      {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild> */}
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          className="h-8 px-2" // Adjusted padding
                          onClick={() => handleViewDetails(transaction)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </Button>
                      </div>
                      {/* </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                          
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem
                            onClick={() =>
                              handleViewOnExplorer(transaction.transaction_hash)
                            }
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View on explorer
                          </DropdownMenuItem> */}
                      {/*<DropdownMenuItem onClick={handleExportCSV}>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> */}
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
                <span
                  className="col-span-3 flex cursor-pointer items-center gap-1 font-mono text-xs break-all hover:underline"
                  onClick={() =>
                    copyToClipboard(selectedTransaction.transaction_hash)
                  }
                >
                  {selectedTransaction.transaction_hash}
                  <Copy className="text-muted-foreground h-3 w-3" />
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">From:</span>
                <span
                  className="col-span-3 flex cursor-pointer items-center gap-1 font-mono text-xs break-all hover:underline"
                  onClick={() =>
                    copyToClipboard(selectedTransaction.from_address)
                  }
                >
                  {selectedTransaction.from_address}
                  <Copy className="text-muted-foreground h-3 w-3" />
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">To:</span>
                <span
                  className="col-span-3 flex cursor-pointer items-center gap-1 font-mono text-xs break-all hover:underline"
                  onClick={() =>
                    copyToClipboard(selectedTransaction.to_address)
                  }
                >
                  {selectedTransaction.to_address}
                  <Copy className="text-muted-foreground h-3 w-3" />
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
              {/* <Button
                className="mt-2"
                onClick={() =>
                  handleViewOnExplorer(selectedTransaction.transaction_hash)
                }
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Block Explorer
              </Button> */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
