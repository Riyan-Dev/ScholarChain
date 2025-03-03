
from fastapi import HTTPException
from db import wallet_collection
from services.encrption_services import EncrptionServices

import base64



from models.wallet import TokenTransaction

class TransactionServices:
    

    @staticmethod
    async def transfer_token(amount: float, sender_username: str, reciever_username):
        sender_wallet = await TransactionServices.get_wallet_for_update(sender_username)
        reciever_wallet = await TransactionServices.get_wallet_for_update(reciever_username) 

        if sender_wallet["balance"] < amount:
            raise HTTPException(status_code=400, detail="Insufficient Balance in wallet.")

        sender_wallet["balance"] -= amount
        reciever_wallet["balance"] += amount

        credit_transaction = TokenTransaction(username=sender_username, amount=amount, action="credit")
        debit_transaction = TokenTransaction(username=reciever_username, amount=amount, action="debit")

        sender_wallet["transactions"].append(debit_transaction.dict())
        reciever_wallet["transactions"].append(credit_transaction.dict())

        await TransactionServices.update_wallet(sender_wallet)
        await TransactionServices.update_wallet(reciever_wallet)

        return {"message": "Transaction_successful"}
    
    @staticmethod
    async def mint_token(amount: float, username: str):
        wallet = await TransactionServices.get_wallet_for_update(username)

        wallet["balance"] += amount
        transaction = TokenTransaction(username="", amount=amount, action="buy")
        wallet["transactions"].append(transaction.dict())
        await TransactionServices.update_wallet(wallet)

        
            
        return {"message": "Tokens Minted Successfully."}

    @staticmethod
    async def update_wallet(wallet):
        result = await wallet_collection.update_one(
            {"username": wallet["username"]},
            {"$set": wallet}
        )
        if result.modified_count == 0:
                raise HTTPException(status_code=404, detail="Wallet not found or no fields to update.")
        
        return result
    
    @staticmethod
    async def get_wallet(username: str):
        wallet = await wallet_collection.find_one({"username": username})
        if wallet:
            wallet["_id"] = str(wallet["_id"])

        return wallet
    
    @staticmethod
    async def get_wallet_for_update(username: str):
        wallet = await wallet_collection.find_one({"username": username})
        if wallet:
            return wallet
        else:
            raise HTTPException(status_code=404, detail="Wallet not found or no fields to update.")

    @staticmethod
    async def get_all_donations_list(donars: list):
        wallets = await wallet_collection.find({"username": {"$in": donars}}).to_list(None) 
        
        tranasctions = []

        for wallet in wallets:
            for t in wallet["transactions"]:
                # raw_key = "".join(line for line in wallet["public_key"].splitlines() if "BEGIN" not in line and "END" not in line)

                # # Step 2: Decode Base64 content into bytes
                # key_bytes = base64.b64decode(raw_key)

                # # Step 3: Re-encode as a plain Base64 string (optional)
                # base64_encoded_key = base64.b64encode(key_bytes).decode('utf-8')
                if t["action"] == "debit":
                    
                    tranasctions.append({
                        "account_id":  str(wallet["_id"]),
                        "donation_amount": t["amount"]
                    })
        
        return tranasctions