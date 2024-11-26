import os
import sys
sys.path.insert(0, "/Users/ryan/Developer/ScholarChain/backend/scholarChainEnv/lib/python3.11/site-packages")
from dotenv import load_dotenv
from mistralai import Mistral
import fitz 

# Retrieve the API key from environment variables
load_dotenv()

async def pdf_to_images(file):
    # Check if the uploaded file is a PDF
    if file.content_type != 'application/pdf':
        return {"error": "The file must be a PDF"}

    # Read the file content as bytes
    file_bytes = await file.read()
    # Open the PDF document from bytes
    pdf_document = fitz.open("pdf", file_bytes)
    # Ensure the output folder exists
    output_folder = "output_images"
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Save each page as an image and return file paths
    image_paths = []
    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)
        
        # Define a transformation matrix for zooming
        mat = fitz.Matrix(3.0, 3.0)  # Zoom by the specified factor
        pix = page.get_pixmap(matrix=mat)  # Render the page to a pixmap
        
        image_path = os.path.join(output_folder, f"page_{page_num + 1}.png")
        pix.save(image_path)  # Save the pixmap as an image file
        image_paths.append(image_path)

    pdf_document.close()  # Close the PDF document

    return image_paths




def vision_model(messages):

    # Specify model
    api_key = os.getenv("api_key")

    model = "pixtral-12b-2409"

    # Initialize the Mistral client
    client = Mistral(api_key=api_key)

    # Get the chat response
    chat_response = client.chat.complete(
        model=model,
        messages=messages,
        response_format = {"type": "json_object", }
    )

    # Print the content of the response
    return chat_response.choices[0].message.content

# get_embeddings
