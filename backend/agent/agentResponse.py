"""
Stream handling split into one function per event type, using AgentResponse
to build the outgoing payload. Drop this into Agent (agent.py), replacing
the current stream() method.
"""

from fastapi import WebSocket
import json, re, ast

class AgentResponse:
    def __init__(self, type: str, content=None, **extra):
        self.type = type
        self.content = content
        self.extra = extra

    def to_dict(self):
        return {
            "type": self.type,
            "content": self.content,
            **self.extra
        }

    async def send(self, websocket: WebSocket):
        await websocket.send_json(self.to_dict())


def _unwrap(value):
    """Pull .content out of a LangChain message object, or pass through."""
    if hasattr(value, "content"):
        return value.content
    if isinstance(value, dict):
        return {k: _unwrap(v) for k, v in value.items()}
    return value


async def handle_chat_model_stream(event, websocket: WebSocket):
    content = event["data"]["chunk"].content
    if isinstance(content, str):
        if content:
            await AgentResponse("chunk", content).send(websocket)
    if isinstance(content, list):
        for item in content:
            if item.get("type") == "text":
                text = item.get("text")
                if text:
                    await AgentResponse("chunk", text).send(websocket)


async def handle_tool_start(event, websocket: WebSocket):
    await AgentResponse(
        "tool_start",
        str(event["data"].get("input")),
        tool=event.get("name")
    ).send(websocket)


async def handle_tool_end(event, websocket: WebSocket):
    output = event["data"].get("output")
    content = output.content if hasattr(output, "content") else output

    await AgentResponse(
        "tool_end",
        str(content),
        tool=event.get("name")
    ).send(websocket)

async def handle_error(e: Exception, websocket: WebSocket):
    error_str = str(e)
    err_json = {}
    
    json_match = re.search(r'\{.*\}', error_str, re.DOTALL)
    if json_match:
        raw_match = json_match.group(0)
        try:
            err_json = json.loads(raw_match)
        except (json.JSONDecodeError, ValueError):
            try:
                err_json = ast.literal_eval(raw_match)
            except Exception:
                err_json = {}
    
    error_msg = err_json.get("error", {}).get("message", error_str)
    retry_match = re.search(r'retry in ([0-9.]+s)', error_str, re.IGNORECASE)
    wait_time = retry_match.group(1) if retry_match else None

    await AgentResponse(
        "error",
        content=f"Rate limit hit. Retry in {wait_time}" if wait_time else error_msg,
        retry_after=wait_time
    ).send(websocket)

async def handle_other_event(event, websocket: WebSocket):
    event_type = event["event"]

    if event_type not in ("on_chat_model_start", "on_chat_model_end"):
        return
    
    await AgentResponse(
        "thinking_start" if event_type == "on_chat_model_start" else "thinking_end",
        "thinking start ........\n" if event_type == "on_chat_model_start" else "\nthinking end .........\n",
        event=event_type
    ).send(websocket)
	