from bson import ObjectId
from models.application import PersonalInfo, AcademicInfo, FinancialInfo, LoanDetails, Reference, Application
from models.risk_scores import RiskAssessment, RiskScoreReasoning
from datetime import date
from db import risk_assessment_collection

from utility import run_mistral

class RiskScoreCalCulations:
    @staticmethod
    async def get_riskscore(application_id: str):
        risk_assessment_score = await risk_assessment_collection.find_one({"application_id": ObjectId(application_id)})
        risk_assessment_score["_id"] = str(risk_assessment_score["_id"]);
        return risk_assessment_score

    async def add_to_db(risk_assesment: RiskAssessment):
        result = await risk_assessment_collection.insert_one(risk_assesment.dict())
        return result

    def get_personal_information_score(personal_info: PersonalInfo, risk_assesment: RiskAssessment) -> float :
        score = 0.0
        age = (date.today() - personal_info.dob).days / 365.25
        if age > 18 and age < 35:
            score += 5
        else:
            score += 2.5

        if personal_info.marital_status == "Single":
            score += 5
        elif personal_info.marital_status == "Divorced":
            score += 3.5
        else:
            score += 2

        prompt = f"""

                    considering the personal information for a loan applicant is below:
                    {personal_info.dict()}

                    on the factors of address give me a risk score out of 5.

                    some directions to determine the risk score:
                    1. Same Permanent and Residential Adress means higher score.
                    2. If residential and Permanent addresses are different city lower the score.
                    3. If residential and Permanent addresses are same city give median score.

                    Restriction: the calculations reasoning in response should only be a string and no extra key should be added in JSON response
                    Note: Make sure you add / subtract the scores based twice to remove any ambiguity or calculation errors

                    Example Json Object Response:
                    {{
                        "risk_score": 5.0
                        "calculations" "based on factor 1: (some reason) 5 score was added,  based on factor 2: (some reason) 0 score was added ...."
                    }}
                """

        response = run_mistral(prompt)
        print(response)
        response["risk_score"] += score
        risk_assesment.personal_risk = RiskScoreReasoning(**response)
        return response["risk_score"]


    def get_academic_risk_score(academic_info: AcademicInfo, risk_assesment: RiskAssessment):

        prompt = f"""

                    considering the Academic information for a loan applicant is below:
                    {academic_info.dict()}

                    On the follwoing factors give me a risk score out of 25:
                    1. Recognised university of Pakistan favours the loan applicant means higher risk score (5 - 8 points)
                    2. GPA higher than 2.8 add 10 points to the risk score and if closer to 4 add 12 points
                    3. Field of study should have higher potential in the future so the applicant easily payback loan (7 - 10 points)

                    Restriction: the calculations reasoning in response should only be a string and no extra key should be added in JSON response
                    Note: Make sure you add / subtract the scores based twice to remove any ambiguity or calculation errors

                    Give JSON Object Response as exactly as exmaple Response below:
                    {{
                        "risk_score": 5.0
                        "calculations" "based on factor 1: (some reason) 5 score was added,  based on factor 2: (some reason) 0 score was added ...."
                    }}
                """

        response = run_mistral(prompt)
        print(response)
        risk_assesment.academic_risk = RiskScoreReasoning(**response)
        score = response["risk_score"]
        return score

    def get_financial_risk_score(financial_info: FinancialInfo, loan_details: LoanDetails, risk_assesment: RiskAssessment):
        TFI = financial_info.total_family_income//12
        score = 0
        if TFI < 100000:
            score = 2
        elif TFI > 250000:
            score = 8
        else:
            score = 15
        prompt = f"""

                    considering the Financial information and loan requested for a loan applicant is below:
                    {financial_info.dict()}
                    {loan_details.dict()}


                    On the follwoing factors give me a risk score out of 20:
                    1. Calculate DTI (debt to income Ratio)
                    2. Lower DTI (< 40% is favourable)(add 10-15 points) or Higher DTI means indebtness (add 5-7 points)
                    3. If the applicant Have other loans add 1 point otherwise add 5 points

                    Restriction: the calculations reasoning in response should only be a string and no extra key should be added in JSON response
                    Note: Make sure you add / subtract the scores based twice to remove any ambiguity or calculation errors

                    Give JSON Object Response as exactly as exmaple Response below:
                    {{
                        "risk_score": 5.0
                        "calculations" "based on factor 1: (some reason) 5 score was added,  based on factor 2: (some reason) 0 score was added ...."
                    }}
                """

        response = run_mistral(prompt)
        print(response)
        response["risk_score"] += score
        risk_assesment.financial_risk = RiskScoreReasoning(**response)
        return response["risk_score"]
    def get_reference_risk_score(references: list[Reference], risk_assesment: RiskAssessment):
        score = 0
        prompt = f"""

                    considering the References information  for a loan applicant is below:
                    {references}


                    On the follwoing factors give me a risk score out of 10:
                    1. If the persons talks about the integrity and academic potential give a score near 10
                    2. Else if the persons are unable to establish the integrity and favour the loan applicant give 3
                    3. if no reference found than give 0

                    Restriction: the calculations reasoning in response should only be a string and no extra key should be added in JSON response
                    Note: Make sure you add / subtract the scores based twice to remove any ambiguity or calculation errors
                    Give JSON Object Response as exactly as exmaple Response below:
                    {{
                        "risk_score": 5.0
                        "calculations" "based on factor 1: (some reason) 5 score was added,  based on factor 2: (some reason) 0 score was added ...."
                    }}
                """

        response = run_mistral(prompt)
        print(response)
        risk_assesment.reference_risk = RiskScoreReasoning(**response)
        score += response["risk_score"]
        return score


    def repayment_potential_score(application: Application, risk_assesment: RiskAssessment):
        score = 0
        prompt = f"""

                    considering the Complete Loan Application for a loan applicant is below:
                    {application}


                    On the follwoing factors give me a risk score out of 15:
                    1. overall financial conditions
                    2. Academic information (applicant performance and future poetential)
                    3. Predict future salary for the applicant and its affect on repayment.

                    Restriction: the calculations reasoning in response should only be a string and no extra key should be added in JSON response
                    Note: Make sure you add / subtract the scores based twice to remove any ambiguity or calculation errors
                    Give JSON Object Response as exactly as exmaple Response below:
                    {{
                        "risk_score": 5.0
                        "calculations" "based on factor 1: (some reason) 5 score was added,  based on factor 2: (some reason) 0 score was added ...."
                    }}
                """

        response = run_mistral(prompt)
        print(response)
        risk_assesment.repayment_potential = RiskScoreReasoning(**response)
        score += response["risk_score"]
        return score
