
from fastapi import APIRouter, Depends


from services.langchain_services import LangChainService
from middleware.JWT_authentication import TokenData, get_current_user

router = APIRouter()

@router.post("/chat")
async def chat(query: str, current_user: TokenData = Depends(get_current_user)):

    temp_dir = await LangChainService.create_vector_Store(current_user.username, False)
    
    return await LangChainService.rag_bot(query, temp_dir)



   

