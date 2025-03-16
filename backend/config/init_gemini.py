from config.config import Config
from google import genai
# from google import genai

gemini_api_key = Config.gemini_api_key

_client = None

def get_gemini_client():
    global _client
    if (_client): 
        return _client
    else:
        # genai.configure(api_key=gemini_api_key)
        _client = genai.Client(api_key=gemini_api_key)
        return _client
    