
from services.transaction_services import TransactionServices
from config.config import Config
from fastapi import HTTPException
import json
import os

from dotenv import load_dotenv


from RPC_server import web3

from services.encrption_services import EncrptionServices
from models.wallet import Wallet




class BlockchainService:
    
    async def get_abi(path: str):
        try:
            # Load the JSON file
            with open(path, "r") as file:
                data = json.load(file)
            
            # Extract and return the ABI
            abi = data.get("abi")
            if not abi:
                raise ValueError("ABI not found in the JSON file.")
            
            return abi
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="Contract ABI file not found.")
        except ValueError as e:
            raise HTTPException(status_code=500, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail="An error occurred while loading the ABI.")

    @staticmethod
    async def deploy_loan_contract(username: str, loan_amount: int):
        load_dotenv()

        random_salt = os.urandom(32)
        salt = int.from_bytes(random_salt, byteorder='big')
        factory_address = Config.factory_address
        factory_contract_abi = await BlockchainService.get_abi("./contracts/Create2Factory.json")

        loan_factory_contract = web3.eth.contract(address=factory_address, abi=factory_contract_abi)
        
        new_contract_address = loan_factory_contract.functions.getAddress(bytecode, salt).call()
        
        # Build the transaction for deploying the loan
        transaction = loan_factory_contract.functions.deploy(
            int(loan_amount),
            salt
        ).build_transaction({
            'gas': 4000000,
            'gasPrice': web3.to_wei('20', 'gwei'),
            'nonce': web3.eth.get_transaction_count(wallet.public_key),
            'chainId': 1337  # Update for the correct chain ID
        })

         # Sign the transaction
        signed_transaction = web3.eth.account.sign_transaction(transaction, EncrptionServices.decrypt_private_key(wallet.encrypted_private_key))
        # Send the transaction
        tx_hash = web3.eth.send_raw_transaction(signed_transaction.raw_transaction)
        # Wait for transaction receipt
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        # print(tx_receipt)
        
        new_contract_abi = await BlockchainService.get_abi("./contracts/LoanRepayment.json") 
        loan_contract = web3.eth.contract(address=new_contract_address, abi=new_contract_abi)
        amount = loan_contract.functions.getRemainingAmount().call()
        print(amount)

        # Check if contract creation failed
        if not amount == loan_amount:
            raise Exception("Contract deployment failed or transaction did not create a contract.")

        return {"transaction_hash": tx_hash.hex(), "contract_address": new_contract_address}
    
    @staticmethod
    async def repay_loan(username: str, contract_address: str, amount: int):

        loan_contract_abi = await BlockchainService.get_abi("./contracts/LoanRepayment.json") 
        loan_contract = web3.eth.contract(address=contract_address, abi=loan_contract_abi)

        wallet_data = await TransactionServices.get_wallet(username)
        wallet = Wallet(**wallet_data)


         # Build the transaction for deploying the loan
        transaction = loan_contract.functions.repay(
            int(amount),
        ).build_transaction({
            'gas': 2000000,
            'gasPrice': web3.to_wei('20', 'gwei'),
            'nonce': web3.eth.get_transaction_count(wallet.public_key),
            'chainId': 1337  # Update for the correct chain ID
        })

        # Sign the transaction
        signed_transaction = web3.eth.account.sign_transaction(transaction, EncrptionServices.decrypt_private_key(wallet.encrypted_private_key))
        # Send the transaction
        tx_hash = web3.eth.send_raw_transaction(signed_transaction.raw_transaction)
        # Wait for transaction receipt
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

        if tx_receipt["status"] != 1:
            raise HTTPException(status_code=500, detail="Transaction Incomplete, try again")
        
        return {"transaction_hash": tx_hash.hex(), "status": "success"} 
    
    @staticmethod
    async def make_donation(username, amount):
        load_dotenv()
        
        donation_contract_address = Config.donation_contract_address
        donation_contract_abi = await BlockchainService.get_abi("./contracts/DonationTracker.json") 

        donation_contract = web3.eth.contract(address = donation_contract_address, abi=donation_contract_abi)

        wallet_data = await TransactionServices.get_wallet(username)
        wallet = Wallet(**wallet_data)


         # Build the transaction for deploying the loan
        transaction = donation_contract.functions.donate(
            int(amount),
        ).build_transaction({
            'gas': 2000000,
            'gasPrice': web3.to_wei('20', 'gwei'),
            'nonce': web3.eth.get_transaction_count(wallet.public_key),
            'chainId': 1337  # Update for the correct chain ID
        })

        # Sign the transaction
        signed_transaction = web3.eth.account.sign_transaction(transaction, EncrptionServices.decrypt_private_key(wallet.encrypted_private_key))
        # Send the transaction
        tx_hash = web3.eth.send_raw_transaction(signed_transaction.raw_transaction)
        # Wait for transaction receipt
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

        if tx_receipt["status"] != 1:
            raise HTTPException(status_code=500, detail="Transaction Incomplete, try again")
        
        return {"transaction_hash": tx_hash.hex(), "status": "success"} 
