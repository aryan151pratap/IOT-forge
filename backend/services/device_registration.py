from fastapi import WebSocket
from services.manager.device_manager import manager
from services.manager.dashboard_manager import dashboard_manager
from services.device_sql_service import device_service

async def register_device(websocket: WebSocket):
    register = await websocket.receive_json()
    
    if register.get("type") != "register":
        await websocket.close()
        return None
    
    device_id = register["device_id"]
    name = register["name"]
    manager.register(device_id, name, websocket)
    print(f"✅ {device_id} connected")

    await websocket.send_json({
        "type": "register_ack",
        "data": f"{device_id} connected"
    })

    return await register_user_id(device_id)

async def register_user_id(device_id: str):
    device = device_service.get_device_by_id(device_id)
    if device:
        user_id = device["user_id"]
        manager.assign_user(device_id, user_id)
        await dashboard_manager.broadcast(
            user_id,
            {
            "type": "IOT",
            "device_id": device_id,
            "status": True
        })
        await dashboard_manager.broadcast(
            user_id,
            {
            "type": "terminal",
            "device_id": device_id,
            "data":f"ESP32 {device_id} sucessfully connected",
            "status": True,
            "color": "green"
        })

    return device_id