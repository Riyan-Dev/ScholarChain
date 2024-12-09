from pydantic import BaseModel
from datetime import date

class Plan(BaseModel):
    _id: str
    total_loan_amount: float
    start_date: date
    end_date: date
    repayment_frequency: str
    installment_amount: float
    reasoning: str
    application_id: str