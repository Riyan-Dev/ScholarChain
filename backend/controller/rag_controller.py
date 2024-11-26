
from fastapi import APIRouter, UploadFile, File

import base64
from PIL import Image
import os

from services.rag_services import pdf_to_images, vision_model
from services.langchain_services import run_RAG
router = APIRouter()

@router.post("/upload-documents")
async def process_documents():

    docs =  [
        {
            "page_content": "The document contains several examples of bank-related financial statements and a letter, likely used for purposes such as visa applications (I-20) or financial verification. The bank statement sample includes account number 0054623598, Brennan Center Branch, and transaction history from November 1 to November 20. The opening balance was $505,491.59, with total debits of $684,620.00 and total credits of $595,550.00. The closing balance as of November 21 was $421,421.59. The transactions include deposits, withdrawals, and balance updates with amounts such as $12,000 on Nov 1, $75,000 withdrawal on Nov 3, and $8,000 cash deposit on Nov 16. Additionally, the document includes a bank letter from Brennan Center Bank at 1856 133th Niagara Street, Purple City, PK. It addresses Mr./Ms. (First Name) (Last Name) and confirms an account balance of $560,475.58 CAD and $421,421.59 USD. The letter also notes a working line of credit of $15,000 CAD ($11,268.67 USD). It is signed by a client advisor, includes a signature, and is printed on official bank letterhead with a stamp.",
            "metadata": {
                "source": "The Role of Artificial Intelligence in Transforming Modern Healthcare",
                "author": "John Doe",
                "section": "AI in Diagnostics",
                "document_type": "academic",
                "date": "2024-10-03"
            }
        },
        {
            "page_content": "The ability of AI to process vast amounts of data rapidly has made it an invaluable tool in diagnostic procedures. Traditional diagnostic processes are often time-consuming and prone to human error. AI, with its machine learning algorithms and neural networks, has shown exceptional capabilities in interpreting medical images, analyzing patient data, and predicting outcomes with high accuracy. One of the prominent areas where AI has had a significant impact is medical imaging.",
            "metadata": {
                "source": "The Role of Artificial Intelligence in Transforming Modern Healthcare",
                "author": "John Doe",
                "section": "AI in Diagnostics",
                "document_type": "academic",
                "date": "2024-10-03"
            }
        },
        {
            "page_content": "Radiology departments are often burdened with a massive number of medical images that need to be reviewed. AI algorithms, particularly deep learning models, can analyze these images to detect abnormalities such as tumors, fractures, or lesions more accurately than human radiologists in many cases. For example, AI models developed by companies like Google Health have demonstrated the ability to detect breast cancer in mammograms with a lower false-negative rate than human experts.",
            "metadata": {
                "source": "The Role of Artificial Intelligence in Transforming Modern Healthcare",
                "author": "John Doe",
                "section": "AI in Diagnostics - Medical Imaging",
                "document_type": "academic",
                "date": "2024-10-03"
            }
        },
        {
            "page_content": "Beyond medical imaging, AI tools are also being applied to genomic analysis. AI models can predict how genetic mutations will affect a patient's health, enabling early diagnosis of hereditary diseases. In this context, AI has proven to be a powerful tool for predictive analytics, helping medical professionals identify risks before they manifest into serious health issues.",
            "metadata": {
                "source": "The Role of Artificial Intelligence in Transforming Modern Healthcare",
                "author": "John Doe",
                "section": "AI in Diagnostics - Genomics",
                "document_type": "academic",
                "date": "2024-10-03"
            }
        },
        {
            "page_content": "One of the most promising aspects of AI in healthcare is its ability to tailor treatments to individual patients. Personalized medicine, or precision medicine, refers to the customization of healthcare, with decisions and treatments tailored to individual patients in all aspects. AI enables this by analyzing a patient's genetic makeup, lifestyle, and environment to recommend treatments that are more likely to be effective.",
            "metadata": {
                "source": "The Role of Artificial Intelligence in Transforming Modern Healthcare",
                "author": "John Doe",
                "section": "AI in Personalized Medicine",
                "document_type": "academic",
                "date": "2024-10-03"
            }
        }
    # More splits for remaining sections of the essay...
    ]

    return run_RAG(docs, "how much money I have in the in canadians dollar")



   

