// Define types based on the new data structure
export interface LoanDetails {
  id: string;
  username: string;
  loan_amount: number;
  contract_address: string;
  loan_amount_repaid: number;
  no_of_installments: number;
  installments_completed: number;
  total_discounted_amount: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface NextInstallment {
  installment_id: number;
  installment_date: string;
  installment_paid_date: string | null;
  installment_status: string;
  amount_paid: number;
  computedDue: number;
}

export interface RepaymentData {
  _id: string;
  loanDetails: LoanDetails;
  nextInstallment: NextInstallment;
  balance: number;
}
