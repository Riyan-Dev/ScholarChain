from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

import uvicorn 
from fastapi.middleware.cors import CORSMiddleware
from controller.rag_controller import router as rag_router
from controller.user_controller import user_router

app = FastAPI()

app.include_router(rag_router, prefix="/rag", tags=["rag"])
app.include_router(user_router, prefix="/user", tags=["user"])

origins = [
    "http://localhost:5173",  # Add other origins as needed
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



# app.mount("/static", StaticFiles(directory="static"), name="static")
# templates = Jinja2Templates(directory="templates")


# @app.get("/", response_class=HTMLResponse)
# async def index(request: Request):
#     return templates.TemplateResponse("index.html", {"request": request})

# @app.get("/personal-info", response_class=HTMLResponse)
# async def personal_info(request: Request):
#     return templates.TemplateResponse("personal_info.html", {"request": request})

# @app.get("/financial-info", response_class=HTMLResponse)
# async def financial_info(request: Request):
#     return templates.TemplateResponse("financial_info.html", {"request": request})

# @app.get("/academic-info", response_class=HTMLResponse)
# async def academic_info(request: Request):
#     return templates.TemplateResponse("academic_info.html", {"request": request})

# @app.get("/document-upload", response_class=HTMLResponse)
# async def document_upload(request: Request):
#     return templates.TemplateResponse("document_upload.html", {"request": request})
