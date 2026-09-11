from services.device import send_json, receive_json
import uasyncio as asyncio


async def main():
    c = 0
    while True:
        await send_json({
            "type": "sensor_data",
            "temperature": 25,
            "count": c,
        })
        c+=1
        data = await receive_json()
        if data:
            print(data)
        await asyncio.sleep(1)
