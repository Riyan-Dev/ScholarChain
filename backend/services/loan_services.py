from fastapi import HTTPException

from models.loan import Loan
from db import loan_collection

class LoanService:

    @staticmethod
    async def create_loan(username, loan_amount, no_installments, address):
        
        loan = Loan(username= username, loan_amount= loan_amount, no_of_installments = no_installments, contract_address= address)

        try:
            result = await loan_collection.insert_one(loan.dict())
            print(result)
            return {
                "message": "Loan successfully created.",
                "loan_id": str(result.inserted_id)
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

