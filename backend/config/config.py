import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

class Config:
    # Read from the environment, default to the provided values if the variables are not set
    mistral_api_key = os.getenv("MISTRAL_API_KEY", "")
    gemini_api_key = os.getenv("GEMINI_API_KEY", "")
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    encryption_key = os.getenv("ENCRYPTION_KEY", "my_secret_key")
    factory_address = os.getenv("FACTORY_ADDRESS", "")
    rpc_url = os.getenv("RPC_URL", "http://localhost:8545")
    faucet_private_key = os.getenv("FAUCET_PRIVATE_KEY", "")
    donation_contract_address = os.getenv("DONATION_CONTRACT_ADDRESS", "")
    chroma_db_base_path = os.getenv("CHROMA_DB_BASE_PATH", "./chromaDB/")

    smtp_from_email = os.getenv("SMTP_FROM_EMAIL", "")
    smtp_host = os.getenv("SMTP_HOST", "")
    smtp_port = int(os.getenv("SMTP_PORT", ""))
    smtp_username = os.getenv("SMTP_USERNAME", "")
    smtp_password =os.getenv("SMTP_PASSWORD", "")
    
# You can now import this Config class to use the values in your FastAPI application
