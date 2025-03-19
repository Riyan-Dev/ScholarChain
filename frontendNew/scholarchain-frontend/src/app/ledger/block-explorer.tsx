"use client";

import { useState } from "react";
// import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2, Database } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import { useBlockchain } from "@/context/blockchain-context";
import { BlockDetails } from "./block-details";

export default function BlockExplorer() {
  const { getBlocksByPage, isLoading } = useBlockchain();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  // const { toast } = useToast();

  const { blocks, total } = getBlocksByPage(currentPage, itemsPerPage);
  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Block Explorer
        </CardTitle>
        <CardDescription>
          Browse all blocks in the blockchain ledger
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Block</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Txns</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blocks.map((block) => (
                  <TableRow key={block.block_number}>
                    <TableCell className="font-medium">
                      {block.block_number}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate font-mono text-xs">
                      {block.block_hash}
                    </TableCell>
                    <TableCell>
                      {formatTimestamp(block.block_timestamp)}
                    </TableCell>
                    <TableCell>{block.block_transactions.length}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>
                              Block #{block.block_number}
                            </DialogTitle>
                          </DialogHeader>
                          <BlockDetails block={block} />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNumber)}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </CardContent>
    </Card>
  );
}
