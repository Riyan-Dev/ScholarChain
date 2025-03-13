import json

from fastapi import HTTPException # type: ignore
from datetime import datetime
from bson import ObjectId
from db import application_collection, plan_collection, risk_assessment_collection, user_collection
from utility import convert_date_fields

from models.application import Application
from services.documents import app
from services.langchain_services import LangChainService
from services.blockchain_service import BlockchainService
from services.loan_services import LoanService
from services.transaction_services import TransactionServices

from utility import post_processing_response, validate_application_object

from models.plan import Plan

class ApplicationService:

    @staticmethod
    async def get_all_applications():
        applications = await application_collection.find().to_list(None)
        filtered_data = []
        for app in applications:
            try:
                app_id_str = str(app["_id"])  # Convert ObjectId to string *here*
                full_name = app["personal_info"]["full_name"]
                email = app["personal_info"]["email_address"]
                amount_requested = app["loan_details"]["loan_amount_requested"]
                status = app["status"]
                application_date = app["application_date"]

                # Fetch risk assessment
                risk_assessment = await risk_assessment_collection.find_one({"application_id": app_id_str})

                if risk_assessment:
                    # Calculate total risk score
                    total_risk_score = (
                        risk_assessment["financial_risk"]["risk_score"] +
                        risk_assessment["academic_risk"]["risk_score"] +
                        risk_assessment["personal_risk"]["risk_score"] +
                        risk_assessment["reference_risk"]["risk_score"] +
                        risk_assessment["repayment_potential"]["risk_score"]
                    )
                else:
                    total_risk_score = None  # Or some default value, like -1, if no assessment exists


                filtered_data.append({
                    "id": app_id_str,
                    "applicant": full_name,
                    "email": email,
                    "amount": amount_requested,
                    "status": status,
                    "submittedDate": application_date,
                    "riskScore": total_risk_score,  # Add the risk score
                })

            except KeyError as e:
                print(f"KeyError: {e} in application with _id: {app.get('_id', 'Unknown')}")
                continue
            except Exception as e: # catch other exceptions
                print(f"An unexpected error occurred: {e} in application with _id: {app.get('_id', 'Unknown')}")
                continue

        return filtered_data

    @staticmethod
    async def accept_application(username: str, application_id: str):
        update_data = {
            "updated_at": datetime.now(),
            "status": "accepted"
        }
        results = await ApplicationService.update_application(username, update_data)
        # print(results)
        plan_data = await ApplicationService.get_plan_db(application_id)    

        await TransactionServices.transfer_token(plan_data["total_loan_amount"], "scholarchain", username, "Loan Payment")

        deploy_result = await BlockchainService.deploy_loan_contract(username, plan_data["total_loan_amount"])
        print(deploy_result)
        await LoanService.create_loan(plan_data["total_loan_amount"], plan_data["start_date"], plan_data["end_date"], plan_data["repayment_frequency"], username, deploy_result["contract_address"])
        return {"transaction_id": deploy_result["transaction_hash"]}

    @staticmethod
    async def update_stage(username: str, stage: str):
        update_data = {
            "updated_at": datetime.now(),
            "application_stage": stage
        }

        await user_collection.update_one(
            {"username": username},
            {"$set": update_data}
            )

        return {"Message": "Application Stage Updated"}

    @staticmethod
    async def verify_application(application_id: str, verified: bool):
        if verified:
            update_data = {
                "updated_at": datetime.now(),
                "status": "verified"
            }
        else:
            update_data = {
                "updated_at": datetime.now(),
                "status": "rejected"
            }

        try:
            # Perform the update
            result = await application_collection.update_one(
                {"_id": ObjectId(application_id)},
                {"$set": update_data}
            )
            if result.modified_count == 0:
                raise HTTPException(status_code=404, detail="Application not found or no fields to update.")
            
            return {"message": "Application successfully Verified."}
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def update_plan(application_id: str, update_data: dict):
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided for update.")

        update_data["start_date"] = update_data["start_date"].strftime("%b-%Y")
        update_data["end_date"] = update_data["end_date"].strftime("%b-%Y")
        print(update_data)
        try:
            
            update_data['updated_at'] = datetime.utcnow()

            # Perform the update
            result = await plan_collection.update_one(
                {"application_id": application_id},
                {"$set": update_data}
            )
            if result.modified_count == 0:
                raise HTTPException(status_code=404, detail="Plan not found or no fields to update.")
            
            return {"message": "Plan successfully updated."}
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def get_plan_db(application_id: str):
        
        plan = await plan_collection.find_one({"application_id": application_id})
        if plan:
            plan["_id"] = str(plan["_id"])
        return plan

    @staticmethod
    async def save_plan_db(plan_data: dict):
        
        plan_data['created_at'] = datetime.utcnow()
        plan_data['updated_at'] = datetime.utcnow()
        result = await plan_collection.insert_one(plan_data)
        print(result)
        return {
                "message": "Plan successfully created.",
                "plan_id": str(result.inserted_id)
            }

    @staticmethod
    async def create_application(application_data: dict):
        try:
            application_data['created_at'] = datetime.utcnow()
            application_data['updated_at'] = datetime.utcnow()
            result = await application_collection.insert_one(application_data)
            print(result)
            return {
                "message": "Application successfully created.",
                "application_id": str(result.inserted_id)
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @staticmethod
    async def update_application(username: str, update_data: dict):
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided for update.")

        update_data = convert_date_fields(update_data)
        try:
            
            update_data['updated_at'] = datetime.utcnow()

            # Perform the update
            result = await application_collection.update_one(
                {"username": username},
                {"$set": update_data}
            )
            if result.modified_count == 0:
                raise HTTPException(status_code=404, detail="Application not found or no fields to update.")
            
            return {"message": "Application successfully updated."}
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @staticmethod
    async def get_application(username: str):
        application = await application_collection.find_one({"username": username})
        return application
    
    @staticmethod
    async def get_application_by_id(application_id: str):
        application = await application_collection.find_one({"_id": ObjectId(application_id)})
        print(application)
        return application
    

    @staticmethod
    async def generate_personalised_plan(application_dict, current_user):
        existing_plan = await ApplicationService.get_plan_db(str(application_dict["id"]))

        if existing_plan:
            existing_plan["_id"] = str(existing_plan["_id"])
            return existing_plan

        application = Application(**application_dict)

    # Proposed Repayment Period by user: {application.loan_details.proposed_repayment_period}
                    # preferred repayment frequency by user: {application.loan_details.preferred_repayment_frequency}
        temp_dir = await LangChainService.create_vector_Store(current_user, False)
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
                        "start_date": "month-year", # month and Year as date
                        "end_date": "month-year", # month and Year as date
                        "repayment_frequency": "", (only options are monthly, quarterly, bi-yearly, or annually)
                        "installment_amount": 500000, (double) also make sure twice by calculating this value is correct or not
                        "reasoning": "reasoning for calculations"
                    }}
                """
        response = await LangChainService.rag_bot(query, temp_dir)
        processed_response = await post_processing_response(response["response"])
        print(processed_response)
        try:

            # converting the LLM response into json object
            json_object = json.loads(processed_response)
            json_object["application_id"] = str(application_dict["id"])
            result = await ApplicationService.save_plan_db(json_object)
            json_object["_id"] = str(json_object["_id"])
            return json_object
        except json.JSONDecodeError as e:
            # Handle JSON decoding error if any
            print(e)
            raise HTTPException(status_code=500, detail=f"Unable to fetch response, Try Again")
        
    async def application_overview(username):
        pipeline = [
            { "$match": { "username": username } },
            { "$project": {
                "_id": 1,
                "name": "$personal_info.full_name",
                "phoneNo": "$personal_info.phone_number",
                "email": "$personal_info.email_address",
                "status": 1,
                "created_at": 1
            }}
        ]

        result = await application_collection.aggregate(pipeline).to_list(length=1)

        if (result):
            result[0]["_id"] = str(result[0]["_id"])
            return result[0]
        else:
            return None
        
    async def auto_fill_fields(current_user):

        application = await ApplicationService.get_application(current_user.username)

        if application:
            application["_id"] = str(application["_id"])
            return application

        application = app
        application["username"] = current_user.username
        results = await ApplicationService.create_application(application)
        application["_id"] = str(results["application_id"])

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
                    "name": "source for this information is reference letter as mention in some metadata for documents",
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
        response = await LangChainService.rag_bot(query, temp_dir)
        processed_response = await post_processing_response(response["response"])
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
    