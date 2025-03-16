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

    # @staticmethod
    # async def create_vector_Store(username: str, newDoc: bool, keys =  ['CNIC', 'gaurdian_CNIC', 'intermediate_result', 'bank_statements', 'salary_slips', 'gas_bills', 'electricity_bills', 'reference_letter']):
    #     global vector_stores

    #     if username in vector_stores:
    #         return vector_stores[username]["vectorstore_dir"]
         
    #     user = await UserService.get_user_doc_by_username(username)

    #     print(username)
    #     if newDoc and username in vector_stores:
    #         # Get the path to the temporary directory
    #         temp_dir = vector_stores[username]["vectorstore_dir"]

    #         # Delete the directory and its contents
    #         shutil.rmtree(temp_dir)

    #         # Remove from session store
    #         del vector_stores[username]

    #     user_documents = user["documents"]
    #     document_list = []
    #     for key in keys:
    #         if key in user_documents:
    #             for doc in user_documents[key]:
    #                 document_list.append(doc)
    #     if not user_documents:
    #         raise HTTPException(status_code=400, detail=f"No documents found for user {username}.")

    #     # Convert documents into Document objects
    #     docs_as_documents = [
    #         Document(page_content=doc["page_content"], metadata=doc["metadata"]) for doc in document_list
    #     ]
        
    #     # Create temporary directory for this session
    #     temp_dir = tempfile.mkdtemp(prefix=f"user_{username}_session_")

    #     # Split documents and create vector store
    #     text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200, add_start_index=True)
    #     all_splits = text_splitter.split_documents(docs_as_documents)

    #     embeddings_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    #     vectorstore = Chroma.from_documents(documents=all_splits, embedding=embeddings_model, persist_directory=temp_dir)

    #     # Save the vector store in the temporary directory

    #     # Store the path of the temporary directory for the session
    #     vector_stores[username] = {"vectorstore_dir": temp_dir}
        
    #     return temp_dir



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
            # print(chunk)
            response.append(chunk)

        return {"response": ''.join(response)}
