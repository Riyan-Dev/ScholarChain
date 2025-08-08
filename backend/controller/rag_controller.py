
from fastapi import APIRouter, Depends, BackgroundTasks
from pydantic import BaseModel

from services.langchain_services import LangChainService
from services.user_services import UserService
from middleware.JWT_authentication import TokenData, get_current_user

router = APIRouter()

class Query(BaseModel):
    query: str

@router.post("/chat")
async def chat(query: Query, current_user: TokenData = Depends(get_current_user)):
    return await LangChainService.rag_bot(query.query, current_user.username)

@router.post("/")
async def chat(background_tasks: BackgroundTasks, current_user: TokenData = Depends(get_current_user)):
    background_tasks.add_task(UserService.update_mongo_vector_store, current_user.username)
    return {"Message": "Updating User Mongo Vector Store"}



   

