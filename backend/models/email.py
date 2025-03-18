from pydantic import BaseModel, EmailStr
from typing import List


class EmailSchema(BaseModel):
    to: List[EmailStr]
    subject: str
    template_name: str
    context: dict = {}
