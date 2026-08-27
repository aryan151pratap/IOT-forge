import os
from dotenv import load_dotenv
from fastapi import WebSocket

from .providers.groq_provider import GroqProvider
from .providers.gemini_provider import GeminiProvider

load_dotenv()
class Agent:

    def __init__(self):
        self.providers = {
            "groq": GroqProvider(),
            "gemini": GeminiProvider()
        }
        self.provider = os.getenv("provide")
        self.model = os.getenv("GEMINI_MODEL")
        self.initialized = False

    def set_provider(self, provider):
        if provider not in self.providers:
            raise ValueError(
                f"Unknown provider: {provider}"
            )
        self.provider = provider

    def set_model(self, model):
        self.model = model

    async def stream(self, message, provider , model, websocket: WebSocket):
        self.set_provider(provider)
        self.set_model(model)

        llm = self.providers[self.provider]

        stream = await llm.stream(message, model)

        if provider == "groq":
            async for chunk in stream:
                if not chunk.choices:
                    continue

                content = (chunk.choices[0].delta.content)

                if content:
                    await websocket.send_json({
                        "type": "chunk",
                        "content": content
                    })


        elif provider == "gemini":
            async for chunk in stream:
                if chunk.text:
                    await websocket.send_json({
                        "type": "chunk",
                        "content": chunk.text
                    })

    async def response(self, data, websocket: WebSocket):
        data_type = data["type"]
        if data_type == "change_model":
            self.set_provider(data["provider"])
            self.set_model(data["model"])

            await websocket.send_json({
                "type": "model_changed",
                "provider": self.provider,
                "model": self.model
            })

        elif data_type == "message":

            await self.stream(
                data["message"],
                self.provider,
                self.model,
                websocket
            )

        else:
            await websocket.send_json({
                "type": "error",
                "content": f"Unknown message type: {data_type}"
            })