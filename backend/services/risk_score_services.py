import time
import asyncio
import json

from bson import ObjectId
from fastapi import HTTPException
from models.application import PersonalInfo, AcademicInfo, FinancialInfo, LoanDetails, Reference, Application
from models.risk_scores import RiskAssessment, RiskScoreReasoning
from datetime import date
from db import risk_assessment_collection
from services.application_services import ApplicationService

from services.gemini_services import GeminiServices
from utility import run_mistral
class RiskScoreCalCulations:

    @staticmethod
    async def generate_risk_scores(application_dict, current_user):
        risk_scores = RiskAssessment(
        application_id="12345",
        financial_risk={"risk_score": 0, "calculations": "N/A"},
        academic_risk={"risk_score": 0, "calculations": "N/A"},
        personal_risk={"risk_score": 0, "calculations": "N/A"},
        reference_risk={"risk_score": 0, "calculations": "N/A"},
        repayment_potential={"risk_score": 0, "calculations": "N/A"}
    )
        application = Application(**application_dict)
        risk_scores.application_id = str(application_dict["id"])
        score = 0
        score += await RiskScoreCalCulations.get_personal_information_score(application.personal_info, risk_scores)
        await asyncio.sleep(2)
        score += await RiskScoreCalCulations.get_academic_risk_score(application.academic_info, risk_scores)
        await asyncio.sleep(2)
        score += await RiskScoreCalCulations.get_financial_risk_score(application.financial_info, application.loan_details, risk_scores)
        await asyncio.sleep(2)
        score += await RiskScoreCalCulations.get_reference_risk_score(application.references, risk_scores)
        await asyncio.sleep(2)
        score += await RiskScoreCalCulations.repayment_potential_score(application.references, risk_scores)
        
        exisiting_risk_score = await RiskScoreCalCulations.get_risk_assessment_score(risk_scores.application_id)

        if exisiting_risk_score:
            await RiskScoreCalCulations.update_riskScores(risk_scores)
        else:
            await RiskScoreCalCulations.add_to_db(risk_scores)

        if score > 70: 
            await ApplicationService.generate_personalised_plan(application_dict, current_user.username)
        return score

    @staticmethod
    async def get_risk_assessment_score(application_id: str):
        risk_assessment_score = await risk_assessment_collection.find_one({"application_id": application_id})
        if risk_assessment_score:
            risk_assessment_score["_id"] = str(risk_assessment_score["_id"])
        
        return risk_assessment_score
    
    @staticmethod
    async def update_riskScores(risk_scores: RiskAssessment):

        if not risk_scores:
            raise HTTPException(status_code=400, detail="No data provided for update.")
        
        try:

            result = await risk_assessment_collection.update_one(
                {"application_id": risk_scores.application_id},
                {"$set": risk_scores.dict()}
            )
        
            if result.modified_count == 0:
                raise HTTPException(status_code=404, detail="Risk Assessment not found or no fields to update.")
            print(result)
            return {"message": "Risk Assessment successfully updated."}
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def add_to_db(risk_assesment: RiskAssessment):
        result = await risk_assessment_collection.insert_one(risk_assesment.dict())
        return result

    async def get_personal_information_score(personal_info: PersonalInfo, risk_assesment: RiskAssessment) -> float :
        score = 0.0
        age_score = 0.0
        marital_status = 0.0

        age = (date.today() - personal_info.dob).days / 365.25
        if age > 18 and age < 35:
            age_score = 5
        else:
            age_score = 2.5

        if personal_info.marital_status == "Single":
            marital_status = 5
        elif personal_info.marital_status == "Divorced":
            marital_status = 3.5
        else:
            marital_status = 2

        prompt = f"""

                    considering the personal information for a loan applicant is below:
                    {personal_info.dict()}
                    Score based on age: {age_score}/5
                    Score based on marital status: {marital_status}/5

                    on the factors of address give me a risk score out of 5.

                    some directions to determine the risk score:
                    1. Same Permanent and Residential Adress means higher score.
                    2. If residential and Permanent addresses are different city lower the score.
                    3. If residential and Permanent addresses are same city give median score.

                    Restriction: the calculations reasoning in response should only be a string and no extra key should be added in JSON response
                    Note: 
                    1. Make sure you add / subtract the scores based twice to remove any ambiguity or calculation errors (use python interpreter for the addition on calculations as it should be consistent with the reasoning
                    2. In calculations also add the reasoning for the score I have manually assignment. 
                    
                    Total Score = (age score + marital Score + score you calculate the factors mentioned above) out of 15
                    
                    Example Json Object Response:
                    {{
                        "risk_score": 5.0
                        "calculations" "based on factor 1: (some reason) 5 score was added,  based on factor 2: (some reason) 0 score was added ...."
                    }}
                """

        response = await GeminiServices.gemini_chat(prompt)
        parsed_response = json.loads(response.text)
        print(parsed_response)
        risk_assesment.personal_risk = RiskScoreReasoning(**parsed_response)
        return parsed_response["risk_score"]


    async def get_academic_risk_score(academic_info: AcademicInfo, risk_assesment: RiskAssessment):

        prompt = f"""

                    considering the Academic information for a loan applicant is below:
                    {academic_info.dict()}

                    On the follwoing factors give me a risk score out of 25:
                    1. Recognised university of Pakistan favours the loan applicant means higher risk score (5 - 8 points)
                    2. GPA higher than 2.8 add 10 points to the risk score and if closer to 4 add 12 points
                    3. Field of study should have higher potential in the future so the applicant easily payback loan (7 - 10 points)

                    Restriction: the calculations reasoning in response should only be a string and no extra key should be added in JSON response
                    Note: 
                    1. Make sure you add / subtract the scores based twice to remove any ambiguity or calculation errors (use python interpreter for the addition on calculations as it should be consistent with the reasoning

                    Give JSON Object Response as exactly as exmaple Response below:
                    {{
                        "risk_score": 5.0
                        "calculations" "based on factor 1: (some reason) 5 score was added,  based on factor 2: (some reason) 0 score was added ...."
                    }}
                """

        response = await GeminiServices.gemini_chat(prompt)
        parsed_response = json.loads(response.text)
        print(parsed_response)
        risk_assesment.academic_risk = RiskScoreReasoning(**parsed_response)
        return parsed_response["risk_score"]

    async def get_financial_risk_score(financial_info: FinancialInfo, loan_details: LoanDetails, risk_assesment: RiskAssessment):
        TFI = financial_info.total_family_income//12
        score = 0
        TFI_score = 0
        if TFI < 100000:
            TFI_score = 2
        elif TFI > 250000:
            TFI_score = 8
        else:
            TFI_score = 15

        prompt = f"""

                    considering the Financial information and loan requested for a loan applicant is below:
                    {financial_info.dict()}
                    {loan_details.dict()}

                    Score based on Total Family Income per Month: {TFI_score}

                    On the follwoing factors give me a risk score out of 20:
                    1. Calculate DTI (debt to income Ratio)
                    2. Lower DTI (< 40% is favourable)(add 10-15 points) or Higher DTI means indebtness (add 5-7 points)
                    3. If the applicant Have other loans add 1 point otherwise add 5 points

                    Restriction: the calculations reasoning in response should only be a string and no extra key should be added in JSON response
                    Note: 
                    1. Make sure you add / subtract the scores based twice to remove any ambiguity or calculation errors (use python interpreter for the addition on calculations as it should be consistent with the reasoning
                    2. In calculations also add the reasoning for the score I have manually assignment. 
                    
                    Total Score = (Total Family Score + score you calculate the factors mentioned above) out of 35

                    Give JSON Object Response as exactly as exmaple Response below:
                    {{
                        "risk_score": 5.0
                        "calculations" "based on factor 1: (some reason) 5 score was added,  based on factor 2: (some reason) 0 score was added ...."
                    }}
                """

        response = await GeminiServices.gemini_chat(prompt)
        parsed_response = json.loads(response.text)
        print(parsed_response)
        risk_assesment.financial_risk = RiskScoreReasoning(**parsed_response)
        return parsed_response["risk_score"]
    async def get_reference_risk_score(references: list[Reference], risk_assesment: RiskAssessment):
        score = 0
        prompt = f"""

                    considering the References information  for a loan applicant is below:
                    {references}


                    On the follwoing factors give me a risk score out of 10:
                    1. If the persons talks about the integrity and academic potential give a score near 10
                    2. Else if the persons are unable to establish the integrity and favour the loan applicant give 3
                    3. if no reference found than give 0

                    Restriction: the calculations reasoning in response should only be a string and no extra key should be added in JSON response
                    Note: Make sure you add / subtract the scores based twice to remove any ambiguity or calculation errors (use python interpreter for the addition on calculations as it should be consistent with the reasoning
                    Give JSON Object Response as exactly as exmaple Response below:
                    {{
                        "risk_score": 5.0
                        "calculations" "based on factor 1: (some reason) 5 score was added,  based on factor 2: (some reason) 0 score was added ...."
                    }}
                """

        response = await GeminiServices.gemini_chat(prompt)
        parsed_response = json.loads(response.text)
        print(parsed_response)
        risk_assesment.reference_risk = RiskScoreReasoning(**parsed_response)
        return parsed_response["risk_score"]


    async def repayment_potential_score(application: Application, risk_assesment: RiskAssessment):
        score = 0
        prompt = f"""

                    considering the Complete Loan Application for a loan applicant is below:
                    {application}


                    On the follwoing factors give me a risk score out of 15:
                    1. overall financial conditions
                    2. Academic information (applicant performance and future poetential)
                    3. Predict future salary for the applicant and its affect on repayment.

                    Restriction: the calculations reasoning in response should only be a string and no extra key should be added in JSON response
                    Note: Make sure you add / subtract the scores based twice to remove any ambiguity or calculation errors (use python interpreter for the addition on calculations as it should be consistent with the reasoning)
                    Give JSON Object Response as exactly as exmaple Response below:
                    {{
                        "risk_score": 5.0
                        "calculations" "based on factor 1: (some reason) 5 score was added,  based on factor 2: (some reason) 0 score was added ...."
                    }}
                """

        response = await GeminiServices.gemini_chat(prompt)
        parsed_response = json.loads(response.text)
        print(parsed_response)
        risk_assesment.repayment_potential = RiskScoreReasoning(**parsed_response)
        return parsed_response["risk_score"]
    
    async def calculate_total_score(risk_assessment):
        total_score = 0
        total_score += risk_assessment["financial_risk"]["risk_score"]
        total_score += risk_assessment["academic_risk"]["risk_score"]
        total_score += risk_assessment["personal_risk"]["risk_score"]
        total_score += risk_assessment["repayment_potential"]["risk_score"]
        total_score += risk_assessment["reference_risk"]["risk_score"]

        return total_score
