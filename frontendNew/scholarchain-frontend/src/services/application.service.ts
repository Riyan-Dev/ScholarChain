/* eslint-disable prettier/prettier */
import config from "@/config/config";
import { AuthService } from "@/services/auth.service";

const API_BASE_URL = config.fastApi.baseUrl;

export interface Application {
    id: string;
    applicant: string;
    email: string;
    amount: number;
    status: string;
    submittedDate: string;
    riskScore?: number | null | "N/A";
}

// Added: Interface for the full application details (matches your MongoDB document structure)
export interface ApplicationDetails {
    _id: { $oid: string };
    username: string;
    personal_info: {
        full_name: string;
        dob: { $date: string };
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
        other_income_sources: string[];
        outstanding_loans_or_debts: string[];
    };
    academic_info: {
        current_education_level: string;
        college_or_university: string;
        student_id: string;
        program_name_degree: string;
        duration_of_course: string;
        year_or_semester: string;
        gpa: number;
        achievements_or_awards: string[];
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
    application_date: { $date: string };
    declaration: string;
    signature: string;
    created_at: { $date: string };
    updated_at: { $date: string };
}

// Interface for the Risk Assessment data
export interface RiskAssessment {
    _id: string;
    application_id: string;
    financial_risk: RiskCategory;
    academic_risk: RiskCategory;
    personal_risk: RiskCategory;
    reference_risk: RiskCategory;
    repayment_potential: RiskCategory;
    created_at: string; // Could also use Date if you prefer to parse it
}

export interface RiskCategory {
    risk_score: number;
    calculations: string;
}

// Interface for the Repayment Plan data
// Use consistent naming (startDate, not Start_date)
export interface RepaymentPlan {
    _id: string;
    total_loan_amount: number;
    start_date: string; // Consistent naming
    end_date: string;    // Consistent naming
    repayment_frequency: string;
    installment_amount: number;
    reasoning: string;
    application_id: string;
    created_at: string; // Could also use Date
    updated_at: string; // Could also use Date
}
// Interface for the complete response from the endpoint
export interface ApplicationDetailsResponse {
    Status: string;
    risk_assessment: RiskAssessment;
    plan: RepaymentPlan;
    total_score: number;
}


export async function getAllApplications(): Promise<Application[]> {
    const response = await fetch(`${API_BASE_URL}/admin/get-all-applications`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${AuthService.getToken()}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to fetch applications: ${errorData}`);
    }

    const data: Application[] = await response.json();
    return data;
}

// Added: Function to fetch application details by ID
export async function getApplicationDetailsById(applicationId: string): Promise<ApplicationDetails> {
    const response = await fetch(`${API_BASE_URL}/application/get-by-id/?application_id=${applicationId}`, { // Corrected URL
        method: "GET",
        headers: {
            Authorization: `Bearer ${AuthService.getToken()}`, // Assuming you need authentication
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.text();  // Get more detailed error
        throw new Error(`Failed to fetch application details: ${errorData}`);
    }

    const data: ApplicationDetails = await response.json();
    return data;
}

// Function to fetch application details, risk assessment, and repayment plan
export async function fetchApplicationDetails(applicationId: string): Promise<ApplicationDetailsResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/fetch-application-details?application_id=${applicationId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${AuthService.getToken()}`,
            "Content-Type": "application/json",
            "accept": "application/json" // Explicitly set accept header
        },
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to fetch application details: ${errorData}`);
    }

    const data: ApplicationDetailsResponse = await response.json();
    return data;
}

// Added: Function to verify an application
export async function verifyApplication(applicationId: string, verified: boolean): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/verify/?application_id=${applicationId}&verified=${verified}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${AuthService.getToken()}`,
            "Content-Type": "application/json", // IMPORTANT:  Include Content-Type
            "accept": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to verify application: ${errorData}`);
    }
    // Consider returning something, even if it's just an empty object:
    // return response.json(); // Or {} if the response is truly empty.
}


// Function to update the repayment plan
export async function updateRepaymentPlan(updatedPlan: RepaymentPlan): Promise<any> { // Using any since your route returns a message
    const response = await fetch(`${API_BASE_URL}/admin/update-plan/?application_id=${updatedPlan.application_id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${AuthService.getToken()}`,
            "Content-Type": "application/json", // CRUCIAL: Set Content-Type
            "accept": "application/json",         // Good practice
        },
        body: JSON.stringify(updatedPlan), // Send the updated data in the request body
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to update repayment plan: ${errorData}`);
    }

    return await response.json(); // Return the response (which should be {message: ...})
}