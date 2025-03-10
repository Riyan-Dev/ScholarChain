import math

from fastapi import HTTPException
from datetime import datetime
import dateutil.relativedelta

from services.transaction_services import TransactionServices
from services.blockchain_service import BlockchainService

from models.loan import Loan, Installment
from db import loan_collection
from bson import ObjectId

from pymongo import UpdateOne

class LoanService:

    @staticmethod
    async def create_loan(loan_amount, start_date, end_date, repayement_frequecy, username, address):
        print("yolo")
        loan = await LoanService.create_loan_object(total_loan_amount=loan_amount, 
                                              start_date=start_date, 
                                              end_date=end_date, 
                                              repayment_frequency=repayement_frequecy, 
                                              username=username, 
                                              contract_address=address)
        print(loan.dict())
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
    
    @staticmethod
    async def get_all_loans():
        loans = loan_collection.find().to_list()
        for loan in loans:
            loan["_id"] = str(loan["_id"])
        return loans
    
    @staticmethod
    async def get_loan_by_id(loan_id: str):
        loan = await loan_collection.find_one({"_id": ObjectId(loan_id)})
        if loan:
            loan["_id"] = str(loan["_id"])
        return loan
    
    @staticmethod
    async def get_loan_by_username(username):
        loan = await loan_collection.find_one({"username": username})
        if loan:
            loan["_id"] = str(loan["_id"])
        return loan

    @staticmethod
    async def update_overdue_status(username):
        loan = await LoanService.get_loan_by_username(username)
        if not loan:
            return {"message": "Loan not found"}
        
        updates = []

        current_date = datetime.now()

        for installment in (loan["installments"] or []):
            Installment_date = installment["installment_date"]

            if Installment_date < current_date and installment["installment_status"] == "pending":
                updates.append(
                    UpdateOne(
                        {
                            "_id": ObjectId(loan["_id"]),
                            "installments.installment_id": installment["installment_id"]
                        },
                        {
                            "$set": {"installments.$.installment_status": "overdue"}
                        }
                    )
                )

            if updates:
                await loan_collection.bulk_write(updates)
                return {"message": f"{len(updates)} installments marked as overdue"}
    
        
        return {"Message": "nothign to update"}

    @staticmethod
    async def get_loan_summary(username):
        await LoanService.update_overdue_status(username)
        
        projection = {
            "installments": 0
        } 
        
        loan = await loan_collection.find_one({"username": username}, projection)
        if not loan:
            return
        loan["_id"] = str(loan["_id"])
        pipeline = [
            {"$match": {"username": "scholarchain"}},  
            {"$unwind": "$installments"},  
            {
                "$group": {
                    "_id": "$installments.installment_status",  
                    "count": {"$sum": 1}  
                }
            },
            {
                "$group": {
                    "_id": 0,
                    "pending": {"$sum": {"$cond": [{"$eq": ["$_id", "pending"]}, "$count", 0]}},
                    "overdue": {"$sum": {"$cond": [{"$eq": ["$_id", "overdue"]}, "$count", 0]}},
                    "paid": {"$sum": {"$cond": [{"$eq": ["$_id", "paid"]}, "$count", 0]}}
                }
            },
            {
                "$project": {
                    "_id": 0,  
                    "pending": 1,
                    "overdue": 1,
                    "paid": 1
                },
            },
        ]

        result = await loan_collection.aggregate(pipeline).to_list(length=1)

        combined_summary = result[0] | loan

        return combined_summary
  
        

    @staticmethod
    async def get_loan_details(username):
        loan = await LoanService.get_loan_by_username(username)
        if not loan:
            raise HTTPException(status_code=404, detail="Loan not found.")
        
        installments_remaining = loan["no_of_installments"]
        installments = loan["installments"]
        for installment in installments:
            if installment["installment_status"] == "paid":
                installment["amount_due"] = installment["amount_paid"]
                installments_remaining -= 1
            elif installment["installment_status"] == "overdue":
                installment["amount_due"] = 0
                installments_remaining -= 1
            else:
                installment["amount_due"] = (loan["loan_amount"] - loan["loan_amount_repaid"]) / installments_remaining
        
        loan["installments_completed"] = loan["no_of_installments"] - installments_remaining

        return loan
    


    @staticmethod
    async def create_loan_object(
        total_loan_amount: float,
        start_date: str,
        end_date: str,
        repayment_frequency: str,
        username: str,
        contract_address: str
    ) -> Loan:
        """Creates a Loan object (using Pydantic models) from the input data.

        Args:
            total_loan_amount: The total loan amount.
            start_date: Loan start date (e.g., "Nov-2024").
            end_date: Loan end date (e.g., "Oct-2025").
            repayment_frequency: Repayment frequency ("monthly", "quarterly", "annually", "biannually").
            username:  Username.
            contract_address: Contract address.

        Returns:
            A Loan object.

        Raises:
            ValueError: If input data is invalid.
        """
        # --- 1. Input Validation ---
        if total_loan_amount <= 0:
            raise ValueError("Loan amount must be positive.")

        repayment_frequency = repayment_frequency.lower()
        valid_frequencies = ["monthly", "quarterly", "annually", "biannually"]
        if repayment_frequency not in valid_frequencies:
            raise ValueError(f"Invalid repayment frequency.  Must be one of: {', '.join(valid_frequencies)}")

        try:
            start_date_dt = datetime.strptime(start_date, "%b-%Y")
            end_date_dt = datetime.strptime(end_date, "%b-%Y")
        except ValueError as e:
            raise ValueError(f"Invalid date format: {e}")

        if start_date_dt >= end_date_dt:
            raise ValueError("Start date must be before end date.")

        # --- 2. Calculate Number of Installments ---
        delta = dateutil.relativedelta.relativedelta(end_date_dt, start_date_dt)
        total_months = delta.months + (delta.years * 12)

        if repayment_frequency == "monthly":
            installment_months = 1
            no_of_installments = total_months + 1
        elif repayment_frequency == "quarterly":
            installment_months = 3
            no_of_installments = (total_months // 3) + (1 if total_months % 3 == 0 or start_date_dt.day <= end_date_dt.day else 0)
        elif repayment_frequency == "biannually":
            installment_months = 6
            no_of_installments = (total_months // 6) + (1 if total_months % 6 == 0 or start_date_dt.day <= end_date_dt.day else 0)
        elif repayment_frequency == "annually":
            installment_months = 12
            no_of_installments = (total_months // 12) + (1 if total_months % 12 == 0 or start_date_dt.day <= end_date_dt.day else 0)
        else:  # Should never happen
            raise ValueError("Internal Error: Invalid frequency.")

        # --- 3. Create Installment Objects ---
        installments = []
        current_installment_date = start_date_dt
        for i in range(no_of_installments):
            installment = Installment(
                installment_id=i+1,
                installment_date=current_installment_date
            )
            installments.append(installment)
            current_installment_date = current_installment_date + dateutil.relativedelta.relativedelta(months=installment_months)

        # --- 4. Create the Loan Object ---
        loan = Loan(
            username=username,
            loan_amount=total_loan_amount,
            contract_address=contract_address,
            no_of_installments=no_of_installments,
            installments=installments
        )

        return loan


