from mistralai import Mistral
import requests
import numpy as np
import faiss
import os
from getpass import getpass

api_key= "wYLGrahRTTDV5O2pJBbjpLXQpD2qLwse"
client = Mistral(api_key=api_key)



prompt = f"""
Context information is below.
---------------------
riyan is a student in FAST ISlamabad semester 6
---------------------
Given the context information and not prior knowledge, answer the query.
Query: who is Riyan
Answer Format: should be in json in the following format
{{
 "answer": "gpt response"
}}
"""

def run_mistral(user_message, model="open-mistral-7b"):
    messages = [
        {
            "role": "user", "content": user_message
        }
    ]
    chat_response = client.chat.complete(
        model=model,
        messages=messages
    )
    return (chat_response.choices[0].message.content)

print(run_mistral(prompt))