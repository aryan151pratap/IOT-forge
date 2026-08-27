from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from services.manager.agent_manager import agent_manager
from services.auth_service import get_user_ws

router = APIRouter()

@router.websocket("/ws/agent")
async def agent_websocket(websocket: WebSocket):
    await websocket.accept()
    user_id = await get_user_ws(websocket)
    if user_id is None:
        await websocket.close()
        return

    agent = agent_manager.get_agent(user_id)

    try:
        if not agent.initialized:
            agent.initialized = True

            await agent.stream(
                "Greet the user briefly. Just say hello and ask how you can help.",
                agent.provider,
                agent.model,
                websocket
            )

        while True:
            data = await websocket.receive_json()
            await agent.response(data, websocket)
    except WebSocketDisconnect:
        print("Client disconnected")