from models.wallet import Wallet
from middleware.JWT_authentication import TokenData, get_current_user
from services.transaction_services import TransactionServices
from models.block_details import BlockDetails, TransactionDetails
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from services.blockchain_service import BlockchainService
from typing import List

blockchain_router = APIRouter()

@blockchain_router.get("/transactions/", response_model=List[TransactionDetails])
async def get_transactions(current_user: TokenData = Depends(get_current_user)):
    # try:
        if current_user.role != "admin":
            wallet_data = await TransactionServices.get_wallet(current_user.username)
            wallet = Wallet(**wallet_data)
            return await BlockchainService.get_transactions_for_account(wallet.public_key)
        else:
            return await BlockchainService.get_all_transactions()
    # except Exception as e: 
        # raise HTTPException(status_code=500, detail=f"Unable to fetch ledger: {e}")

@blockchain_router.get('/', response_model=List[BlockDetails])
async def get_ledger():
    try:
        return await BlockchainService.get_complete_ledger()
    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Unable to fetch ledger: {e}")
