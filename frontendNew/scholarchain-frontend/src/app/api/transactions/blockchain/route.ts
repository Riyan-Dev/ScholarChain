import { NextResponse } from "next/server"
import type { BlockchainTransaction } from "@/lib/types"

// Mock data for blockchain transactions
const mockBlockchainTransactions: BlockchainTransaction[] = [
  {
    transaction_hash: "c0fbb332287c6c60429e6c1a2689eb3245d53f61761a35fdf229f7b84578a167",
    block_number: 37,
    from_address: "0x86DFc9E6af6B252af881C306014B89Cf21037C48",
    to_address: "0xa78dFeD5B3898A78AC5b922B9D14024DAd83939A",
    value: "1",
    gas_used: 2000000,
  },
  {
    transaction_hash: "7ea2074456d116ec06b2cad60c7bfdf643d17f6afbeab37625059da68818ad29",
    block_number: 38,
    from_address: "0xa78dFeD5B3898A78AC5b922B9D14024DAd83939A",
    to_address: "0xE30F5D6db9aC40A2A869444508Ca7b9f494ba201",
    value: "0",
    gas_used: 4000000,
  },
  {
    transaction_hash: "fddc320c2558b70aff564c2dc4a4077bde76b7c74843d4cdcf5afb9083fdf400",
    block_number: 39,
    from_address: "0xa78dFeD5B3898A78AC5b922B9D14024DAd83939A",
    to_address: "0x4677f36a60f473F46CE0aD167E3Ba9FaD0c5aFF2",
    value: "0",
    gas_used: 2000000,
  },
  {
    transaction_hash: "a5d8e4b9c3f2e1d0b7a6c9e8d7f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6",
    block_number: 40,
    from_address: "0x86DFc9E6af6B252af881C306014B89Cf21037C48",
    to_address: "0xa78dFeD5B3898A78AC5b922B9D14024DAd83939A",
    value: "2",
    gas_used: 1500000,
  },
  {
    transaction_hash: "b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
    block_number: 41,
    from_address: "0xE30F5D6db9aC40A2A869444508Ca7b9f494ba201",
    to_address: "0x4677f36a60f473F46CE0aD167E3Ba9FaD0c5aFF2",
    value: "0.5",
    gas_used: 3000000,
  },
  {
    transaction_hash: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
    block_number: 42,
    from_address: "0x4677f36a60f473F46CE0aD167E3Ba9FaD0c5aFF2",
    to_address: "0x86DFc9E6af6B252af881C306014B89Cf21037C48",
    value: "1.5",
    gas_used: 2500000,
  },
]

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return NextResponse.json(mockBlockchainTransactions)
}

