import ujson
import uwebsockets.client as websocket


class WebSocketClient:

    def __init__(self, url):
        self.url = url
        self.ws = None

    async def connect(self):
        print("Connecting WebSocket...")
        print("URL:", self.url)
        self.ws = await websocket.connect(
            self.url
        )

        print("WebSocket Connected")

    async def send_json(self, data):
        await self.ws.send(
            ujson.dumps(data)
        )

    async def receive(self):
        return await self.ws.recv()

    async def close(self):

        if self.ws:
            await self.ws.close()