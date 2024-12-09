# services/user_service.py
import os
import base64

from models.user import User
from models.wallet import Wallet
from middleware.JWT_authentication import get_password_hash, verify_password
from db import user_collection, wallet_collection
from utility import transform_user_document
from services.encrption_services import EncrptionServices
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
            "documents": [doc.dict() for doc in user_data.documents],  # Convert the document list to dicts
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
                {"$push": {"documents": {"$each": new_documents}}}  # Append each document
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
