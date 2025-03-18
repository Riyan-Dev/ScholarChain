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
}
