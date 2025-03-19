"use client";

import { useToast } from "@/hooks/use-toast";
import { Block, BlockchainStats, Transaction } from "@/lib/types";
import { get_ledger } from "@/services/blockchain.service";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

// Define the context type
interface BlockchainContextType {
  blocks: Block[];
  isLoading: boolean;
  error: string | null;
  stats: BlockchainStats;
  transactions: Transaction[];
  getBlocksByPage: (
    page: number,
    perPage: number
  ) => { blocks: Block[]; total: number };
  getRecentBlocks: (limit: number) => Block[];
  getRecentTransactions: (limit: number) => Transaction[];
  searchBlockchain: (query: string) => Block | null;
}

// Create the context with default values
const BlockchainContext = createContext<BlockchainContextType>({
  blocks: [],
  isLoading: true,
  error: null,
  stats: {
    totalBlocks: 0,
    totalTransactions: 0,
    latestBlock: 0,
    averageBlockTime: 0,
  },
  transactions: [],
  getBlocksByPage: () => ({ blocks: [], total: 0 }),
  getRecentBlocks: () => [],
  getRecentTransactions: () => [],
  searchBlockchain: () => null,
});

// Helper function to simulate API delay

export function BlockchainProvider({ children }: { children: ReactNode }) {

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<BlockchainStats>({
    totalBlocks: 0,
    totalTransactions: 0,
    latestBlock: 0,
    averageBlockTime: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all blockchain data once
  useEffect(() => {
    const fetchBlockchainData = async () => {
      setIsLoading(true);

      try {
        const blockchainData = await get_ledger();

        // Set blocks
        setBlocks(blockchainData);

        // Extract all transactions
        const allTransactions: Transaction[] = [];
        for (const block of blockchainData) {
          for (const txHash of block.block_transactions) {
            allTransactions.push({
              hash: txHash,
              blockNumber: block.block_number,
              timestamp: block.block_timestamp,
            });
          }
        }
        setTransactions(allTransactions);

        // Calculate stats
        const totalTransactions = blockchainData.reduce(
          (sum, block) => sum + block.block_transactions.length,
          0
        );

        // Calculate average block time
        let totalTime = 0;
        let timePoints = 0;

        for (let i = 1; i < blockchainData.length; i++) {
          const timeDiff =
            blockchainData[i].block_timestamp -
            blockchainData[i - 1].block_timestamp;
          if (timeDiff > 0) {
            totalTime += timeDiff;
            timePoints++;
          }
        }

        const averageBlockTime = timePoints > 0 ? totalTime / timePoints : 0;

        setStats({
          totalBlocks: blockchainData.length,
          totalTransactions,
          latestBlock:
            blockchainData.length > 0
              ? blockchainData[blockchainData.length - 1].block_number
              : 0,
          averageBlockTime,
        });

        // toast({
        //   title: "Data Loaded",
        //   description: `Successfully loaded ${blockchainData.length} blocks and ${totalTransactions} transactions.`,
        // });
      } catch (err) {
        setError("Failed to load blockchain data");
        // toast({
        //   title: "Error",
        //   description:
        //     "Failed to load blockchain data. Please refresh the page.",
        //   variant: "destructive",
        // });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlockchainData();
  }, []);

  // Get blocks with pagination
  const getBlocksByPage = (page = 1, perPage = 10) => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedBlocks = blocks.slice(start, end);

    return {
      blocks: paginatedBlocks,
      total: blocks.length,
    };
  };

  // Get recent blocks
  const getRecentBlocks = (limit = 5) => {
    return [...blocks]
      .sort((a, b) => b.block_number - a.block_number)
      .slice(0, limit);
  };

  // Get recent transactions
  const getRecentTransactions = (limit = 5) => {
    return [...transactions]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  };

  // Search blockchain
  const searchBlockchain = (query: string): Block | null => {
    // Try to parse as block number
    const blockNumber = Number.parseInt(query);
    if (!isNaN(blockNumber)) {
      const block = blocks.find((b) => b.block_number === blockNumber);
      if (block) return block;
    }

    // Try to find by block hash
    const blockByHash = blocks.find((b) => b.block_hash === query);
    if (blockByHash) return blockByHash;

    // Try to find by transaction hash
    for (const block of blocks) {
      if (block.block_transactions.includes(query)) {
        return block;
      }
    }

    return null;
  };

  return (
    <BlockchainContext.Provider
      value={{
        blocks,
        isLoading,
        error,
        stats,
        transactions,
        getBlocksByPage,
        getRecentBlocks,
        getRecentTransactions,
        searchBlockchain,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
}

export const useBlockchain = () => useContext(BlockchainContext);
