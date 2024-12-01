from fastapi import HTTPException # type: ignore
from datetime import datetime

from db import application_collection
from utility import convert_date_fields

class ApplicationService:

    @staticmethod
    async def create_application(application_data: dict):
        try:
            application_data['created_at'] = datetime.utcnow()
            application_data['updated_at'] = datetime.utcnow()
            result = await application_collection.insert_one(application_data)
            print(result)
            return {
                "message": "Application successfully created.",
                "application_id": str(result.inserted_id)
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @staticmethod
    async def update_application(username: str, update_data: dict):
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided for update.")

        update_data = convert_date_fields(update_data)
        try:
            
            update_data['updated_at'] = datetime.utcnow()

            # Perform the update
            result = await application_collection.update_one(
                {"username": username},
                {"$set": update_data}
            )
            if result.modified_count == 0:
                raise HTTPException(status_code=404, detail="Application not found or no fields to update.")
            
            return {"message": "Application successfully updated."}
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @staticmethod
    async def get_application(username: str):
        application = await application_collection.find_one({"username": username})
        return application
    
    