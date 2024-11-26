# services/user_service.py
from models.user import User
from middleware.JWT_authentication import get_password_hash, verify_password
from db import user_collection
# from utils import hash_password, user_exists, create_user

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
        hashed_password = get_password_hash(user_data.password)
        
        new_user = {
            "username": user_data.username,
            "email": user_data.email,
            "hashed_password": hashed_password,
            "documents": [doc.dict() for doc in user_data.documents]  # Convert the document list to dicts
        }
        
        result = await user_collection.insert_one(new_user)
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