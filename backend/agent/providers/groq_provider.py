import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()


class GroqProvider:

    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")

    def get_llm(self, model):
        return ChatGroq(
            model=model,
            groq_api_key=self.api_key,
            temperature=0.5,
            max_tokens=7000
        )