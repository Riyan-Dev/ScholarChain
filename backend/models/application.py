from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import date
from bson import ObjectId

class PersonalInfo(BaseModel):
    full_name: str = ""
    dob: date = None
    gender: str = ""
    nationality: str = ""
    marital_status: str = ""
    phone_number: str = ""
    email_address: str = ""
    residential_address: str = ""
    permanent_address: str = ""

class FinancialInfo(BaseModel):
    total_family_income: float = 0.0
    gas_bill: float = 0.0
    electricity_bill: float = 0.0
    other_income_sources: List[str] = []
    outstanding_loans_or_debts: List[str] = []

class AcademicInfo(BaseModel):
    current_education_level: str = ""
    college_or_university: str = ""
    student_id: str = ""
    program_name_degree: str = ""
    duration_of_course: str = ""
    year_or_semester: str = ""
    gpa: float = 0.0
    achievements_or_awards: Optional[List[str]] = []

class LoanDetails(BaseModel):
    loan_amount_requested: float = 0.0
    purpose_of_loan: str = ""
    proposed_repayment_period: str = ""
    preferred_repayment_frequency: str = ""

class Reference(BaseModel):
    name: str = ""
    designation: str = ""
    contact_details: str = ""
    comments: str = ""

class Document(BaseModel):
    type: str = ""
    url: str = ""

class Application(BaseModel):
    personal_info: PersonalInfo = PersonalInfo()
    financial_info: FinancialInfo = FinancialInfo()
    academic_info: AcademicInfo = AcademicInfo()
    loan_details: LoanDetails = LoanDetails()
    references: List[Reference] = []
    status: str = "pending"  # Default status
    application_date: date = date.today()
    declaration: str = ""
    signature: str = ""
    username: str = ""
    id: Optional[str] = Field(None, alias="_id")
    documents: Optional[List[Document]] = []

    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str
        }
