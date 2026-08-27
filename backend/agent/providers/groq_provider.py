import os
from groq import AsyncGroq
from dotenv import load_dotenv

load_dotenv()


class GroqProvider:

    def __init__(self):
        self.client = AsyncGroq(
            api_key=os.getenv("GROQ_API_KEY")
        )

    async def stream(self, message, model):
        return await self.client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": message
                }
            ],
            max_completion_tokens=7000,
            stream=True
        )

    async def model_list(self):
        models = await self.client.models.list()
        return [model.id for model in models.data]