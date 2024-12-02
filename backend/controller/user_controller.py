from fastapi import Depends, HTTPException, status, APIRouter, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse

from typing import List
import base64
import os
import json

from services.rag_services import pdf_to_images, vision_model

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
async def process_documents(files: List[UploadFile] = File(...),  token: TokenData = Depends(get_current_user)):
    new_documents = []
    for file in files:
        image_paths = await pdf_to_images(file)
        
        # Prepare the message with multiple images
        image_contents = []
        for image_path in image_paths:
            if os.path.exists(image_path):
                # Load and encode the local image
                with open(image_path, "rb") as image_file:
                    image_bytes = image_file.read()

                # Convert image bytes to base64
                image_base64 = base64.b64encode(image_bytes).decode("utf-8")

                # Append the base64 image content to the list
                image_contents.append(
                    {
                        "type": "image_url",
                        "image_url": f"data:image/jpeg;base64,{image_base64}"
                    }
                )

                os.remove(image_path)
             
        # Define the messages, with multiple images
        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """Give me exact detail of these images in the response of following format (create json object for each page
                                    and return a json_object of list of documents as shown in the response format below)
                                    Note: page content must contain the extracted text and tables for each image
                                    Note: The length of the returned list of documetns should equals the number of images in the input
                                    
                                    response format:
                                    {
                                        "documents": [
                                            {
                                                "page_content": "all the text and table related data extracted from each image should be returned in this field",
                                                "metadata": {
                                                    "source": "source of the data",
                                                    "author": "author if available",
                                                    "section": "what is the section",
                                                    "document_type": "academic or financiall",
                                                    "date": "date of the document if available"
                                                }
                                            }
                                        ]
                                    }
                                """
                    },
                    *image_contents  # Add the list of images to the message content
                ]
            }
        ]



        response = vision_model(messages)
        print(response)
        # Parse and validate the response
        try:
            parsed_response = json.loads(response) if isinstance(response, str) else response

            if "documents" in parsed_response and isinstance(parsed_response["documents"], list):
                new_documents.extend(parsed_response["documents"])
            else:
                raise ValueError("Invalid response format from vision_model.")
        except json.JSONDecodeError:
            raise ValueError("Failed to parse response from vision_model.")

    
    return await UserService.add_documents(token.username, new_documents)
