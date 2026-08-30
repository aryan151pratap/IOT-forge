import os
from dotenv import load_dotenv
from fastapi import WebSocket
from langchain.agents import create_agent

from .providers.groq_provider import GroqProvider
from .providers.gemini_provider import GeminiProvider

load_dotenv()


class Agent:

    def __init__(self):
        self.providers = {
            "groq": GroqProvider(),
            "gemini": GeminiProvider()
        }

        self.provider = os.getenv("PROVIDER", "gemini")
        self.model = os.getenv("GEMINI_MODEL")

        self.agent = None
        self.tools = []
        self.initialized = False

    def set_provider(self, provider):
        if provider not in self.providers:
            raise ValueError(f"Unknown provider: {provider}")

        self.provider = provider
        self.create_agent()

    def set_model(self, model):
        self.model = model
        self.create_agent()

    def set_tools(self, tools):
        self.tools = tools
        self.create_agent()

    def create_agent(self):
        """
        Create/recreate LangChain agent whenever
        provider, model or tools change.
        """
        if not self.provider or not self.model:
            return
        llm = self.providers[self.provider].get_llm(self.model)
        self.agent = create_agent(
            model=llm,
            tools=self.tools
        )

    async def stream(self, message, websocket: WebSocket):
        if self.agent is None:
            await websocket.send_json({
                "type": "error",
                "content": "Agent is not initialized"
            })
            return

        try:

            async for event in self.agent.astream_events(
                {
                    "messages": [
                        {
                            "role": "user",
                            "content": message
                        }
                    ]
                },
                version="v2"
            ):
                event_type = event["event"]
                if event["event"] == "on_chat_model_stream":
                    content = event["data"]["chunk"].content

                    if isinstance(content, list):
                        for item in content:
                            if item.get("type") == "text":
                                text = item.get("text")

                                if text:
                                    await websocket.send_json({
                                        "type": "chunk",
                                        "content": text
                                    })

                elif event_type == "on_tool_start":
                    await websocket.send_json({
                        "type": "tool_start",
                        "tool": event.get("name"),
                        "input": event["data"].get("input")
                    })

                elif event_type == "on_tool_end":
                    await websocket.send_json({
                        "type": "tool_end",
                        "tool": event.get("name"),
                        "output": event["data"].get("output")
                    })

            await websocket.send_json({
                "type": "done",
                "streaming": False
            })

        except Exception as e:

            await websocket.send_json({
                "type": "error",
                "content": str(e)
            })

    async def response(self, data, websocket: WebSocket):
        data_type = data.get("type")
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
                websocket
            )

        else:
            await websocket.send_json({
                "type": "error",
                "content": f"Unknown message type: {data_type}"
            })