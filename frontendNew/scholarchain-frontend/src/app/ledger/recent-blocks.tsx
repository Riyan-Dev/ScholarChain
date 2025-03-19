"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Database, ArrowRight } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import Link from "next/link";
import { useBlockchain } from "@/context/blockchain-context";

export default function RecentBlocks() {
  const { getRecentBlocks, isLoading } = useBlockchain();
  const blocks = getRecentBlocks(5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Recent Blocks
        </CardTitle>
        <CardDescription>The most recently mined blocks</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {blocks.map((block) => (
              <div
                key={block.block_number}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      Block #{block.block_number}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {formatTimestamp(block.block_timestamp)}
                    </span>
                  </div>
                  <div className="text-muted-foreground max-w-[250px] truncate font-mono text-xs">
                    {block.block_hash}
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    {block.block_transactions.length} txns
                  </span>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full" asChild>
              <Link href="#blocks">
                View All Blocks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
