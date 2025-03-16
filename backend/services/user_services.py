# services/user_service.py
import os
import pathlib
import base64
import json
import time

import asyncio

from typing import List
from fastapi import HTTPException
from web3 import Web3

from middleware.JWT_authentication import get_password_hash, verify_password
from db import user_collection, wallet_collection
from utility import transform_user_document, convert_mongo_to_json_string

from models.application import Document
from models.user import User, DocumentsList
from models.wallet import Wallet

from google.genai import types
from services.gemini_services import GeminiServices


from services.encrption_services import EncrptionServices
from services.rag_services import pdf_to_images, vision_model
from services.documents import document
from services.transaction_services import TransactionServices



class UserService:
    @staticmethod
    async def store_documents(files, ids, token):
        from services.application_services import ApplicationService
        STATIC_DIR = os.path.join(os.path.dirname(__file__), "../static")
        os.makedirs(STATIC_DIR, exist_ok=True)
        documents: List[Document] = []
        file_paths=[]
        for idx, file in enumerate(files):
            # print(f"Processing file: {file.filename}, Type: {type(file)}")
            if file.content_type != 'application/pdf':
                raise HTTPException(status_code=404, detail=f"Files should be PDFs only")
            
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
            file_paths.append(file_path)
        return documents, file_paths

    

    @staticmethod
    async def register_user(user_data: User):
        if await UserService.user_exists(user_data.username, user_data.email):
            raise HTTPException(status_code=409, detail=f"User already Exists")
        return await UserService.create_user(user_data)

        # Function to check if a user already exists
    @staticmethod
    async def user_exists(username: str, email: str) -> bool:
        existing_user = await user_collection.find_one({"$or": [{"username": username}, {"email": email}]})
        return existing_user

    # Function to create a new user
    @staticmethod
    async def create_user(user_data: User):

        try:
        

            private_key, address = EncrptionServices.generate_key_pair()
            hashed_password = get_password_hash(user_data.hashed_password)
            
            new_user = {
                "name": user_data.name,
                "username": user_data.username,
                "email": user_data.email,
                "hashed_password": hashed_password,
                "role": user_data.role,
                "is_uploaded": False
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
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An error occured: {e}")
        
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
        print("user documents updated")
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
    async def upload_documents(token, file_paths, ids, documents): 
        from services.application_services import ApplicationService
        from services.langchain_services import LangChainService

        new_documents = {
            "CNIC": [],
            "gaurdian_CNIC": [],
            "electricity_bills": [],
            "gas_bills": [],
            "intermediate_result": [],
            "undergrad_transcript": [],
            "salary_slips": [],
            "bank_statements": [],
            "income_tax_certificate": [],
            "reference_letter": []
        }

        
        # user = await UserService.get_user_doc_by_username(token.username)
        # user_documents = user["documents"]

        # for i, id in enumerate(ids):
        #     if ids[i] in document:
        #         await asyncio.sleep(3)
        #         print("hello")
        #         new_documents[ids[i]].extend(document[ids[i]])
        #         await UserService.add_documents(token.username, new_documents)
        #         continue
        
        system_isntruction = "You are an AI assistant designed to extract detailed information from documents, including text, tables, and visual elements. For each document provided, process every page individually and return a JSON object with the following structure: {\"documents\": [{\"page_content\": \"[Extracted text and tables in JSON format]\", \"metadata\": {\"source\": \"[Unique identifier for the document]\", \"author\": \"[Author or issuing entity, e.g., bank name, electricity company, NADRA]\", \"section\": \"[Specific section of the document, if applicable]\", \"document_type\": \"[Type of document, e.g., academic, financial]\", \"date\": \"[Publication or issue date, if available]\"}}]} Ensure that each page's content is accurately extracted and structured as specified, maintaining the integrity of tables and textual data. The length of the returned list of documents should equal the number of images provided. The 'page_content' field should contain all extracted text and tables for each page. Note: Use the provided data sources as specified in the response format."
        prompt = f"""Give me exact detail of these images in the response of following format (create json object for each page
                                        and return a json_object of list of documents as shown in the response format below)
                                        Note: page content must contain the extracted text and tables for each image
                                        Note: The length of the returned list of documetns should equals the number of images in the input
                                        Final_note: I have already provided the source of Data use it as given in the response format
                                        response format:
                                        {{
                                            "documents": [
                                                {{
                                                    "page_content": "all the text and table related data extracted from each image should be returned in this field",
                                                    "metadata": {{
                                                        "source": "source of this document (keep this 2 - 3 words max)",
                                                        "author": "author of the source if any such as bank name or electricity company or Nadra etc,
                                                        "section": "what is the section",
                                                        "document_type": "academic or financial",
                                                        "date": "date of the document else return empty string"
                                                    }}
                                                }}
                                            ],
                                        }}
                                    """
        for i, file_path in enumerate(file_paths):
            filepath = pathlib.Path(file_path)
            contents = [types.Part.from_bytes(
                            data=filepath.read_bytes(),
                            mime_type='application/pdf',
                        ),
                        prompt]
            config = types.GenerateContentConfig(
                    system_instruction=[system_isntruction],
                    response_mime_type='application/json',            
                )
            

            response = await GeminiServices.gemini_chat(contents, config)
            print(response.text)
            print(f"processed {file_path}")

       
            try:
                parsed_response = json.loads(response.text) if isinstance(response.text, str) else response

                if "documents" in parsed_response and isinstance(parsed_response["documents"], list):
                    for doc in parsed_response["documents"]:
                        doc["page_content"] = json.dumps(doc["page_content"], indent=None)
                    
                    print(parsed_response)
                    new_documents[ids[i]].extend(parsed_response["documents"])
                else:
                    raise HTTPException(status_code=500, detail=f"Unable to fetch response, Try Again")
            except json.JSONDecodeError:
                raise HTTPException(status_code=500, detail=f"Unable to fetch response, Try Again")
            

        await LangChainService.store_user_documents(token.username, new_documents, ids)
        await ApplicationService.auto_fill_fields(token,  documents)
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
    async def update_mongo_vector_store(username):
        from services.application_services import ApplicationService
        from services.loan_services import LoanService
        from services.langchain_services import LangChainService

        user_data = await UserService.get_user_by_username(username)
        application_data = await ApplicationService.get_application(username)
        loan_data = await LoanService.get_loan(username)
        wallet_data = await TransactionServices.get_wallet(username)

        mongo_data = {
            "users": convert_mongo_to_json_string(user_data.dict()),
            "application": convert_mongo_to_json_string(application_data),
            "loan": convert_mongo_to_json_string(loan_data),
            "wallet": convert_mongo_to_json_string(wallet_data)
        }

         
        await LangChainService.overwrite_vector_store_from_mongo(username, mongo_data)

    @staticmethod
    async def get_applicant_dash(username): 
        from services.application_services import ApplicationService
        from services.loan_services import LoanService

        await UserService.update_mongo_vector_store(username)

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
        if (application_data):
            dashData["app_id"] = str(application_data["_id"])

        loan = await LoanService.get_loan_summary(username)
        if loan:
            dashData["loan"] = loan

        wallet = await TransactionServices.get_wallet(username)
        if wallet:
            dashData["wallet_data"] = wallet

        return dashData
    
    @staticmethod
    async def get_donator_dash(username):
        from services.loan_services import LoanService
        from services.transaction_services import TransactionServices

        pipeline = [
            {
                "$match": {"username": username}
            },
            {
                "$unwind": "$transactions"
            },
            {
                "$group": {
                    "_id": None,
                    "totalCredit": {
                        "$sum": {
                            "$cond": [
                                {"$eq": ["$transactions.action", "buy"]},
                                "$transactions.amount",
                                0
                            ]
                        }
                    },
                    "totalDebit": {
                        "$sum": {
                            "$cond": [
                                {"$eq": ["$transactions.action", "debit"]},
                                "$transactions.amount",
                                0
                            ]
                        }
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "totalCredit": 1,
                    "totalDebit": 1
                }
            }
        ]

        # Fetch from the 'wallet' collection
        user_doc_future = wallet_collection.find_one({"username": username})  # Changed to wallet_collection
        aggregation_future = wallet_collection.aggregate(pipeline).to_list(length=1) # also use wallet collection

        user_doc, aggregation_result = await asyncio.gather(user_doc_future, aggregation_future)

        if not user_doc:
            return None

        dashData = {
            "username": user_doc["username"],
            "balance": user_doc["balance"],
            "transactions": [
                {
                    "username": trans["username"] if trans["username"] else user_doc["username"],
                    "amount": trans["amount"],
                    "action": trans["action"],
                    "timestamp": trans["timestamp"]
                } for trans in user_doc["transactions"]
            ],
            "public_key": user_doc["public_key"],
        }

        if aggregation_result:
            dashData["totalCredit"] = aggregation_result[0]["totalCredit"]
            dashData["totalDebit"] = aggregation_result[0]["totalDebit"]
        else:
            dashData["totalCredit"] = 0
            dashData["totalDebit"] = 0

        loan_future = LoanService.get_loan_summary(username)
        wallet_future = TransactionServices.get_wallet(username)  # This might need adjustment if it's not using wallet_collection
        loan, wallet = await asyncio.gather(loan_future, wallet_future)

        if loan:
            dashData["loan"] = loan
        if wallet:
            dashData["wallet_data"] = wallet  #Consider removing, as we already have balance and transactions

        return dashData