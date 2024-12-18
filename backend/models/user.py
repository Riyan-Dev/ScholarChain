# models/user.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DocumentMetadata(BaseModel):
    source: str
    author: str
    section: str
    document_type: str
    date: datetime

class Document(BaseModel):
    page_content: str
    metadata: DocumentMetadata

class User(BaseModel):
    _id: str
    username: str
    email: str
    hashed_password: str
    documents: Optional[List[Document]] = []
