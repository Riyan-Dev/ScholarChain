"use client";

import { useState, useEffect } from "react";
import type { BlockchainTransaction } from "@/lib/types";
import { getBlockChainTransactions } from "@/services/blockchain.service";

export function useBlockchainTransactions() {
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await getBlockChainTransactions();
        setTransactions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return { transactions, isLoading, error };
}
