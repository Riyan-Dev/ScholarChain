import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BlockchainProvider } from "@/context/blockchain-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blockchain Explorer",
  description: "Explore blockchain ledger data",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BlockchainProvider>{children}</BlockchainProvider>
      </body>
    </html>
  );
}
