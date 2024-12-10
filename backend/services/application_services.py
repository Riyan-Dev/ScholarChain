import json

from fastapi import HTTPException # type: ignore
from datetime import datetime
from bson import ObjectId
from db import application_collection, plan_collection
from utility import convert_date_fields

from models.application import Application
from services.langchain_services import LangChainService
from utility import post_processing_response, validate_application_object

class ApplicationService:

    @staticmethod
    async def get_all_applications():
        # In your services/application_services.py file
        applications = await application_collection.find().to_list(None)  # Convert cursor to list
        filtered_data = []
        for app in applications:
            print(app)
            filtered_data.append({
                "id": str(app["_id"]),
                "username": app["username"],
                "status": app["status"],
                "application_date": app["application_date"]

                })  # Convert ObjectId to string
        return filtered_data

    @staticmethod
    async def verify_application(application_id: str):

        update_data = {
            "updated_at": datetime.now(),
            "status": "verified"
        }

        try:

            update_data['updated_at'] = datetime.utcnow()

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

        update_data = convert_date_fields(update_data)
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
            json_object["application_id"] = str(application_dict["id"])
            result = await ApplicationService.save_plan_db(json_object)
            json_object["_id"] = str(json_object["_id"])
            return json_object
        except json.JSONDecodeError as e:
            # Handle JSON decoding error if any
            print(e)
            raise HTTPException(status_code=500, detail=f"Unable to fetch response, Try Again")




    async def auto_fill_fields(current_user):

        application = await ApplicationService.get_application(current_user.username)

        if application:
            application["_id"] = str(application["_id"])
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
