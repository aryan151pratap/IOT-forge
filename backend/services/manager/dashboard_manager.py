from fastapi import WebSocket
import asyncio

class DashboardManager:

    def __init__(self):
        self.connections: dict[int, list[WebSocket]] = {}
        self.pending_requests = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        if user_id not in self.connections:
            self.connections[user_id] = []
        self.connections[user_id].append(websocket)

    def disconnect(self, user_id: int, websocket: WebSocket):
        connections = self.connections.get(user_id)
        if not connections:
            return
        if websocket in connections:
            connections.remove(websocket)
        if not connections:
            del self.connections[user_id]

    def get_websocket(self, user_id: int):
        return self.connections.get(user_id, [])

    def is_connected(self, user_id: int):
        return user_id in self.connections

    async def broadcast(self, user_id: int, data: dict):
        connections = self.connections.get(user_id, [])

        if not connections:
            return

        await asyncio.gather(
            *[
                websocket.send_json(data)
                for websocket in connections
            ],
            return_exceptions=True
        )

    def create_pending_request(self, request_id: str, request_type: str, websocket: WebSocket):
        future = asyncio.get_running_loop().create_future()

        self.pending_requests[request_id] = {
            "future": future,
            "websocket": websocket,
            "request_type": request_type
        }

        return future

    async def resolve_request(self, request_id: str, data: dict):
        request = self.pending_requests.get(request_id, None)

        if not request:
            return

        websocket = request["websocket"]
        request_type = request["request_type"]
        stream = data.get("stream", False)

        if stream:
            try:
                await websocket.send_json({
                    **data,
                    "request_type": request_type
                })
            except Exception:
                pass
            return

        self.pending_requests.pop(request_id, None)

        future = request["future"]

        if not future.done():
            future.set_result(data)

        # Send response only to the frontend
        try:
            await websocket.send_json({**data, "request_type": request_type})
        except Exception:
            pass

    def cancel_request(self, request_id: str):
        self.pending_requests.pop(
            request_id,
            None
        )

dashboard_manager = DashboardManager()