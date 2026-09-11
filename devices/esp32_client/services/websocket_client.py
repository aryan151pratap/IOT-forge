# services/websocket_client.py

import uasyncio as asyncio
import ujson
import uwebsockets.client as websocket


class WebSocketClient:

    def __init__(self, url):
        self.url = url
        self.ws = None
        self._send_lock = asyncio.Lock()

    async def connect(self):
        print("Connecting WebSocket...")
        print("URL:", self.url)
        self.ws = await websocket.connect(self.url)
        print("WebSocket Connected")

    async def send_json(self, data):
        async with self._send_lock:
            await self.ws.send(ujson.dumps(data))

    async def receive(self):
        data = await self.ws.recv()

        if data is None:
            print("WebSocket received None")
            return None

        if isinstance(data, memoryview):
            data = data.tobytes()

        if isinstance(data, bytes):
            data = data.decode("utf-8")

        return data

    async def close(self):
        if self.ws:
            await self.ws.close()