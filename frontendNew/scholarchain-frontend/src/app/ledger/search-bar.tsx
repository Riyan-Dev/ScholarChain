"use client";

import type React from "react";

import { useState } from "react";
// import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Search } from "lucide-react";
import type { Block } from "@/lib/types";
import { useBlockchain } from "@/context/blockchain-context";
import { BlockDetails } from "./block-details";

export default function SearchBar() {
  const { searchBlockchain } = useBlockchain();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<Block | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  // const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a block number or hash to search",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 300));

      const result = searchBlockchain(query);

      if (result) {
        setSearchResult(result);
        setDialogOpen(true);
      } else {
        // toast({
        //   title: "Not Found",
        //   description: "No blocks or transactions found matching your search",
        //   variant: "destructive",
        // });
      }
    } catch (error) {
      // toast({
      //   title: "Search Error",
      //   description: "Failed to perform search. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSearch}
        className="mx-auto flex w-full max-w-3xl gap-2"
      >
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by block number, block hash or transaction hash..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Search
        </Button>
      </form>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {searchResult
                ? `Block #${searchResult.block_number}`
                : "Search Result"}
            </DialogTitle>
          </DialogHeader>
          {searchResult && <BlockDetails block={searchResult} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
