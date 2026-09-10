import os
from agent.agentResponse import handle_chat_model_stream, handle_other_event, handle_tool_end, handle_tool_start, handle_error
from dotenv import load_dotenv
from fastapi import WebSocket
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver

from .providers.groq_provider import GroqProvider
from .providers.gemini_provider import GeminiProvider
from .systemPrompt import system_prompt
from .providers.models import get_model_config
load_dotenv()

EVENT_HANDLERS = {
    "on_chat_model_stream": handle_chat_model_stream,
    "on_tool_start": handle_tool_start,
    "on_tool_end": handle_tool_end,
}

class Agent:

    def __init__(self, user_id: int):
        self.user_id = user_id
        self.providers = {
            "groq": GroqProvider(),
            "gemini": GeminiProvider()
        }

        self.provider = os.getenv("PROVIDER", "gemini")
        self.model = os.getenv("GEMINI_MODEL")
        self.checkpointer = InMemorySaver()
        self.device_id = None
        self.agent = None
        self.tools = []
        self.initialized = False
        self.system_prompt = system_prompt

    def set_provider(self, provider):
        if provider not in self.providers:
            raise ValueError(f"Unknown provider: {provider}")

        self.provider = provider
        self.create_agent()

    def set_model(self, model):
        self.model = model
        self.create_agent()

    def set_tools(self, tools):
        self.tools.extend(tools)
        self.create_agent()

    def reset_tools(self, tools):
        self.tools = tools
        self.create_agent()
        
    def get_device(self):
        return self.device_id
    
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
            tools=self.tools,
            system_prompt=self.system_prompt,
            checkpointer=self.checkpointer
        )
        self.initialized = True

    def _config(self):
        return {"configurable": {"thread_id": str(self.user_id)}}
    
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
                config=self._config(),
                version="v2"
            ):
                handler = EVENT_HANDLERS.get(event["event"], handle_other_event)
                await handler(event, websocket)

            await websocket.send_json({
                "type": "done",
                "streaming": False
            })

        except Exception as e:
            await handle_error(e, websocket)

    async def response(self, data, websocket: WebSocket):
        data_type = data.get("type")
        if data_type == "change_model":
            model = data.get("model")
            llm = get_model_config(model)
            if llm:
                self.set_provider(llm.get("provider"))
                self.set_model(llm.get("model_name"))

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