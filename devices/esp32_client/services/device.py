import uasyncio as asyncio
from collections import deque

class Device:
    __slots__ = ('client', '_messages', '_event')

    def __init__(self, client, maxlen=5):
        self.client = client
        self._messages = deque((), maxlen, 1)
        self._event = asyncio.Event()

    async def send_json(self, data):
        await self.client.send_json({
            "type": "runner_data",
            "data": data
        })

    async def receive_json(self):
        while not self._messages:
            self._event.clear()
            await self._event.wait()
        data = self._messages.popleft()
        if not self._messages:
            self._event.clear()
        return data

    def set_message(self, data):
        self._messages.append(data)
        self._event.set()

device = None

def init(client, maxlen=5):
    global device
    device = Device(client, maxlen)

async def send_json(data):
    await device.send_json(data)

async def receive_json():
    return await device.receive_json()

def set_message(data):
    device.set_message(data)