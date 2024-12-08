import json
import time

from fastapi import APIRouter, Depends, HTTPException

from services.langchain_services import LangChainService
from services.application_services import ApplicationService
from services.risk_score_services import RiskScoreCalCulations
from middleware.JWT_authentication import TokenData, get_current_user

from utility import post_processing_response, validate_application_object
from models.application import Application
from models.risk_scores import RiskAssessment
from models.plan import Plan

application_router = APIRouter()

@application_router.post('/accpet-plan/')
async def accept_plan():
    pass

@application_router.put('/update-plan/')
async def update_plan(updated_data:Plan, application_id:str, current_user: TokenData = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=401, detail="Only admin access allowed")
    return await ApplicationService.update_plan(application_id, updated_data.dict())

@application_router.put('/verify/')
async def verify_application(current_user: TokenData = Depends(get_current_user)):

    if current_user.role != "admin":
        raise HTTPException(status_code=401, detail="Only admin access allowed")

    return await ApplicationService.verify_application(current_user.username)


@application_router.get('/personalised-plan/')
async def get_personalised_plan(current_user: TokenData = Depends(get_current_user)):


    application_dict = await ApplicationService.get_application(current_user.username)
    existing_plan = await ApplicationService.get_plan_db(str(application_dict["_id"]))

    if existing_plan:
        existing_plan["_id"] = str(existing_plan["_id"])
        return existing_plan

    application = Application(**application_dict)

# Proposed Repayment Period by user: {application.loan_details.proposed_repayment_period}
                # preferred repayment frequency by user: {application.loan_details.preferred_repayment_frequency}
    temp_dir = await LangChainService.create_vector_Store(current_user.username, False)
    query = f"""
                Given the following information by the loan applicant:
                Loan Amount Request: {application.loan_details.loan_amount_requested}
                Academic Details: {application.academic_info}

                along with the data retrieved from the documents based on the transactions details (closing balance and salary estimate), savings each month, salary slips, loan amount request, expected graduation date and keeping in mind the preference of the user provide personalised repayment plan as a JSON Object

                Calculations: determine the number of installments over repayment period and make sure total_loan_amount = installment_amount * number of installments

                Note: You do not have to strictly follow the user's porposed plan and preferrred repayment instead based on financial analysis of user situation give a better suited plan which is managebale by the user.
                Restrictions:
                1. Loan Amount must be in PKR
                2. Do not add Comments in the JSON Object response

                Example JSON OBject
                {{
                    "total_loan_amount": 2000000, (double)
                    "Start_date": "month-year", # month and Year as date
                    "end_date": "month-year", # month and Year as date
                    "repayment_frequency": "", (only options are monthly, quarterly, bi-yearly, or annually)
                    "installment_amount": 500000, (double) also make sure twice by calculating this value is correct or not
                    "reasoning": "reasoning for calculations"
                }}
            """
    response = LangChainService.rag_bot(query, temp_dir)
    processed_response = post_processing_response(response["response"])
    print(processed_response)
    try:

        # converting the LLM response into json object
        json_object = json.loads(processed_response)
        json_object["application_id"] = str(application_dict["_id"])
        result = await ApplicationService.save_plan_db(json_object)
        json_object["_id"] = str(json_object["_id"])
        return json_object
    except json.JSONDecodeError as e:
        # Handle JSON decoding error if any
        print(e)
        raise HTTPException(status_code=500, detail=f"Unable to fetch response, Try Again")


@application_router.get('/risk-score/')
async def get_risk_score(current_user: TokenData = Depends(get_current_user)):
    risk_scores = RiskAssessment(
        application_id="12345",
        financial_risk={"risk_score": 0, "calculations": "N/A"},
        academic_risk={"risk_score": 0, "calculations": "N/A"},
        personal_risk={"risk_score": 0, "calculations": "N/A"},
        reference_risk={"risk_score": 0, "calculations": "N/A"},
        repayment_potential={"risk_score": 0, "calculations": "N/A"}
    )
    application_dict = await ApplicationService.get_application(current_user.username)
    application = Application(**application_dict)
    risk_scores.application_id = str(application_dict["_id"])
    score = 0
    score += RiskScoreCalCulations.get_personal_information_score(application.personal_info, risk_scores)
    time.sleep(2)
    score += RiskScoreCalCulations.get_academic_risk_score(application.academic_info, risk_scores)
    time.sleep(2)
    score += RiskScoreCalCulations.get_financial_risk_score(application.financial_info, application.loan_details, risk_scores)
    time.sleep(2)
    score += RiskScoreCalCulations.get_reference_risk_score(application.references, risk_scores)
    time.sleep(2)
    score += RiskScoreCalCulations.repayment_potential_score(application.references, risk_scores)
    await RiskScoreCalCulations.add_to_db(risk_scores)
    return score

@application_router.get('/risk-assessment/')
async def get_risk_assessment(application_id: str, current_user: TokenData = Depends(get_current_user)):
    return await RiskScoreCalCulations.get_riskscore(application_id);

@application_router.put('/update/')
async def update_application(updated_data:Application, current_user: TokenData = Depends(get_current_user)):
    return await ApplicationService.update_application(current_user.username, updated_data.dict())

@application_router.get('/auto-fill-fields/', response_model=Application)
async def auto_fill_fields(current_user: TokenData = Depends(get_current_user)):

    application = await ApplicationService.get_application(current_user.username)

    if application:
        application["_id"] = str(application["_id"])
        print(application)
        return application

    query = f"""
        Given the information of the documents in the context above give the response in the following JSON format


        username: {current_user.username} (always return this username in the field called username in response)

        Restrictions:
        1. The key Values of Json Response must be exactly as Example JSON object (no extra or less fields in json response)
        2. Do not return "Not Found" in JSON Object (Most Important)
        3. Return an empty string "" for a string fields only if not found.  (Most Important)
            example LLM could not locate nationality:
            the response of the specific field in JSON Object should be ("nationality": "")
        4. Do not add comment in JSON Object.


        Example JSON Object Response:
        {{
        "username": "john_doe_123",
        "personal_info": {{
            "full_name": "John Doe",
            "dob": "2000-05-15" (return todays date if not found),
            "gender": "Male",
            "nationality": "American",
            "marital_status": "Single",
            "phone_number": "+123456789",
            "email_address": "john.doe@example.com",
            "residential_address": "123 Main St, City, Country",
            "permanent_address": "456 Another St, City, Country"
        }},
        "financial_info": {{
            "total_family_income": 50000 (return an integer),
            "other_income_sources": ["Part-time job: 10000", "Freelance: 5000"],
            "outstanding_loans_or_debts": ["Car loan: 10000", "Credit Card: 5000"]
        }},
        "academic_info": {{
            "current_education_level": "Undergraduate",
            "college_or_university": "XYZ University",
            "student_id": "U1234567",
            "program_name_degree": "Computer Science",
            "duration_of_course": "4 years",
            "year_or_semester": "Year 2, Semester 1",
            "gpa": 3.8 (return a float),
            "achievements_or_awards": ["Dean's List", "Hackathon Winner"]
        }},
        "loan_details": {{
            "loan_amount_requested": 20000 (return an integer),
            "purpose_of_loan": "Tuition fees",
            "proposed_repayment_period": "24 months",
            "preferred_repayment_frequency": "Monthly"
        }},
        "references": [
            {{
                "name": "Jane Smith",
                "designation": "Professor",
                "contact_details": "+987654321",
                "comments": "John is a diligent student."
            }}
        ],
        "status": "Pending",
        "application_date": "2024-11-30" (return todays date),
        "declaration": "I hereby declare that all the information provided is true.",
        "signature": "John Doe"
    }}

    """

    temp_dir = await LangChainService.create_vector_Store(current_user.username, False)
    response = LangChainService.rag_bot(query, temp_dir)
    processed_response = post_processing_response(response["response"])
    print(processed_response)
    try:

        # converting the LLM response into json object
        json_object = json.loads(processed_response)
        if json_object["personal_info"]["dob"] == "" or json_object["personal_info"]["dob"] == "Not Found":
            json_object["personal_info"]["dob"] = "2002-12-30"
        if json_object["application_date"] == "" or json_object["application_date"] == "Not Found":
            json_object["application_date"] = "2002-12-30"
        await validate_application_object(json_object)
        results = await ApplicationService.create_application(json_object)
        json_object["_id"] = str(results["application_id"])

        return json_object
    except json.JSONDecodeError as e:
        # Handle JSON decoding error if any
        print(e)
        raise HTTPException(status_code=500, detail=f"Unable to fetch response, Try Again")



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
