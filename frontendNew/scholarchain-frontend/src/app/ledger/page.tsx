import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import BlockExplorer from "./block-explorer";
import BlockchainStats from "./blockchain-stats";
import RecentBlocks from "./recent-blocks";
import RecentTransactions from "./recent-transactions";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-6 md:px-6">
      <h1 className="mb-6 text-3xl font-bold">Blockchain Explorer</h1>

      {/* <SearchBar /> */}

      <Suspense fallback={<Skeleton className="mt-6 h-[200px] w-full" />}>
        <BlockchainStats />
      </Suspense>

      <Tabs defaultValue="blocks" className="mt-8">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
          <TabsTrigger value="explorer">Block Explorer</TabsTrigger>
        </TabsList>
        <TabsContent value="blocks" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <RecentBlocks />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <RecentTransactions />
            </Suspense>
          </div>
        </TabsContent>
        <TabsContent value="explorer" className="mt-4">
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <BlockExplorer />
          </Suspense>
        </TabsContent>
      </Tabs>
    </main>
  );
}
