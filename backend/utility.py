
from mistralai import Mistral
from fastapi import HTTPException
from datetime import datetime, date
from pydantic import ValidationError
import asyncio

import json
import os
from dotenv import load_dotenv
# Assuming the Application model is already defined
from models.application import Application


async def validate_application_object(json_object) -> Application:
    try:

        # Try to validate and create an Application model
        application = Application(**json_object)  # This will raise an error if the fields don't match
        print("Application is valid:", application)
        return application
    except ValidationError as e:
        # Handle validation errors
        print("Validation error:", e.errors())
        raise HTTPException(status_code=500, detail=f"Unable to fetch response, Try Again")
    except json.JSONDecodeError as e:
        print("JSON Decode error:", e)
        raise HTTPException(status_code=500, detail=f"Unable to fetch response, Try Again")

def transform_user_document(doc):
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    if "documents" in doc:
        for document in doc["documents"]:
            if "metadata" in document and "date" in document["metadata"]:
                try:
                    # Convert string date to datetime
                    document["metadata"]["date"] = datetime.strptime(
                        document["metadata"]["date"], "%d-%b-%Y"
                    )
                except ValueError:
                    raise ValueError(f"Invalid date format: {document['metadata']['date']}")
    return doc

async def post_processing_response(response: str):
    """
        this function ensures that the json response is extracted from the LLM response and other text is discarded so no error 
        is faced while converting the string to JSON obj 
    """

    # Check if the first character is not '{'
    if response[0] != '{' or response[len(response)-1] != '}':
        # Find the first '{' and last '}' positions
        first_brace_index = response.find('{')
        last_brace_index = response.rfind('}')
        
        # Extract the substring within the braces
        if first_brace_index != -1 and last_brace_index != -1 and first_brace_index < last_brace_index:
            processed_str = response[first_brace_index:last_brace_index + 1]
            return processed_str
        else:
            return "Invalid string format"
    else:
        return response
    

def convert_date_fields(data: dict):
    for key, value in data.items():
        if isinstance(value, date) and not isinstance(value, datetime):
            data[key] = datetime.combine(value, datetime.min.time())
        elif isinstance(value, dict):
            convert_date_fields(value)
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, dict):
                    convert_date_fields(item)
    return data





async def run_mistral(user_message, model="mistral-small-latest"):
    load_dotenv()
    api_key = os.getenv("api_key")
    client = Mistral(api_key=api_key)

    messages = [
        {
            "role": "user", "content": user_message
        }
    ]
    def blocking_mistral_call():
        # Blocking call to the Mistral client
        chat_response = client.chat.complete(
            model=model,
            messages=messages,
            response_format={"type": "json_object"},
        )
        return chat_response.choices[0].message.content

    # Run the blocking function in a separate thread
    response = await asyncio.to_thread(blocking_mistral_call)

    try:
        json_obj = json.loads(response)
        return json_obj
    except json.JSONDecodeError as e:
        print(e)
        raise HTTPException(status_code=500, detail="Unable to fetch response, Try Again")
