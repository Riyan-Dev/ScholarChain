from fastapi import Depends, HTTPException, status, APIRouter, UploadFile, File, Form
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse

from typing import List


from middleware.JWT_authentication import create_access_token, TokenData, get_current_user
from services.user_services import UserService
from models.user import User

user_router = APIRouter()

@user_router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await UserService.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["username"], "role": user["role"]})
    return {"access_token": access_token, "token_type": "bearer"}

@user_router.post("/register")
async def register(user: User):
    user_id = await UserService.register_user(user)
    return JSONResponse(content={"message": "user sucessfully created", "user_id": user_id}, status_code = 201)

@user_router.post("/upload-documents")
async def process_documents(files: List[UploadFile] = File(...), ids: str = Form(...), token: TokenData = Depends(get_current_user)):
    ids_list = ids.split(",")
    print(f"Received ids: {ids_list}")  # Debugging

    await UserService.upload_documents(files, ids_list, token)
    return {"MEssage": f"Following Documents Uploaded {ids}"}





