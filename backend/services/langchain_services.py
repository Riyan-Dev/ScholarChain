from langchain import hub
from langchain_chroma import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document

import getpass
import os
from dotenv import load_dotenv

load_dotenv()

# Specify model
api_key = os.getenv("api_key")

from langchain_mistralai import ChatMistralAI

llm = ChatMistralAI(model="open-mistral-7b", api_key=api_key)

def run_RAG(docs):
    # loading already done in rag_services when pdf was converted into images and then fed to Vision LLM
    docs_as_documents = [Document(page_content=doc['page_content'], metadata=doc['metadata']) for doc in docs]
    #now we will splitting the docs in chunk for efficient retrieval
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, chunk_overlap=200, add_start_index=True
    )
    all_splits = text_splitter.split_documents(docs_as_documents)

    print(len(all_splits))

    # Load embeddings model
    embeddings_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    #create embedings of the data
    vectorstore = Chroma.from_documents(documents=all_splits, embedding=embeddings_model)

    # retireving relevant information 

    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 6})

    retrieved_docs = retriever.invoke("What is the account balance in Canadian Dollars?")

    print(len(retrieved_docs))
    print(retrieved_docs[0].page_content)

    prompt = hub.pull("rlm/rag-prompt")

    # example_messages = prompt.invoke(
    #     {"context": "filler context", "question": "filler question"}
    # ).to_messages()

    # print(example_messages)

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)


    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    response = []
    for chunk in rag_chain.stream("What is the account balance in Canadian Dollars?"):
        response.append(chunk)  # Add each chunk to the list
    return ''.join(response)