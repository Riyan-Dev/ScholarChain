# services/user_service.py
import os
import base64
import json
import time

from fastapi import HTTPException

from middleware.JWT_authentication import get_password_hash, verify_password
from db import user_collection, wallet_collection
from utility import transform_user_document

from models.user import User, DocumentsList
from models.wallet import Wallet


from services.encrption_services import EncrptionServices
from services.rag_services import pdf_to_images, vision_model
from services.documents import document

class UserService:
    @staticmethod
    async def register_user(user_data: User):
        if await UserService.user_exists(user_data.username, user_data.email):
            raise ValueError("Username or email already exists.")
        return await UserService.create_user(user_data)

        # Function to check if a user already exists
    @staticmethod
    async def user_exists(username: str, email: str) -> bool:
        existing_user = await user_collection.find_one({"$or": [{"username": username}, {"email": email}]})
        return existing_user

    # Function to create a new user
    @staticmethod
    async def create_user(user_data: User):
        base64_key = os.getenv("ENCRYPTION_KEY")
        encryption_key = base64.b64decode(base64_key)

        if len(encryption_key) not in (16, 24, 32):
            raise ValueError("Key length is invalid for AES. Use 16, 24, or 32 bytes.")

        private_key, public_key = EncrptionServices.generate_key_pair()
        hashed_password = get_password_hash(user_data.hashed_password)
        
        new_user = {
            "username": user_data.username,
            "email": user_data.email,
            "hashed_password": hashed_password,
            "documents": user_data.documents.dict(),  # Convert the document list to dicts
            "role": user_data.role
        }
        print(private_key)
        # Convert private key to bytes
        private_key_bytes = EncrptionServices.get_private_key_bytes(private_key)

        # Encrypt the private key
        encrypted_private_key = EncrptionServices.encrypt_private_key(private_key_bytes, encryption_key)
        print(EncrptionServices.decrypt_private_key(encrypted_private_key, encryption_key))
        # Save the wallet with an empty transaction list
        new_wallet = Wallet(
            username=user_data.username,
            public_key=EncrptionServices.serialize_public_key(public_key),
            encrypted_private_key=encrypted_private_key,
            balance=0,
            transactions=[]
        )
        
        result = await user_collection.insert_one(new_user)
        await wallet_collection.insert_one(new_wallet.dict())
        
        return str(result.inserted_id) 
    
    @staticmethod
    async def authenticate_user(username: str, password: str):
        user = await user_collection.find_one({"username": username})
        if not user or not verify_password(password, user["hashed_password"]):
            return None
        return user
    
    @staticmethod
    async def add_documents(username: str, new_documents: list):
        # Update MongoDB - Append new documents to the user's `documents` array
        if new_documents:
            result = await user_collection.update_one(
                {"username": username},  # Match user by ID from the token
                {"$set": {"documents": new_documents}}  # Append each document
            )
            
            return {
                "status": "success",
                "modified_count": result.modified_count,
                "message": "Documents have been added successfully."
            }

        return {"status": "error", "message": "No documents were added."}
    
    @staticmethod 
    async def get_user_by_username(username: str):
        user_doc = await user_collection.find_one({"username": username})
        transformed_user = transform_user_document(user_doc)
        user = User(**transformed_user)
        return user
    
    @staticmethod 
    async def get_user_doc_by_username(username: str):
        user_doc = await user_collection.find_one({"username": username})
       
        return user_doc
    

    @staticmethod 
    async def get_all_donars_username():
        users = await user_collection.find().to_list(None)
        donators = [user["username"] for user in users if user["role"] == "donator"]
        return donators


    @staticmethod
    async def upload_documents(files, ids, token): 
        new_documents = {
            "CNIC": [],
            "gaurdian_CNIC": [],
            "electricity_bills": [],
            "gas_bills": [],
            "intermediate_result": [],
            "undergrad_transacript": [],
            "salary_slips": [],
            "bank_statements": [],
            "income_tax_certificate": [],
            "reference_letter": []
        }
        user = await UserService.get_user_doc_by_username(token.username)
        user_documents = user["documents"]



        for i, file in enumerate(files):
            image_paths = await pdf_to_images(file)
            # Prepare the message with multiple images
            # if ids[i] in user_documents:
            #     return {"Messsage": "Documents Uploaded"}
            
            if ids[i] in document:
                time.sleep(10)
                new_documents[ids[i]].extend(document[ids[i]])
                continue

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
                            "text": f"""Give me exact detail of these images in the response of following format (create json object for each page
                                        and return a json_object of list of documents as shown in the response format below)
                                        Note: page content must contain the extracted text and tables for each image
                                        Note: The length of the returned list of documetns should equals the number of images in the input
                                        Final_note: I have already provided the source of Data use it as given in the response format
                                        response format:
                                        {{
                                            "documents": [
                                                {{
                                                    "page_content": "all the text and table related data extracted from each image should be returned in this field",
                                                    "metadata": {{
                                                        "source": {ids[i]},
                                                        "author": "author of the source if any such as bank name or electricity company or Nadra etc,
                                                        "section": "what is the section",
                                                        "document_type": "academic or financial",
                                                        "date": "date of the document if available"
                                                    }}
                                                }}
                                            ]
                                        }}
                                    """
                        },
                        *image_contents  # Add the list of images to the message content
                    ]
                }
            ]

            response = vision_model(messages)
            
            # Parse and validate the response
            try:
                parsed_response = json.loads(response) if isinstance(response, str) else response

                if "documents" in parsed_response and isinstance(parsed_response["documents"], list):
                    for doc in parsed_response["documents"]:
                        doc["page_content"] = json.dumps(doc["page_content"], indent=None)
                    
                    print(parsed_response)
                    new_documents[ids[i]].extend(parsed_response["documents"])
                else:
                    raise HTTPException(status_code=500, detail=f"Unable to fetch response, Try Again")
            except json.JSONDecodeError:
                raise HTTPException(status_code=500, detail=f"Unable to fetch response, Try Again")

        # Check if username is None, and raise an HTTPException if it is
        if token.username is None:
            raise HTTPException(status_code=400, detail="Username is missing in the token")

        # Now safely call add_documents, assuming username is always a valid string
        return await UserService.add_documents(token.username, new_documents)