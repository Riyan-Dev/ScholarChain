import asyncio
from config.init_gemini import get_gemini_client
from google.genai import types





class GeminiServices:

    @staticmethod
    async def gemini_chat(
        prompt, 
        config=types.GenerateContentConfig(
                    response_mime_type='application/json',            
                ), 
        model="gemini-2.0-flash"
        ):
        client = get_gemini_client()

        def blocking_gemini_call():
            response = client.models.generate_content(
                model=model,
                contents=prompt,
                config=config
            )

            return response
        
        response = await asyncio.to_thread(blocking_gemini_call)

        return response
    
    @staticmethod
    async def upload_doc(
        file_url, file_name, type = 'application/pdf'
    ):
        client = get_gemini_client()

        def blocking_gemini_call():
            pdf_file = client.files.upload(file=file_url, config={'display_name': file_name, 'mime_type': type})
            while pdf_file.state.name == "PROCESSING":
                print('.', end='')
                pdf_file = client.files.get(name=pdf_file.name)

            if pdf_file.state.name == "FAILED":
                raise ValueError(pdf_file.state.name)
            
            return pdf_file
        
        response = await asyncio.to_thread(blocking_gemini_call)
        print(response)
        return response