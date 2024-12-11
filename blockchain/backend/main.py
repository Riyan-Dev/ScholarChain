# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/get-loan-details")
def get_loan_details():
    return {
        "student": "0x463e6791C5de7daB301930A7f36eCd769FBD09C0", # Ganache Acc[1]
        "loanAmount": 1000,
        "totalPayments": 10,
        "paymentSize": 100
    }
