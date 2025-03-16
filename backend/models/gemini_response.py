
from pydantic import BaseModel

class PlanResponse(BaseModel):
    total_loan_amount: float
    start_date: str
    end_date: str
    repayment_frequency: str
    installment_amount: float
    reasoning: str
    application_id: str