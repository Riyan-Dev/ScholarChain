from fastapi import HTTPException # type: ignore
from datetime import datetime

from db import application_collection, plan_collection
from utility import convert_date_fields

class ApplicationService:

    @staticmethod
    async def get_all_applications():
        applications = list(application_collection.find())  # Convert cursor to list
        for app in applications:
            app["_id"] = str(app["_id"])  # Convert ObjectId to string
        return applications

    @staticmethod
    async def verify_application(username: str):

        update_data = {
            "updated_at": datetime.now(),
            "status": "verified"
        }

        try:
            
            update_data['updated_at'] = datetime.utcnow()

            # Perform the update
            result = await application_collection.update_one(
                {"username": username},
                {"$set": update_data}
            )
            if result.modified_count == 0:
                raise HTTPException(status_code=404, detail="Application not found or no fields to update.")
            
            return {"message": "Application successfully Verified."}
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def update_plan(application_id: str, update_data: dict):
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided for update.")

        update_data = convert_date_fields(update_data)
        try:
            
            update_data['updated_at'] = datetime.utcnow()

            # Perform the update
            result = await plan_collection.update_one(
                {"application_id": application_id},
                {"$set": update_data}
            )
            if result.modified_count == 0:
                raise HTTPException(status_code=404, detail="Plan not found or no fields to update.")
            
            return {"message": "Plan successfully updated."}
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def get_plan_db(application_id: str):
        
        plan = await plan_collection.find_one({"application_id": application_id})
        return plan

    @staticmethod
    async def save_plan_db(plan_data: dict):
        
        plan_data['created_at'] = datetime.utcnow()
        plan_data['updated_at'] = datetime.utcnow()
        result = await plan_collection.insert_one(plan_data)
        print(result)
        return {
                "message": "Plan successfully created.",
                "plan_id": str(result.inserted_id)
            }

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
    
    