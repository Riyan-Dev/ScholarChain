import { Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTimestamp } from "@/lib/utils";
import type { Block } from "@/lib/types";

export function BlockDetails({ block }: { block: Block }) {
  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="text-muted-foreground text-sm font-medium">
            Block Number
          </div>
          <div className="font-mono">{block.block_number}</div>
        </div>
        <div className="space-y-2">
          <div className="text-muted-foreground text-sm font-medium">
            Timestamp
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground h-4 w-4" />
            {formatTimestamp(block.block_timestamp)}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-muted-foreground text-sm font-medium">
          Block Hash
        </div>
        <div className="bg-muted rounded-md p-2 font-mono text-sm break-all">
          {block.block_hash}
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-muted-foreground text-sm font-medium">
          Transactions ({block.block_transactions.length})
        </div>
        {block.block_transactions.length > 0 ? (
          <div className="space-y-2">
            {block.block_transactions.map((txHash) => (
              <div
                key={txHash}
                className="bg-muted flex items-center justify-between rounded-md p-2 font-mono text-sm break-all"
              >
                <span className="truncate">{txHash}</span>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">
            No transactions in this block
          </div>
        )}
      </div>
    </div>
  );
}
