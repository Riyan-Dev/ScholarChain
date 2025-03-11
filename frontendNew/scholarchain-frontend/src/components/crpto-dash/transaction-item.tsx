import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { Transaction } from "@/types";
import { TransactionIcon } from "./transaction-icon";

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const { username, amount, action, timestamp, description } = transaction;

  // Format the timestamp to a relative time (e.g., "2 days ago")
  const formattedTime = formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
  });

  // Determine if this is a minting transaction (no username means tokens were minted)
  const isMinting = !username && action.toLowerCase() === "buy";

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
          <TransactionIcon action={action} />
        </div>
        <div>
          <p className="font-medium">
            {isMinting
              ? "Token Minting"
              : username
                ? `Transfer to ${username}`
                : description || action}
          </p>
          <p className="text-muted-foreground text-xs">{formattedTime}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p
          className={`font-medium ${action.toLowerCase() === "debit" ? "text-red-500" : "text-green-500"}`}
        >
          {action.toLowerCase() === "debit" ? "-" : "+"}
          {amount} Tokens
        </p>
        <Badge
          variant={action.toLowerCase() === "debit" ? "destructive" : "outline"}
          className="capitalize"
        >
          {action}
        </Badge>
      </div>
    </div>
  );
}
