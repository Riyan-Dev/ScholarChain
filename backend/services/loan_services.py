import math

from fastapi import HTTPException
from datetime import datetime

from services.transaction_services import TransactionServices
from services.blockchain_service import BlockchainService

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
        

    @staticmethod
    async def get_loan(username):
        loan = await loan_collection.find_one({"username": username})
        if loan:
            loan["_id"] = str(loan["_id"])

        return loan

    @staticmethod
    async def update_loan(username, update_data):
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided for update.")

        try:
            
            update_data['updated_at'] = datetime.utcnow()

            # Perform the update
            result = await loan_collection.update_one(
                {"username": username, "status": "ongoing"},
                {"$set": update_data}
            )
            if result.modified_count == 0:
                raise HTTPException(status_code=404, detail="Plan not found or no fields to update.")
            
            return {"message": "Loan successfully updated."}
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


    @staticmethod
    async def repay_loan(username): 
        loan_data = await LoanService.get_loan(username)
        loan = Loan(**loan_data)

        installments_remaining = loan.no_of_installments - loan.installments_completed
        amount_remaining = loan.loan_amount - loan.loan_amount_repaid
        amount_to_pay = math.ceil(amount_remaining / installments_remaining)

        await TransactionServices.transfer_token(amount_to_pay, username, "scholarchain")

        deploy_result = await BlockchainService.repay_loan(username, loan.contract_address, amount_to_pay)
        print(deploy_result)

        loan.installments_completed += 1
        loan.loan_amount_repaid += amount_to_pay

        return await LoanService.update_loan(username, loan.dict())


