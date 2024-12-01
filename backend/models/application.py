from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date

class PersonalInfo(BaseModel):
    full_name: str
    dob: date
    gender: str
    nationality: str
    marital_status: str
    phone_number: str
    email_address: str
    residential_address: str
    permanent_address: str

class FinancialInfo(BaseModel):
    total_family_income: float
    other_income_sources: List[str]  # List of sources with amounts
    outstanding_loans_or_debts: List[str]  # List of loans/credit card debts

class AcademicInfo(BaseModel):
    current_education_level: str
    college_or_university: str
    student_id: str
    program_name_degree: str
    duration_of_course: str
    year_or_semester: str
    gpa: float
    achievements_or_awards: Optional[List[str]]  # Optional in case of no achievements

class LoanDetails(BaseModel):
    loan_amount_requested: float
    purpose_of_loan: str  # Tuition fees, accommodation, living expenses
    proposed_repayment_period: str  # e.g., 12 months
    preferred_repayment_frequency: str  # Monthly, quarterly, etc.

class Reference(BaseModel):
    name: str
    designation: str
    contact_details: str
    comments: str

class Application(BaseModel):
    personal_info: PersonalInfo
    financial_info: FinancialInfo
    academic_info: AcademicInfo
    loan_details: LoanDetails
    references: List[Reference]
    status: str  # E.g., Pending, Approved, Rejected
    application_date: date
    declaration: str
    signature: str
    username: str
    _id: str
