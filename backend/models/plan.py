from pydantic import BaseModel, Field
from datetime import date
from typing import Optional


class Plan(BaseModel):
    id: Optional[str] = Field(None, alias="_id") 
    total_loan_amount: float
    start_date: date
    end_date: date
    repayment_frequency: str
    installment_amount: float
    reasoning: str
    application_id: str