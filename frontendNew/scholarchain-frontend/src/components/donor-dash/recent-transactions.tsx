import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentTransactions() {
  return (
    <div className="space-y-8">
      {[
        {
          name: "Token Purchase",
          amount: "+500 tokens",
          date: "2 hours ago",
          status: "completed",
        },
        {
          name: "Donation to Education Fund",
          amount: "-100 tokens",
          date: "5 hours ago",
          status: "completed",
        },
        {
          name: "Admin Top-up",
          amount: "+50 tokens",
          date: "2 days ago",
          status: "completed",
        },
        {
          name: "Donation to Medical Research",
          amount: "-200 tokens",
          date: "5 days ago",
          status: "completed",
        },
        {
          name: "Token Purchase",
          amount: "+1000 tokens",
          date: "1 week ago",
          status: "completed",
        },
      ].map((transaction, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={`/placeholder.svg?height=36&width=36`}
              alt="Avatar"
            />
            <AvatarFallback>
              {transaction.name
                .split(" ")
                .map((word) => word[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium">{transaction.name}</p>
            <p className="text-muted-foreground text-xs">{transaction.date}</p>
          </div>
          <div className="ml-auto font-medium">
            <span
              className={
                transaction.amount.startsWith("+")
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {transaction.amount}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
