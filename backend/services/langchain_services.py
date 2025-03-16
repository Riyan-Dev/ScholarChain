from config.config import Config
from langchain import hub
from langchain_chroma import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain_mistralai import ChatMistralAI
from langchain_google_genai import ChatGoogleGenerativeAI

from config.init_EM import get_embedding_model

import getpass
import os
import asyncio
import shutil
import tempfile
from fastapi import HTTPException
from dotenv import load_dotenv
import pprint

load_dotenv()
vector_stores = {}

CHROMA_DB_BASE_DIR = Config.chroma_db_base_path

class LangChainService:



    @staticmethod
    async def create_user_vector_store(username: str):
        """Creates a Chroma vector store for a specific user."""

        user_db_dir = os.path.join(CHROMA_DB_BASE_DIR, username)
        user_collection_name = f"user_{username}_collection"

        embeddings_model = get_embedding_model()

        async def create_vector_store_sync():
            os.makedirs(user_db_dir, exist_ok=True)
            try:
                Chroma(persist_directory=user_db_dir, collection_name=user_collection_name, embedding_function=embeddings_model)
            except ValueError:
                pass

        await asyncio.to_thread(create_vector_store_sync)

        return user_db_dir, user_collection_name
    
    @staticmethod
    async def get_user_vector_store(username: str):
        """Retrieves an existing Chroma vector store for a user."""

        user_db_dir = os.path.join(CHROMA_DB_BASE_DIR, username)
        user_collection_name = f"user_{username}_collection"

        embeddings_model = get_embedding_model()

        try:
            vectorstore = Chroma(persist_directory=user_db_dir, collection_name=user_collection_name, embedding_function=embeddings_model)
            return vectorstore
        except ValueError as e:
            print(f"Vector store not found for user {username}: {e}")
            return None
    
    @staticmethod
    async def store_user_documents(username: str, user_documents, keys=['CNIC', 'gaurdian_CNIC', 'intermediate_result', 'bank_statements', 'salary_slips', 'gas_bills', 'electricity_bills', 'reference_letter', 'undergrad_transcript']):
        """Stores user documents in the Chroma vector store."""


        vectorstore = await LangChainService.get_user_vector_store(username)

        if vectorstore is None:
            # Create a new vector store if it doesn't exist
            await LangChainService.create_user_vector_store(username)
            vectorstore = await LangChainService.get_user_vector_store(username)


        document_list = []
        for key in keys:
            if key in user_documents:
                for doc in user_documents[key]:
                    doc["metadata"]["document_type"] = key
                    document_list.append(doc)

        docs_as_documents = [
            Document(page_content=doc["page_content"], metadata=doc["metadata"]) for doc in document_list
        ]
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200, add_start_index=True)
        all_splits = text_splitter.split_documents(docs_as_documents)

        vectorstore.add_documents(documents=all_splits) # use add_documents
        print("Documents added to vector store")
        return {"Message": "Docuemts stored successfully"}
    
    @staticmethod
    async def overwrite_vector_store_from_mongo(username: str, mongo_data: dict, keys_to_update=['application', 'wallet', 'users', 'loan']):
        """Overwrites the user's vector store with data from MongoDB for specified collections."""

        vectorstore = await LangChainService.get_user_vector_store(username)

        if vectorstore is None:
            await LangChainService.create_user_vector_store(username)
            vectorstore = await LangChainService.get_user_vector_store(username)

        vectorstore.delete(where={"source": "mongodb"})

        document_list = []
        for key in keys_to_update:
            if key in mongo_data:  # Check if key exists and is a list
                
                page_content = mongo_data[key]
                metadata = {
                    "source": "mongodb",
                    "collection": key,
                }
                document_list.append(Document(page_content=page_content, metadata=metadata))
            else:
                print(f"Collection '{key}' not found or empty in MongoDB data for user '{username}'.")

        if document_list:
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200, add_start_index=True)
            all_splits = text_splitter.split_documents(document_list)

            vectorstore.add_documents(documents=all_splits)
            print(f"Overwrote vector store with {len(all_splits)} documents from MongoDB for collections: {keys_to_update}")
            return {"Message": "Vector store overwritten successfully from MongoDB"}
        else:
            print("No valid data found in MongoDB for the specified collections.")
            return {"Message": "No valid data found in MongoDB for the specified collections."}



    @staticmethod
    async def rag_bot(query: str, username: str, filter: dict = None):
        """RAG bot using Chroma vector store."""

        llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=Config.gemini_api_key)

        vectorstore = await LangChainService.get_user_vector_store(username)

        if vectorstore is None:
            return {"response": "Vector store not found for this user."}

        search_kwargs = {"k": 6}

        if filter:
            search_kwargs["filter"] = filter
        
        retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs=search_kwargs)

        prompt = hub.pull("rlm/rag-prompt")

        def format_docs(docs):
            return "\n\n".join(doc.page_content for doc in docs)

        rag_chain = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )

        response = []
        for chunk in rag_chain.stream(query):
            print(chunk)
            response.append(chunk)

        return {"response": ''.join(response)}
