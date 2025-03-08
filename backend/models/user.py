# models/user.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum
# Define the Enum
class UserRole(str, Enum):
    ADMIN = "admin"
    APPLICANT = "applicant"
    DONATOR = "donator"

class DocumentMetadata(BaseModel):
    source: str
    author: str
    section: str
    document_type: str
    date: datetime

class Document(BaseModel):
    page_content: str
    metadata: DocumentMetadata

class DocumentsList(BaseModel):
    CNIC: List[Document] = []
    gaurdian_CNIC: List[Document] = []
    electricity_bills: List[Document] = []
    gas_bills: List[Document] = []
    intermediate_result: List[Document] = []
    undergrad_transacript: List[Document] = []
    salary_slips: List[Document] = []
    bank_statements: List[Document] = []
    income_tax_certificate: List[Document] = []
    reference_letter: List[Document] = []

class User(BaseModel):
    _id: str
    username: str
    email: str
    hashed_password: str
    role: UserRole
    application_stage: str
    documents: DocumentsList
