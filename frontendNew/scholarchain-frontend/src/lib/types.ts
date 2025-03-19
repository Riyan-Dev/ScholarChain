export interface Installment {
  installment_id: number;
  installment_date: string;
  installment_paid_date: string | null;
  installment_status: "pending" | "paid" | "overdue";
  amount_paid: number;
  amount_due: number;
}

export interface Loan {
  _id: string;
  id: string | null;
  username: string;
  loan_amount: number;
  contract_address: string;
  loan_amount_repaid: number;
  no_of_installments: number;
  installments_completed: number;
  total_discounted_amount: number | null;
  status: "ongoing" | "completed" | "defaulted";
  created_at: string;
  installments: Installment[];
}

export interface LoanDashData {
  _id: string;
  id: string | null;
  username: string;
  loan_amount: number;
  contract_address: string;
  loan_amount_repaid: number;
  no_of_installments: number;
  installments_completed: number;
  total_discounted_amount: number | null;
  status: "ongoing" | "completed" | "defaulted";
  created_at: string;
  pending: number;
  overdue: number;
  paid: number;
}

interface DocumentMetadata {
  source: string;
  author: string;
  section: string;
  document_type: string;
}

interface Document {
  page_content: string;
  metadata: DocumentMetadata;
}

interface DocumentsList {
  CNIC: Document[];
  gaurdian_CNIC: Document[];
  electricity_bills: Document[];
  gas_bills: Document[];
  intermediate_result: Document[];
  undergrad_transcript: Document[];
  salary_slips: Document[];
  bank_statements: Document[];
  income_tax_certificate: Document[];
  reference_letter: Document[];
}

export interface User {
  _id: string;
  username: string;
  email: string;
  hashed_password: string;
  role: "admin" | "applicant" | "donator";
  application_stage: string[];
  chroma_path: string[];
  documents: DocumentsList;
export interface Block {
  block_number: number;
  block_hash: string;
  block_timestamp: number;
  block_transactions: string[];
}

export interface Transaction {
  hash: string;
  blockNumber: number;
  timestamp: number;
  from?: string;
  to?: string;
  value?: string;
}

export interface BlockchainStats {
  totalBlocks: number;
  totalTransactions: number;
  latestBlock: number;
  averageBlockTime: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface TokenTransaction {
  username: string;
  amount: number;
  action: "buy" | "burn" | "credit" | "debit";
  timestamp: string;
  description?: string;
}

export interface Wallet {
  username: string;
  public_key: string;
  encrypted_private_key: string;
  balance: number;
  transactions: TokenTransaction[];
}

export interface BlockchainTransaction {
  transaction_hash: string;
  block_number: number;
  from_address: string;
  to_address: string;
  value: string;
  gas_used: number;
  type: string;
}
