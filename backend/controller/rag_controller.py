
from fastapi import APIRouter, Depends


from services.langchain_services import LangChainService
from middleware.JWT_authentication import TokenData, get_current_user

router = APIRouter()

@router.post("/chat")
async def chat(query: str, current_user: TokenData = Depends(get_current_user)):

    
    return await LangChainService.rag_bot(query, current_user.username)



   

