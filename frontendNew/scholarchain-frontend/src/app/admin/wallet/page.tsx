import { BlockchainTransactions } from "@/components/admin/blockchain-transactions";
import { TransactionFilter } from "@/components/admin/transaction-filter";
import { TransactionsTable } from "@/components/admin/transactions-table";
import { WalletOverview } from "@/components/admin/wallet-overview";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import type { Metadata } from "next";
import DashboardShell from "@/components/admin/dashboard-shell";

export const metadata: Metadata = {
  title: "Wallet & Transactions",
  description: "Manage system wallet and view all transactions",
};

export default function WalletPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Wallet & Transactions"
        text="Manage funds and view transaction history."
      />
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <WalletOverview />
      </div>
      <div className="mb-4">
        <TransactionFilter />
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-medium">Transaction History</h3>
          <TransactionsTable />
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium">Blockchain Transactions</h3>
          <BlockchainTransactions />
        </div>
      </div>
    </DashboardShell>
  );
}
