from pydantic import BaseModel, Field, validator
from datetime import date
from typing import Optional
from enum import Enum
from datetime import datetime


# Enum for repayment frequency
class RepaymentFrequency(str, Enum):
    monthly = "monthly"
    quarterly = "quarterly"
    annually = "annually"
    biannually = "biannually"

# Plan model
class Plan(BaseModel):
    id: Optional[str] = Field(None, alias="_id") 
    total_loan_amount: float
    start_date: date
    end_date: date
    repayment_frequency: RepaymentFrequency
    installment_amount: float
    reasoning: str
    application_id: str

    @validator("start_date", "end_date", pre=True)
    def parse_dates(cls, value):
        if isinstance(value, str):
            try:
                return datetime.strptime(value, "%b-%Y").date()
            except ValueError:
                raise ValueError(f"Invalid date format: {value}")
        return value

    def calculate_number_of_installments(self) -> int:
        # Calculate the total duration in days
        duration_days = (self.end_date - self.start_date).days
        
        # Map repayment frequency to duration in days
        frequency_map = {
            RepaymentFrequency.monthly: 30,
            RepaymentFrequency.quarterly: 90,
            RepaymentFrequency.annually: 365,
            RepaymentFrequency.biannually: 182  # Approximation for 6 months
        }
        
        # Get the number of installments
        frequency_days = frequency_map[self.repayment_frequency]
        number_of_installments = duration_days // frequency_days
        
        return number_of_installments