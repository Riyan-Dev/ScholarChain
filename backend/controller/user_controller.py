import os

from services.transaction_services import TransactionServices
from fastapi import Depends, HTTPException, status, APIRouter, UploadFile, File, Form, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse

from typing import List

from middleware.JWT_authentication import create_access_token, TokenData, get_current_user
from services.user_services import UserService
from services.email_service import send_email
from models.user import User
from models.email import EmailSchema


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
async def process_documents( background_tasks: BackgroundTasks, files: List[UploadFile] = File(...), ids: str = Form(...), token: TokenData = Depends(get_current_user)):
    ids_list = ids.split(",")
    documents, file_paths = await UserService.store_documents(files, ids_list, token)
    print(f"Files Paths: {file_paths}")  # Debugging
    # ids_list = ['CNIC', 'gaurdian_CNIC', 'intermediate_result', 'bank_statements', 'salary_slips', 'gas_bills', 'electricity_bills', 'reference_letter', 'undergrad_transcript']
    background_tasks.add_task(UserService.upload_documents, token, file_paths, ids_list,documents)
    return {"Message": f"Docuemnt Uploading in process"}

@user_router.get("/documents-status")
async def get_documents_status(token: TokenData = Depends(get_current_user)):
    return await UserService.check_all_document_types_present(token.username)

@user_router.get("/get-dash")
async def get_dash(token: TokenData = Depends(get_current_user)):
    print("Getting Dash")
    if token.role == "applicant":
        dash = await UserService.get_applicant_dash(token.username)
        return dash
    elif token.role == "donator": 
        dash = await UserService.get_donator_dash(token.username)
        return dash
    elif token.role == "admin":
        dash = await UserService.get_admin_dash()
        return dash

@user_router.post("/set-upload")
async def set_upload(token: TokenData = Depends(get_current_user)):
    return await UserService.set_upload(token.username)

@user_router.get("/transactions/")
async def get_transaction(token: TokenData = Depends(get_current_user)):
    try:
        if (token.role != "admin"):
            transactions = await TransactionServices.get_transactions(token.username)
            return JSONResponse(content=transactions, status_code = 200)
        else:
            transactions = await TransactionServices.get_all_transactions()
            return JSONResponse(content=transactions, status_code = 200)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=404,
            detail="Wallet not found",
            headers={"WWW-Authenticate": "Bearer"},
        )



