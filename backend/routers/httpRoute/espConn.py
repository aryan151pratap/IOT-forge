import asyncio
import uuid

from fastapi import APIRouter, HTTPException
from services.manager.device_manager import manager

router = APIRouter(tags=["IOT"])

@router.get("/device/connection/{device_id}")
async def get_connection(device_id: str):
    device = manager.get_device(device_id)
    if not device:
        return {"type": "error", "message": f"{device_id} offline"}
    print(device)
    websocket = device["websocket"]
    if websocket:
        await websocket.send_json({
            "status": device["status"],
            "user_id": device["user_id"],
            "device_id": device_id,
            "name": device["name"]    
        })
    return {"device_id": device_id, "status": device["status"], "name": device["name"]}

@router.get("/device/{device_id}")
async def get_esp(device_id: str):
    websocket = manager.get_websocket(device_id)

    if websocket is None:
        raise HTTPException(
            status_code=404,
            detail="device is not connected"
        )
    request_id = str(uuid.uuid4())
    future = manager.create_pending_request(
        request_id
    )

    try:
        await websocket.send_json({
            "type": "details",
            "request_id": request_id,
            "request_type": "http",
        })
        result = await asyncio.wait_for(
            future,
            timeout=5
        )
        result["data"]["status"] = "online"
        return result

    except asyncio.TimeoutError:
        manager.cancel_request(request_id)
        raise HTTPException(
            status_code=504,
            detail="ESP32 did not respond"
        )

    except Exception as e:
        manager.cancel_request(request_id)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        ) 

@router.post("/device/folder/{device_id}")
async def device_folder(device_id: str, path: str = "/"):
    device_web = manager.get_websocket(device_id)
    if device_web is None:
        raise HTTPException(
            status_code=404,
            detail="device is not connected"
        )
    request_id = str(uuid.uuid4())
    future = manager.create_pending_request(
        request_id
    )
    try:
        await device_web.send_json({
            "type": "filesystem",
            "operation": "list_folder",
            "path": path,
            "request_id": request_id,
            "request_type": "http",
        })
        result = await asyncio.wait_for(
            future,
            timeout=5
        )
        return result

    except Exception as e:
        manager.cancel_request(request_id)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )