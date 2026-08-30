import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()


class GeminiProvider:

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")

    def get_llm(self, model):
        return ChatGoogleGenerativeAI(
            model=model,
            google_api_key=self.api_key,
            temperature=0.5,
            max_output_tokens=16000
        )