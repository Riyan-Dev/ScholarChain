from typing import Optional
from pydantic import BaseModel

class BlockDetails(BaseModel):
    block_number: int
    block_hash: str
    block_timestamp: int
    block_transactions: list

class TransactionDetails(BaseModel):
    transaction_hash: str
    block_number: int
    from_address: str
    to_address: Optional[str]
    value: str
    gas_used: int
    type: str