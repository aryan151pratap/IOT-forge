import uasyncio as asyncio

class Device:
    __slots__ = ('client', '_message', '_event')

    def __init__(self, client):
        self.client = client
        self._message = None
        self._event = asyncio.Event()

    async def send_json(self, data):
        await self.client.send_json({
            "type": "runner_data",
            "data": data
        })

    async def receive_json(self):
        await self._event.wait()
        data = self._message
        self._message = None
        self._event.clear()
        return data

    def set_message(self, data):
        self._message = data
        self._event.set()

device = None

def init(client):
    global device
    device = Device(client)

async def send_json(data):
    await device.send_json(data)

async def receive_json():
    return await device.receive_json()

def set_message(data):
    device.set_message(data)