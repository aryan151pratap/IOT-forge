from services.device import send_json, receive_json
import uasyncio as asyncio


async def main():
    c = 0
    while True:
        await send_json({
            "temperature": 25,
            "count": c,
        })
        c+=1
        await asyncio.sleep(1)
