from langchain import hub
from langchain_community.vectorstores.chroma import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain_mistralai import ChatMistralAI


import getpass
import os
import shutil
import tempfile
from fastapi import HTTPException
from dotenv import load_dotenv

from services.user_services import UserService
load_dotenv()
vector_stores = {}


class LangChainService:

    @staticmethod
    async def create_vector_Store(username: str, newDoc: bool, keys =  ['CNIC', 'gaurdian_CNIC', 'intermediate_result', 'bank_statements', 'salary_slips', 'gas_bills', 'electricity_bills', 'reference_letter']):
        global vector_stores

        if username in vector_stores:
            return vector_stores[username]["vectorstore_dir"]
         
        user = await UserService.get_user_doc_by_username(username)


        if newDoc and username in vector_stores:
            # Get the path to the temporary directory
            temp_dir = vector_stores[username]["vectorstore_dir"]

            # Delete the directory and its contents
            shutil.rmtree(temp_dir)

            # Remove from session store
            del vector_stores[username]

        user_documents = user["documents"]
        document_list = []
        for key in keys:
            if key in user_documents:
                for doc in user_documents[key]:
                    document_list.append(doc)
        if not user_documents:
            raise HTTPException(status_code=400, detail=f"No documents found for user {username}.")

        # Convert documents into Document objects
        docs_as_documents = [
            Document(page_content=doc["page_content"], metadata=doc["metadata"]) for doc in document_list
        ]
        
        # Create temporary directory for this session
        temp_dir = tempfile.mkdtemp(prefix=f"user_{username}_session_")

        # Split documents and create vector store
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200, add_start_index=True)
        all_splits = text_splitter.split_documents(docs_as_documents)

        embeddings_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        vectorstore = Chroma.from_documents(documents=all_splits, embedding=embeddings_model, persist_directory=temp_dir)

        # Save the vector store in the temporary directory
        vectorstore.persist()

        # Store the path of the temporary directory for the session
        vector_stores[username] = {"vectorstore_dir": temp_dir}
        
        return temp_dir



    @staticmethod
    async def rag_bot(query: str, temp_dir: str):
        # Specify model
        api_key = os.getenv("api_key")
        llm = ChatMistralAI(model="mistral-small-latest", api_key=api_key)

        # global vector_stores

        # Ensure the session is active
        # if user_id not in session_vectorstores:
        #     raise HTTPException(status_code=400, detail=f"No active session for user {user_id}.")

        # Load the vector store from the temporary directory
        # temp_dir = session_vectorstores[user_id]["vectorstore_dir"]
        embeddings_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

        vectorstore = Chroma(persist_directory=temp_dir, embedding_function=embeddings_model)

        # Retrieve relevant documents
        retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 6})
        retrieved_docs = retriever.invoke(query)

        prompt = hub.pull("rlm/rag-prompt")

        def format_docs(docs):
            return "\n\n".join(doc.page_content for doc in docs)
    # Format retrieved docs as context
        # Generate response using the RAG pipeline
        rag_chain = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )

        response = []
        for chunk in rag_chain.stream(query):
            response.append(chunk)

        return {"response": ''.join(response)}
