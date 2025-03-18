import os
from config.config import Config
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()




client = AsyncIOMotorClient(Config.mongo_uri)
db = client["ScholarChain"]

user_collection = db["users"]
application_collection = db["application"]
risk_assessment_collection = db["risk_assessment"]
plan_collection = db["plan"]
wallet_collection = db["wallet"]
loan_collection = db["loan"]
