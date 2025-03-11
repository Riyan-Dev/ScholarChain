# services/user_service.py
import os
import base64
import json
import time

import asyncio

from typing import List
from fastapi import HTTPException
from web3 import Web3

from middleware.JWT_authentication import get_password_hash, verify_password
from db import user_collection, wallet_collection
from utility import transform_user_document

from models.application import Document
from models.user import User, DocumentsList
from models.wallet import Wallet



from services.encrption_services import EncrptionServices
from services.rag_services import pdf_to_images, vision_model
from services.documents import document



class UserService:
    @staticmethod
    async def store_documents(files, ids, token):
        from services.application_services import ApplicationService
        STATIC_DIR = os.path.join(os.path.dirname(__file__), "../static")
        os.makedirs(STATIC_DIR, exist_ok=True)
        documents: List[Document] = []
        
        for idx, file in enumerate(files):
            # print(f"Processing file: {file.filename}, Type: {type(file)}")
            file_name = token.username + "_" + ids[idx] + ".pdf"
            file_path = os.path.join(STATIC_DIR, file_name)
            with open(file_path, "wb") as f:
                while True:
                    chunk = await file.read(1024 * 1024)  # 1MB       
                    if not chunk:
                        break
                    f.write(chunk)
                file_url = f"/pdfs/{file_name}"
                documents.append({"type": ids[idx], "url": file_url})
        
        return await ApplicationService.update_application(token.username, {"documents": documents})

    

    @staticmethod
    async def register_user(user_data: User):
        if await UserService.user_exists(user_data.username, user_data.email):
            raise ValueError("Username or email already exists.")
        return await UserService.create_user(user_data)

        # Function to check if a user already exists
    @staticmethod
    async def user_exists(username: str, email: str) -> bool:
        existing_user = await user_collection.find_one({"$or": [{"username": username}, {"email": email}]})
        return existing_user

    # Function to create a new user
    @staticmethod
    async def create_user(user_data: User):

        

        private_key, address = EncrptionServices.generate_key_pair()
        hashed_password = get_password_hash(user_data.hashed_password)
        
        new_user = {
            "username": user_data.username,
            "email": user_data.email,
            "hashed_password": hashed_password,
            "documents": user_data.documents.dict(),  # Convert the document list to dicts
            "role": user_data.role
        }
        print(private_key)
        print(address)
       
       
        
        # Encrypt the private key
        encrypted_private_key = EncrptionServices.encrypt_private_key(private_key)
        # Save the wallet with an empty transaction list
        # Send the signed transaction
       

        new_wallet = Wallet(
            username=user_data.username,
            public_key=address,
            encrypted_private_key=encrypted_private_key,
            balance=0,
            transactions=[]
        )
        
        result = await user_collection.insert_one(new_user)
        await wallet_collection.insert_one(new_wallet.dict())
        
        return str(result.inserted_id) 
    
    @staticmethod
    async def authenticate_user(username: str, password: str):
        user = await user_collection.find_one({"username": username})
        if not user or not verify_password(password, user["hashed_password"]):
            return None
        return user
    
    @staticmethod
    async def add_documents(username: str, new_documents: list):
        # Update MongoDB - Append new documents to the user's `documents` array
        if new_documents:
            result = await user_collection.update_one(
                {"username": username},  # Match user by ID from the token
                {"$set": {"documents": new_documents}}  # Append each document
            )
            
            return {
                "status": "success",
                "modified_count": result.modified_count,
                "message": "Documents have been added successfully."
            }

        return {"status": "error", "message": "No documents were added."}
    
    @staticmethod 
    async def get_user_by_username(username: str):
        user_doc = await user_collection.find_one({"username": username})
        transformed_user = transform_user_document(user_doc)
        user = User(**transformed_user)
        return user
    
    @staticmethod 
    async def get_user_doc_by_username(username: str):
        user_doc = await user_collection.find_one({"username": username})
       
        return user_doc
    

    @staticmethod 
    async def get_all_donars_username():
        users = await user_collection.find().to_list(None)
        donators = [user["username"] for user in users if user["role"] == "donator"]
        return donators

    @staticmethod 
    async def set_upload(username):
        await user_collection.update_one(
            {"username": username},  # Match user by ID from the token
            {"$set": {"is_uploaded": True}}  # Append each document
        )
        return {"status": "success", "message": "Documents have been added successfully."}
    @staticmethod
    async def upload_documents(files, ids, token): 
        from services.application_services import ApplicationService
        new_documents = {
            "CNIC": [],
            "gaurdian_CNIC": [],
            "electricity_bills": [],
            "gas_bills": [],
            "intermediate_result": [],
            "undergrad_transacript": [],
            "salary_slips": [],
            "bank_statements": [],
            "income_tax_certificate": [],
            "reference_letter": []
        }

        extract_fields = {
            "CNIC": f"""
                    {{
                    "full_name": " name of the applicant",
                    "dob": "date of the birthd in the format of YYYY-MM-DD",
                    "gender": "Male or Female",
                    "nationality": "American etc etc"
                    }}
                    """,
            "gaurdian_CNIC": "",
            "electricity_bills": f"""
                    {{
                    "address": "Address of the Electricity Bill house",
                    }}
                    """,
            "gas_bills": f"""
                    {{
                    "address": "Address of the Gas Bill house",
                    }},
                    """,
            "intermediate_result": [],
            "undergrad_transacript":  f"""
                    {{
                    "gpa": "CGPA of the student",
                    "year_or_semester": "Year  or semester",
                    "program_name_degree": "Bachelors of computer science etc",
                    "student_id": "student id as provided in the transcript",
                    "college_or_university": "XYZ University",
                    "current_education_level": "Undergraduate / Postgraduate"
                    }},
                    """,
            "salary_slips":  f"""
                    {{
                    "total_family_income": "based on the salary slips give me annualy salary of the applicant (return an integer)",
                    }},
                    """,
            "bank_statements": [],
            "income_tax_certificate": [],
            "reference_letter": f"""
                    {{
                    "name": "source for this information is reference letter as mention in some metadata for documents",
                    "designation": "Professor",
                    "contact_details": "+987654321",
                    "comments": "John is a diligent student."
                    }},
                    """
        }
        # user = await UserService.get_user_doc_by_username(token.username)
        # user_documents = user["documents"]

        for i, id in enumerate(ids):
            if ids[i] in document:
                await asyncio.sleep(3)
                print("hello")
                new_documents[ids[i]].extend(document[ids[i]])
                await UserService.add_documents(token.username, new_documents)
                continue
        
        # await ApplicationServices.auto_fill_field(token)

        await ApplicationService.auto_fill_fields(token)

        # for i, file in enumerate(files):
        #     if ids[i] in user_documents:
        #         return {"Messsage": "Documents Uploaded"}
            
        #     image_paths = await pdf_to_images(file)            
            
        #     if ids[i] in document:
        #         time.sleep(10)
        #         new_documents[ids[i]].extend(document[ids[i]])
        #         continue

        #     image_contents = []
        #     for image_path in image_paths:
        #         if os.path.exists(image_path):
        #             # Load and encode the local image
        #             with open(image_path, "rb") as image_file:
        #                 image_bytes = image_file.read()

        #             # Convert image bytes to base64
        #             image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        #             # Append the base64 image content to the list
        #             image_contents.append(
        #                 {
        #                     "type": "image_url",
        #                     "image_url": f"data:image/jpeg;base64,{image_base64}"
        #                 }
        #             )

        #             os.remove(image_path)

        #     # Define the messages, with multiple images
        #     messages = [
        #         {
        #             "role": "user",
        #             "content": [
        #                 {
        #                     "type": "text",
        #                     "text": f"""Give me exact detail of these images in the response of following format (create json object for each page
        #                                 and return a json_object of list of documents as shown in the response format below)
        #                                 Note: page content must contain the extracted text and tables for each image
        #                                 Note: The length of the returned list of documetns should equals the number of images in the input
        #                                 Final_note: I have already provided the source of Data use it as given in the response format
        #                                 response format:
        #                                 {{
        #                                     "documents": [
        #                                         {{
        #                                             "page_content": "all the text and table related data extracted from each image should be returned in this field",
        #                                             "metadata": {{
        #                                                 "source": {ids[i]},
        #                                                 "author": "author of the source if any such as bank name or electricity company or Nadra etc,
        #                                                 "section": "what is the section",
        #                                                 "document_type": "academic or financial",
        #                                                 "date": "date of the document if available"
        #                                             }}
        #                                         }}
        #                                     ],
        #                                     "extracted_fields": {extract_fields[ids[i]]}
        #                                 }}
        #                             """
        #                 },
        #                 *image_contents  # Add the list of images to the message content
        #             ]
        #         }
        #     ]

        #     response = await vision_model(messages)
            
        #     # Parse and validate the response
        #     try:
        #         parsed_response = json.loads(response) if isinstance(response, str) else response

        #         if "documents" in parsed_response and isinstance(parsed_response["documents"], list):
        #             for doc in parsed_response["documents"]:
        #                 doc["page_content"] = json.dumps(doc["page_content"], indent=None)
                    
        #             print(parsed_response)
        #             extract_fields[ids[i]] = parsed_response["extracted_fields"]
        #             new_documents[ids[i]].extend(parsed_response["documents"])
        #         else:
        #             raise HTTPException(status_code=500, detail=f"Unable to fetch response, Try Again")
        #     except json.JSONDecodeError:
        #         raise HTTPException(status_code=500, detail=f"Unable to fetch response, Try Again")

        # # Check if username is None, and raise an HTTPException if it is
        # if token.username is None:
        #     raise HTTPException(status_code=400, detail="Username is missing in the token")

        # Now safely call add_documents, assuming username is always a valid string
        return await UserService.add_documents(token.username, new_documents)

    async def check_all_document_types_present(username: str):
        """
        Checks if all document types in the 'documents' field of a user
        are non-empty arrays.

        Args:
            username: The username of the user to check.

        Returns:
            True if all document types are non-empty, False otherwise.
            Returns None if the user is not found or has no 'documents' field.
        """
        pipeline = [
            {
                "$match": {
                "username": username
                }
            },
            {
                "$project": {
                "_id": 0,
                "documents": {  
                    "$ifNull": ["$documents", {}] 
                },
                
                "CNIC_present": {
                    "$gt": [{ "$size": { "$ifNull": ["$documents.CNIC", []] } }, 0]
                },
                "guardian_CNIC_present": {
                    "$gt": [{ "$size": { "$ifNull": ["$documents.gaurdian_CNIC", []] } }, 0]
                },
                "electricity_bills_present": {
                    "$gt": [{ "$size": { "$ifNull": ["$documents.electricity_bills", []] } }, 0]
                },
                "gas_bills_present": {
                    "$gt": [{ "$size": { "$ifNull": ["$documents.gas_bills", []] } }, 0]
                },
                "intermediate_result_present": {
                    "$gt": [{ "$size": { "$ifNull": ["$documents.intermediate_result", []] } }, 0]
                },
                "salary_slips_present": {
                    "$gt": [{ "$size": { "$ifNull": ["$documents.salary_slips", []] } }, 0]
                },
                "bank_statements_present": {
                    "$gt": [{ "$size": { "$ifNull": ["$documents.bank_statements", []] } }, 0]
                },
                "reference_letter_present": {
                    "$gt": [{ "$size": { "$ifNull": ["$documents.reference_letter", []] } }, 0]
                }
                }
            },
            {
                "$addFields": {
                "filled_arrays": {
                    "$sum": [ 
                    { "$cond": [{ "$eq": ["$CNIC_present", True] }, 1, 0] },
                    { "$cond": [{ "$eq": ["$guardian_CNIC_present", True] }, 1, 0] },
                    { "$cond": [{ "$eq": ["$electricity_bills_present", True] }, 1, 0] },
                    { "$cond": [{ "$eq": ["$gas_bills_present", True] }, 1, 0] },
                    { "$cond": [{ "$eq": ["$intermediate_result_present", True] }, 1, 0] },
                    { "$cond": [{ "$eq": ["$salary_slips_present", True] }, 1, 0] },
                    { "$cond": [{ "$eq": ["$bank_statements_present", True] }, 1, 0] },
                    { "$cond": [{ "$eq": ["$reference_letter_present", True] }, 1, 0] }
                    ]
                },
                "total_arrays": 8 
                },
            },
                {
                    "$project": {
                        "status": {
                            "$cond": {
                                "if": { "$eq": ["$filled_arrays", "$total_arrays"]},
                                "then": True,
                                "else": False
                            }
                        },
                        "progress": {
                            "$round": [
                                {"$multiply": [{"$divide": ["$filled_arrays", "$total_arrays"]}, 100]},
                                0 
                            ]
                        }
                    }
                }
            ]


        result = await user_collection.aggregate(pipeline).to_list(length=1)  # Limit to 1 result

        if result:
            return result[0]
        else:
            return {"status": False, "progress": 0}  # User not found or no documents field
        
    @staticmethod
    async def get_dash(username): 
        from services.application_services import ApplicationService
        from services.loan_services import LoanService
        pipeline = [
            {
                "$match": {
                    "username": username
                }
            },
            {
                "$project": {
                    "_id": 0 ,
                    "application_stage": {"$ifNull": ["$application_stage", "start"]},
                    "is_uploaded": {"$ifNull": ["$is_uploaded", False]},
                }
            }
        ]

        result = await user_collection.aggregate(pipeline).to_list(length=1)
        dashData = result[0]
        application_data = await ApplicationService.application_overview(username);
        dashData["app_id"] = str(application_data["_id"])

        loan = await LoanService.get_loan_summary(username)

        if loan:
            dashData["loan"] = loan

        return dashData