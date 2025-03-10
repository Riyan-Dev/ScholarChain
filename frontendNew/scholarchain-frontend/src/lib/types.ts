export interface Installment {
  installment_id: number;
  installment_date: string;
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
