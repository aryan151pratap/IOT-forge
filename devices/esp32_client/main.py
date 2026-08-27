import sys
sys.path.append("/esp32_client/lib")

import uasyncio as asyncio
import json
import os

from services.wifi import WiFiManager
from services.websocket_client import WebSocketClient
from config import (WIFI_SSID, WIFI_PASSWORD, WS_SERVER, DEVICE_NAME, SEND_INTERVAL)
from services.device_id import get_device_id
from services.terminal import Terminal
from services.response import handleResponse
DEVICE_ID = get_device_id()


async def run_client(wifi, terminal):
    client = WebSocketClient(WS_SERVER)
    try:
        print("Connecting to WebSocket server:", WS_SERVER)
        await client.connect()
        print("WebSocket connected")
        await client.send_json({
            "type": "register",
            "device_id": DEVICE_ID,
            "name": os.uname().machine
        })
        response = await client.receive()
        print("Register response:", response)
        while True:
            response = await client.receive()
            try:
                response = json.loads(response)
            except Exception as e:
                print("Invalid JSON:", e)
                continue
            await handleResponse(client, terminal, response)
            await asyncio.sleep(0)

    except Exception as e:
        print("WebSocket connection lost:", e)
    finally:
        try:
            client.close()
        except Exception:
            pass
        print("WebSocket closed")


async def main():
    wifi = WiFiManager(WIFI_SSID, WIFI_PASSWORD)
    wifi.connect()
    print("Wi-Fi connected. IP address:", wifi.ip())

    terminal = Terminal()

    while True:
        try:
            if not wifi.isconnected():
                print("Wi-Fi dropped, reconnecting...")
                wifi.connect()
                print("Wi-Fi connected. IP address:", wifi.ip())

            await run_client(wifi, terminal)
        except Exception as e:
            print("main() error:", e)

        await asyncio.sleep(3)


asyncio.run(main())