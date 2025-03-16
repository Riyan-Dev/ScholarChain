
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks


from middleware.JWT_authentication import TokenData, get_current_user

from models.application import Application
from models.plan import Plan

from services.transaction_services import TransactionServices
from services.blockchain_service import BlockchainService


donator_router = APIRouter()

@donator_router.post("/buy-tokens/")
async def buy_tokens(amount: float, current_user: TokenData = Depends(get_current_user)):
    return await TransactionServices.mint_token(amount, current_user.username)

@donator_router.post("/donate/")
async def donate(amount: float,  current_user: TokenData = Depends(get_current_user)):
    await BlockchainService.make_donation(current_user.username, amount)
    return await TransactionServices.transfer_token(amount, current_user.username, "scholarchain", "Donated to Scholarchain")

@donator_router.get("/get-wallet/")
async def get_wallet( current_user: TokenData = Depends(get_current_user)):
    return await TransactionServices.get_wallet(current_user.username)
