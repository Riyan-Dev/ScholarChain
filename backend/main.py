from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

import os
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from controller.rag_controller import router as rag_router
from controller.user_controller import user_router
from controller.application_controller import application_router
from controller.admin_controller import admin_router
from controller.donator_controller import donator_router
from controller.blockchain_controller import blockchain_router

from config.init_EM import get_embedding_model
from config.init_gemini import get_gemini_client

# get_embedding_model()
# get_gemini_client()
app = FastAPI()

app.include_router(rag_router, prefix="/rag", tags=["rag"])
app.include_router(user_router, prefix="/user", tags=["user"])
app.include_router(application_router, prefix="/application", tags=["application"])
app.include_router(admin_router, prefix="/admin", tags=["admin"])
app.include_router(donator_router, prefix="/donator", tags=["donator"])
app.include_router(blockchain_router, prefix="/blockchain", tags=["Blockchain"])

os.makedirs("static", exist_ok=True)
app.mount("/pdfs", StaticFiles(directory="static"), name="pdfs")

origins = [
    "http://localhost:3000",
    "http://localhost:3001",  # Add other origins as needed
]

# Add CORSMiddleware to the application instance
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows the origins defined in the list
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# @app.get("/{path_name:path}")
# async def catch_all(path_name: str):
#     print("Handling route:", path_name)  # For debugging
#     return {"meow": "meow meow"}

# Health route to check the deployment status
@app.get("/V-1.1.1/health", status_code=200)
async def health_check():
    return {"status": "ok", "version": "1.0.4"}




# To run locally
if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
