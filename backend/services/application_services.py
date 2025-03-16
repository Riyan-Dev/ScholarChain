import json

from fastapi import HTTPException # type: ignore
from datetime import date, datetime
from bson import ObjectId
from db import application_collection, plan_collection, risk_assessment_collection, user_collection
from utility import convert_date_fields

from models.application import Application, Reference, AcademicInfo, FinancialInfo, LoanDetails, PersonalInfo, Document
from services.documents import app
from services.langchain_services import LangChainService
from services.gemini_services import GeminiServices
from services.blockchain_service import BlockchainService
from services.loan_services import LoanService
from services.transaction_services import TransactionServices


from utility import post_processing_response, validate_application_object

from models.plan import Plan
from google.genai import types

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
    async def update_status(username, status):
        update_data = {
            "updated_at": datetime.now(),
            "status": status
        }
        return await ApplicationService.update_application(username, update_data)

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
            def convert_dates(data):
                for key, value in data.items():
                    if isinstance(value, dict):
                        convert_dates(value)  # Recursive call for nested dictionaries
                    elif isinstance(value, list):
                        for item in value:
                            if isinstance(item, dict):
                                convert_dates(item)
                    elif isinstance(value, date):
                        data[key] = datetime.combine(value, datetime.min.time())
            convert_dates(application_data)
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
        # print(application)
        return application


    @staticmethod
    async def generate_personalised_plan(application_dict, current_user):
        existing_plan = await ApplicationService.get_plan_db(str(application_dict["_id"]))

        if existing_plan:
            existing_plan["_id"] = str(existing_plan["_id"])
            return existing_plan
        scholarchain_wallet = await TransactionServices.get_wallet("scholarchain")
        application = Application(**application_dict)
        
        query = f"""
                    Our Systems Current funds: {2/3*scholarchain_wallet["balance"]}
                    Given the following information by the loan applicant:
                    Loan Amount Request: {application.loan_details.loan_amount_requested}
                    Loan Details: {application.loan_details.dict()}
                    Academic Details: {application.academic_info.dict()}
                    Financial Details: {application.financial_info.dict()}
                    Personal Details: {application.personal_info.dict()}
                    Preferred Start Date: 1 month after {application.application_date}

                    along with the data retrieved from the documents based on the transactions details (closing balance and salary estimate), savings each month, salary slips, loan amount request, expected graduation date and keeping in mind the preference of the user provide personalised repayment plan as a JSON Object

                    Calculations: determine the number of installments over repayment period and make sure total_loan_amount = installment_amount * number of installments, secondly total_loan_amount is less than of available funds

                    Note: 
                    1. You do not have to strictly follow the user's porposed plan and preferrred repayment instead based on financial analysis of user situation give a better suited plan which is managebale by the user.
                    2. Take user preference for the repayment frequency into account as well
                    Restrictions:
                    1. Loan Amount must be in PKR
                    2. Do not add Comments in the JSON Object response
                    

                    Example JSON OBject
                    {{
                        "total_loan_amount": 2000000, (double)
                        "start_date": "month-year", # month and Year as date example: jun-2025, jul-2025
                        "end_date": "month-year", # month and Year as date
                        "repayment_frequency": "", # (only options are monthly, quarterly, bi-yearly, or annually)
                        "installment_amount": 500000, # (double) also make sure twice by calculating this value is correct or not
                        "reasoning": "detailed reasoning for calculations and suggested plan"
                    }}
                """
        
        
        # response = await LangChainService.rag_bot(query, temp_dir)
        response = await LangChainService.rag_bot(query, current_user)
        processed_response = await post_processing_response(response["response"])
        print(processed_response)
        try:
            import json
            response_json = json.loads(processed_response)
            response_json["application_id"] = application_dict["id"]
            # result = await ApplicationService.save_plan_db(response_json)
        except (json.JSONDecodeError, KeyError, TypeError) as e:
            print(f"Error parsing JSON: {e}")
            print("Raw response text:")
            print(response.text)
        
    async def application_overview(username):
        pipeline = [
            { "$match": { "username": username } },
            { "$project": {
                "_id": 1,
                "name": "$personal_info.full_name",
                "current_education": "$personal_info.current_education_level",
                "institute": "$personal_info.college_or_university",
                "status": 1,
                "application_date": 1
            }}
        ]

        result = await application_collection.aggregate(pipeline).to_list(length=1)

        if (result):
            result[0]["_id"] = str(result[0]["_id"])
            return result[0]
        else:
            return None
        
    async def auto_fill_fields(current_user, documents):
        application = await ApplicationService.get_application(current_user.username)

        if application:
            application["_id"] = str(application["_id"])
            return application

        application_data = {}
        financial_info = FinancialInfo()
        references_list = []

        extract_fields = {
            "CNIC": f"""
                    {{
                    "full_name": " name of the applicant",
                    "dob": "date of the birthd in the format of YYYY-MM-DD",
                    "gender": "Male or Female",
                    "nationality": "American etc etc"
                    "residential_address": "address will be in urdu translate it into english"
                    "permanent_address": "address will be in urdu translate it into english"
                    }}
                    """,
            # "gaurdian_CNIC": "",
            "electricity_bills": f"""
                    {{
                    "address": "Address of the Electricity Bill house",
                    "electricity_bill": "Electricity bill estimated for a year using the history proivded (return a float)"
                    }}
                    """,
            "gas_bills": f"""
                    {{
                    "address": "Address of the Gas Bill house",
                    "gas_bill": "Gas bill estimated for a year using the history proivded (return a float)"
                    }},
                    """,
            # "intermediate_result": [],
            "undergrad_transcript":  f"""
                    {{
                    "gpa": "Latest CGPA of the student",
                    "year_or_semester": "Year  or semester",
                    "program_name_degree": "Bachelors of computer science etc",
                    "student_id": "student id as provided in the transcript",
                    "college_or_university": "XYZ University",
                    "current_education_level": "Undergraduate / Postgraduate"
                    }},
                    """,
            "salary_slips":  f"""
                    {{
                    "total_family_income": "based on the salary slips give me annualy salary of the applicant (always return a float)",
                    }},
                    """,
            # "bank_statements": [],
            # "income_tax_certificate": [],
            "reference_letter": f"""
                    {{
                    "name": "Name of the Professor whos reference letter it belong to",
                    "designation": "Professor",
                    "contact_details": "+987654321",
                    "comments": "John is a diligent student..... (complete information that the refree wrote about the student)"
                    }},
                    """
        }
        
        
        for key in extract_fields:
            query = f"""
                Given the information of the documents in the context above give the response in the following JSON format


                username: {current_user.username} (always return this username in the field called username in response)

                Restrictions:
                1. The key Values of Json Response must be exactly as Example JSON object (no extra or less fields in json response)
                2. Do not return "Not Found" in JSON Object (Most Important)
                3. Return an empty string "" for a string and 0.0 for float fields only if not found.  (Most Important)
                    example LLM could not locate nationality:
                    the response of the specific field in JSON Object should be ("nationality": "")
                4. Do not add comment in JSON Object.


                Example JSON Object Response:
                {extract_fields[key]}
            """
            response = await LangChainService.rag_bot(query, current_user.username, {"document_type": key})
            processed_response = await post_processing_response(response["response"])
            # print(processed_response)

            try:
                data = json.loads(processed_response)
                if key == "CNIC":
                    application_data["personal_info"] = PersonalInfo(**data)
                    if data.get("dob"):
                        application_data["personal_info"].dob = datetime.strptime(data["dob"], "%Y-%m-%d").date()
                elif key == "undergrad_transcript":
                    application_data["academic_info"] = AcademicInfo(**data)
                elif key == "salary_slips":
                    financial_info.total_family_income = data["total_family_income"]
                elif key == "reference_letter":
                    references_list.append(Reference(**data))
                elif key == "electricity_bills":
                    financial_info.electricity_bill = data["electricity_bill"]
                    application_data["personal_info"].permanent_address = data["address"]
                elif key == "gas_bills":
                    financial_info.gas_bill = data["gas_bill"]
                    application_data["personal_info"].residential_address = data["address"]
                application_data["username"] = current_user.username

            except json.JSONDecodeError as e:
                print(f"Error decoding JSON for {key}: {e}")
            except Exception as e:
                print(f"Error processing data for {key}: {e}")

        application_data["references"] = references_list
        application_data["financial_info"] = financial_info
        document_objects = [Document(**doc) for doc in documents]

        # Assign the list of Document objects to application_data
        application_data["documents"] = document_objects

        application = Application(**application_data)
        print("Application generated from the documents")
        await ApplicationService.create_application(application.dict())
        return application
        # response = await LangChainService.rag_bot(query, current_user.username)
        # processed_response = await post_processing_response(response["response"])
        # print(processed_response)
        # try:

        #     # converting the LLM response into json object
        #     json_object = json.loads(processed_response)
        #     if json_object["personal_info"]["dob"] == "" or json_object["personal_info"]["dob"] == "Not Found":
        #         json_object["personal_info"]["dob"] = "2002-12-30"
        #     if json_object["application_date"] == "" or json_object["application_date"] == "Not Found":
        #         json_object["application_date"] = "2002-12-30"
        #     await validate_application_object(json_object)
        #     # results = await ApplicationService.create_application(json_object)
        #     # json_object["_id"] = str(results["application_id"])

        #     return json_object
        # except json.JSONDecodeError as e:
        #     # Handle JSON decoding error if any
        #     print(e)
        #     raise HTTPException(status_code=500, detail=f"Unable to fetch response, Try Again")
    

    # query = f"""
        #     Given the information of the documents in the context above give the response in the following JSON format


        #     username: {current_user.username} (always return this username in the field called username in response)

        #     Restrictions:
        #     1. The key Values of Json Response must be exactly as Example JSON object (no extra or less fields in json response)
        #     2. Do not return "Not Found" in JSON Object (Most Important)
        #     3. Return an empty string "" for a string fields only if not found.  (Most Important)
        #         example LLM could not locate nationality:
        #         the response of the specific field in JSON Object should be ("nationality": "")
        #     4. Do not add comment in JSON Object.


        #     Example JSON Object Response:
        #     {{
        #     "username": "john_doe_123",
        #     "personal_info": {{
        #         "full_name": "John Doe",
        #         "dob": "2000-05-15" (return todays date if not found),
        #         "gender": "Male",
        #         "nationality": "American",
        #         "marital_status": "Single",
        #         "phone_number": "+123456789",
        #         "email_address": "john.doe@example.com",
        #         "residential_address": "123 Main St, City, Country",
        #         "permanent_address": "456 Another St, City, Country"
        #     }},
        #     "financial_info": {{
        #         "total_family_income": 50000 (return an integer),
        #         "other_income_sources": ["Part-time job: 10000", "Freelance: 5000"],
        #         "outstanding_loans_or_debts": ["Car loan: 10000", "Credit Card: 5000"]
        #     }},
        #     "academic_info": {{
        #         "current_education_level": "Undergraduate",
        #         "college_or_university": "XYZ University",
        #         "student_id": "U1234567",
        #         "program_name_degree": "Computer Science",
        #         "duration_of_course": "4 years",
        #         "year_or_semester": "Year 2, Semester 1",
        #         "gpa": 3.8 (return a float),
        #         "achievements_or_awards": ["Dean's List", "Hackathon Winner"]
        #     }},
        #     "loan_details": {{
        #         "loan_amount_requested": 20000 (return an integer),
        #         "purpose_of_loan": "Tuition fees",
        #         "proposed_repayment_period": "24 months",
        #         "preferred_repayment_frequency": "Monthly"
        #     }},
        #     "references": [
        #         {{
        #             "name": "source for this information is reference letter as mention in some metadata for documents",
        #             "designation": "Professor",
        #             "contact_details": "+987654321",
        #             "comments": "John is a diligent student."
        #         }}
        #     ],
        #     "status": "Pending",
        #     "application_date": "2024-11-30" (return todays date),
        #     "declaration": "I hereby declare that all the information provided is true.",
        #     "signature": "John Doe"
        # }}

        # """