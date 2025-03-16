import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DashboardHeader } from "@/components/donor-dash/dashboard-header";

export default function TransactionsPage() {
  const transactions = [
    {
      id: "TX123456",
      date: "2023-05-21",
      description: "Token Purchase",
      amount: "+500 tokens",
      value: "$50.00",
      status: "completed",
    },
    {
      id: "TX123455",
      date: "2023-05-20",
      description: "Donation to Education Fund",
      amount: "-100 tokens",
      value: "$10.00",
      status: "completed",
    },
    {
      id: "TX123454",
      date: "2023-05-18",
      description: "Admin Top-up",
      amount: "+50 tokens",
      value: "$5.00",
      status: "completed",
    },
    {
      id: "TX123453",
      date: "2023-05-15",
      description: "Donation to Medical Research",
      amount: "-200 tokens",
      value: "$20.00",
      status: "completed",
    },
    {
      id: "TX123452",
      date: "2023-05-10",
      description: "Token Purchase",
      amount: "+1000 tokens",
      value: "$100.00",
      status: "completed",
    },
    {
      id: "TX123451",
      date: "2023-05-05",
      description: "Donation to Wildlife Conservation",
      amount: "-150 tokens",
      value: "$15.00",
      status: "completed",
    },
    {
      id: "TX123450",
      date: "2023-05-01",
      description: "Donation to Climate Action",
      amount: "-120 tokens",
      value: "$12.00",
      status: "completed",
    },
  ];

  return (
    <div>
      <DashboardHeader
        heading="Transaction History"
        text="View and filter your complete transaction history."
      >
        <Button variant="outline">Export CSV</Button>
      </DashboardHeader>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search transactions..."
              className="h-9 w-full sm:w-[300px]"
            />
            <Button variant="ghost" size="sm" className="h-9 px-2 lg:px-3">
              <span className="sr-only">Search</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="h-9 w-[150px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="purchases">Purchases</SelectItem>
                <SelectItem value="donations">Donations</SelectItem>
                <SelectItem value="topups">Admin Top-ups</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="30">
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.id}
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell
                    className={
                      transaction.amount.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {transaction.amount}
                  </TableCell>
                  <TableCell>{transaction.value}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
