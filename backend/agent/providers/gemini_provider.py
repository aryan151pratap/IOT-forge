from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv()


class GeminiProvider:

    def __init__(self):
        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )

    async def stream(self, message, model):

        return await self.client.aio.models.generate_content_stream(
            model=model,
            contents=message,
            config=types.GenerateContentConfig(
                max_output_tokens=16000,
                temperature=0.5
            )
        )