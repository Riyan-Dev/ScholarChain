from langchain_huggingface import HuggingFaceEmbeddings

_model = None

def get_embedding_model():
    global _model
    if (_model): 
        return _model
    else:
        # genai.configure(api_key=gemini_api_key)
        _model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        return _model
    