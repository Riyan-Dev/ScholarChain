from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Installment(BaseModel):
    installment_id: int
    installment_date: datetime
    installment_paid_date: Optional[datetime] = None
    installment_status: str = "pending"
    amount_paid: float = 0
    class Config:
        orm_mode = True

class Loan(BaseModel):
    id: Optional[str] = Field(None, alias="_id")  # Unique identifier for the loan
    username: str
    loan_amount: float  # Total loan amount
    contract_address: str  # Smart contract address managing this loan
    loan_amount_repaid: float = 0.0  # Amount repaid so far
    no_of_installments: int  # Total number of installments
    installments_completed: int = 0  # Number of installments completed
    total_discounted_amount: Optional[float] = None  # Total amount after discounts, if applicable
    status: str = "ongoing"  # Status of the loan: ongoing, completed, defaulted, etc.
    created_at: datetime = Field(default_factory=datetime.utcnow)  # Loan creation timestamp
    installments:  list[Installment] = None
    class Config:
        orm_mode = True
