
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks

from services.application_services import ApplicationService
from services.risk_score_services import RiskScoreCalCulations
from services.loan_services import LoanService

from middleware.JWT_authentication import TokenData, get_current_user

from models.application import Application
from models.plan import Plan

application_router = APIRouter()

@application_router.post('/accept-plan/')
async def accept_plan(application_id: str, current_user: TokenData = Depends(get_current_user)):
    return await ApplicationService.accept_application(current_user.username, application_id)

@application_router.put('/update-stage/{stage}')
async def accept_plan(stage: str, current_user: TokenData = Depends(get_current_user)):
    return await ApplicationService.update_stage(current_user.username, stage)

@application_router.get('/repay/')
async def repay_loan(current_user: TokenData = Depends(get_current_user)):
    return await LoanService.repay_loan(current_user.username)

@application_router.get('/get-loan-details/')
async def get_loan_details(current_user: TokenData = Depends(get_current_user)):
    return await LoanService.get_loan_details(current_user.username)

@application_router.get('/get-plan')
async def get_plan(application_id: str, current_user: TokenData = Depends(get_current_user)):
    return await ApplicationService.get_plan_db(application_id)

@application_router.get('/risk-assessment/')
async def get_risk_assessment(application_id: str, current_user: TokenData = Depends(get_current_user)):
    application_dict = await ApplicationService.get_application(current_user.username)
    application_dict["_id"] = str(application_dict["_id"])
    return await RiskScoreCalCulations.generate_risk_scores(application_dict, current_user)

@application_router.get('/get-by-id/')
async def get_application_by_id(application_id: str, current_user: TokenData = Depends(get_current_user)):

    application =  await ApplicationService.get_application_by_id(application_id)
    application["_id"] = str(application["_id"])
    return application

@application_router.put('/submit/')
async def update_application(updated_data:Application, background_tasks: BackgroundTasks, current_user: TokenData = Depends(get_current_user)):
    result = await ApplicationService.update_application(current_user.username, updated_data.dict())
    if result:
        background_tasks.add_task(RiskScoreCalCulations.generate_risk_scores, updated_data.dict(), current_user)
    
    return {'message': 'Application Added Successfully, Risk Assessment and personalised Plan Under Construction', 'success': True}

@application_router.get('/auto-fill-fields/')
async def auto_fill_fields(background_tasks: BackgroundTasks, current_user: TokenData = Depends(get_current_user)):
    # background_tasks.add_task(ApplicationService.auto_fill_fields, current_user)
    return await ApplicationService.auto_fill_fields(current_user)
    return {'message': 'Documents Under Analysis, Fields will updated soon poll the application'}


@application_router.get('/application-overview/')
async def application_overview(current_user: TokenData = Depends(get_current_user)):
    result = await ApplicationService.application_overview(current_user.username)
    if result is None:
        raise HTTPException(status_code=404, detail="No Application Found")
    return result

@application_router.get('/repay-details/')
async def repay_details(current_user: TokenData = Depends(get_current_user)):
    result = await LoanService.fetch_repay_details(current_user.username)
    if result is None:
        raise HTTPException(status_code=404, detail="No Loan Found")
    return result
# *************Strong case*****************
# {
#   "personal_info": {
#     "full_name": "Riyan Ahmed",
#     "dob": "1999-04-10",
#     "gender": "Male",
#     "nationality": "Pakistani",
#     "marital_status": "Single",
#     "phone_number": "+92-301-2345678",
#     "email_address": "riyan.ahmed@example.pk",
#     "residential_address": "123 Gulshan-e-Iqbal, Karachi, Sindh, Pakistan",
#     "permanent_address": "456 Model Town, Lahore, Punjab, Pakistan"
#   },
#   "financial_info": {
#     "total_family_income": 1800000,
#     "other_income_sources": ["Freelance Web Development: 200,000 PKR per year", "Part-time Teaching: 100,000 PKR per year"],
#     "outstanding_loans_or_debts": ["Home Renovation Loan: 500,000 PKR"]
#   },
#   "academic_info": {
#     "current_education_level": "Undergraduate",
#     "college_or_university": "National University of Sciences and Technology (NUST)",
#     "student_id": "NUST20234567",
#     "program_name_degree": "Bachelor's in Electrical Engineering",
#     "duration_of_course": "4 years",
#     "year_or_semester": "Year 3, Semester 1",
#     "gpa": 3.85,
#     "achievements_or_awards": ["Merit Scholarship - HEC", "Winner - IEEE Robotics Competition 2023"]
#   },
#   "loan_details": {
#     "loan_amount_requested": 1500000,
#     "purpose_of_loan": "Tuition Fees and Research Equipment",
#     "proposed_repayment_period": "36 months",
#     "preferred_repayment_frequency": "Quarterly"
#   },
#   "references": [
#     {
#       "name": "Dr. Ayesha Khan",
#       "designation": "Professor of Electrical Engineering",
#       "contact_details": "+92-21-5678910",
#       "comments": "Riyan is a brilliant and hardworking student with a passion for innovation. I strongly recommend his loan application."
#     },
#     {
#       "name": "Ali Zafar",
#       "designation": "Software Engineer, Systems Ltd",
#       "contact_details": "+92-42-3456789",
#       "comments": "Riyan has shown exceptional problem-solving skills during his internship. He is committed and responsible."
#     }
#   ],
#   "status": "Pending",
#   "application_date": "2024-11-30",
#   "declaration": "I hereby declare that all the information provided is true.",
#   "signature": "Riyan Ahmed",
#   "username": "r.dev1"
# }

