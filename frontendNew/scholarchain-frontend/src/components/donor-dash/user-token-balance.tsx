import { CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function UserTokenBalance() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <h3 className="text-lg font-medium">Your Token Balance</h3>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">1,235</span>
              <span className="text-muted-foreground text-sm">tokens</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" asChild>
              <Link href="/transactions">View History</Link>
            </Button>
            <Button asChild>
              <Link href="/purchase">Buy More</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
