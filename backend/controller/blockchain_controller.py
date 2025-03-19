from models.block_details import BlockDetails, TransactionDetails
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from services.blockchain_service import BlockchainService
from typing import List

blockchain_router = APIRouter()

@blockchain_router.get("/transactions/{account_address}", response_model=List[TransactionDetails])
async def get_transactions(account_address: str):
    try:
        return await BlockchainService.get_transactions_for_account(account_address)
    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Unable to fetch ledger: {e}")

@blockchain_router.get('/', response_model=List[BlockDetails])
async def get_ledger():
    try:
        return await BlockchainService.get_complete_ledger()
    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Unable to fetch ledger: {e}")
