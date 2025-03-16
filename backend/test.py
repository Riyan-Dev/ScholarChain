from mistralai import Mistral
from config.config import Config

client = Mistral(api_key=Config.mistral_api_key)



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