import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")


client = AsyncIOMotorClient(MONGO_URI)
db = client["ScholarChain"]

user_collection = db["users"]
application_collection = db["application"]
risk_assessment_collection = db["risk_assessment"]
plan_collection = db["plan"]
