from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class TokenTransaction(BaseModel):
    username: str
    amount: int
    action: str  # 'buy' or 'burn'
    timestamp: str =  datetime.now().strftime("%Y-%m-%d %H:%M:%S") # Add timestamp for tracking transactions
    description: Optional[str] = ""

class Wallet(BaseModel):
    username: str
    public_key: str
    encrypted_private_key: str  # Store encrypted private key
    balance: int
    transactions: List[TokenTransaction]  # List of transactions
