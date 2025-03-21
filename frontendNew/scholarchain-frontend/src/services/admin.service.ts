/* eslint-disable prettier/prettier */
import config from "@/config/config";
import { AuthService } from "@/services/auth.service";

const API_BASE_URL = config.fastApi.baseUrl;

export interface ApplicationCount {
    status: string;
    count: number;
}

export interface MonthlyTransaction {
    totalAmount: number;
    month: number;
    transactionType: string;
}

export interface PendingApplicationAPI {
    username: string;
    personal_info: {
        full_name: string;
        dob: string;
        gender: string;
        nationality: string;
        marital_status: string;
        phone_number: string;
        email_address: string;
        residential_address: string;
        permanent_address: string;
    };
    financial_info: {
        total_family_income: number;
        gas_bill: number;
        electricity_bill: number;
        other_income_sources: any[]; // Use a more specific type if possible
        outstanding_loans_or_debts: any[]; // Use a more specific type if possible
    };
    academic_info: {
        current_education_level: string;
        college_or_university: string;
        student_id: string;
        program_name_degree: string;
        duration_of_course: string;
        year_or_semester: string;
        gpa: number;
        achievements_or_awards: any[]; // Use a more specific type if possible
    };
    loan_details: {
        loan_amount_requested: number;
        purpose_of_loan: string;
        proposed_repayment_period: string;
        preferred_repayment_frequency: string;
    };
    references: {
        name: string;
        designation: string;
        contact_details: string;
        comments: string;
    }[];
    status: string;
    application_date: string;
    declaration: string;
    signature: string;
    id: string | null;
    documents: {
        type: string;
        url: string;
    }[];
    created_at: string;
    updated_at: string;
}

export interface AdminDash {
    total_donations: number,
    available_funds: number,
    active_loans: number,
    total_applications: number,
    application_count: ApplicationCount[];
    monthly_transactions: MonthlyTransaction[];
    pending_application: PendingApplicationAPI[];
    upcoming_repayments: UpcomingRepaymentAPI[];
    transactions: TransactionAPI[];
}

export interface PendingApplications {
    username: string;
    applicant: string;
    amount: number;
    status: string;
    application_date: string;
}

export interface UpcomingRepaymentAPIInstallments {
    transaction_id: string;
    installment_id: number;
    installment_date: string;
    installment_paid_date: string;
    installment_status: string;
    amount_paid: number;
}

export interface UpcomingRepaymentAPI {
    id: string;
    username: string;
    loan_amount: number;
    contract_address: string;
    loan_amount_repaid: number;
    no_of_installments: number;
    installments_completed: number;
    total_discounted_amount: null | number;
    status: string;
    created_at: string;
    installments: UpcomingRepaymentAPIInstallments
    updated_at: string;
}

export interface UpcomingRepayments {
    id: string;         // Loan ID
    borrower: string;    // Username of the borrower
    amount: number;      // Amount due (installment amount)
    dueDate: string;     // Due date (installment date)
    status: string;      // Status (e.g., "pending", "paid", "overdue")
}

export interface TransactionAPI {
    username: string;
    action: string;
    amount: number;
    description: string;
    timestamp: string;
}

export interface RecentTransactions {
    id: string;
    type: string;
    amount: number;
    status: string;
    date: string;
    from: string;
    to: string;
}

export async function getAdminDash() {
        const response = await fetch(`${API_BASE_URL}/user/get-dash?`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${AuthService.getToken()}`,
                "Content-Type": "application/json",
            },

        });
    
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to fetch admin dashboard: ${errorData}`);
        };

        const dashData: AdminDash = await response.json()
        return dashData
}

