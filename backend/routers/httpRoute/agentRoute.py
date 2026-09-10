from fastapi import APIRouter, HTTPException, Request
from services.manager.device_manager import manager
from services.auth_service import get_current_user
from agent.agent_manager import agent_manager
from agent.providers.models import DEFAULT_MODEL_ALIAS, list_available_models

router = APIRouter(tags=["Agent"])

@router.get("/agent/models")
def get_all_models():
    return {
        "models": list_available_models(),
        "default": DEFAULT_MODEL_ALIAS,
    }


@router.get("/agent/models/{provider}")
def get_available_models(provider: str):
    return {
        "models": list_available_models(provider),
        "default": DEFAULT_MODEL_ALIAS,
    }

@router.get("/agent/connectDevice/{device_id}")
async def connect_connection(device_id: str, request: Request):
	user_payload = get_current_user(request)
	user_id = user_payload.get("user_id")
	return await connect_device(device_id, user_id)

@router.get("/agent/disconnectDevice")
async def disconnect_connection(request: Request):
	user_payload = get_current_user(request)
	user_id = user_payload.get("user_id")
	return await disconnect_device(user_id)

async def connect_device(device_id, user_id):
	device = manager.get_device(device_id)
	print(device)
	if not device:
		return {"type": "error", "message": f"{device_id} offline"}
	if str(device.get("user_id")) != str(user_id):
		raise HTTPException(status_code=403, detail="Access denied. You do not own this device.")
	await agent_manager.connect_device(user_id, device_id)
	return {
		"device_id": device_id, 
		"status": f"{device.get('status')} connected with agent", 
		"name": device.get("name")
	}

async def disconnect_device(user_id):
	await agent_manager.disconnect_device(user_id)
	return {
		"device_id": "disconnected with agent"
	}