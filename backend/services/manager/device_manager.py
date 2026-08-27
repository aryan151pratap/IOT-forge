import asyncio
from datetime import datetime
from fastapi import WebSocket
from services.device_sql_service import device_service

class DeviceManager:

	def __init__(self):
		self.devices = {}
		self.pending_requests = {}
		self.user_events = {}

	def register(self, device_id, name, websocket):
		self.devices[device_id] = {
			"name": name,
			"websocket": websocket,
			"user_id": None,
			"status": "online",
			"last_seen": datetime.now()
		}
		self.user_events[device_id] = asyncio.Event()
		device_service.update_status(device_id, "online")

	def assign_user(self, device_id, user_id):
		device = self.devices.get(device_id)
		if not device:
			return False
		device["user_id"] = user_id
		
		event = self.user_events.get(device_id)
		if event:
			event.set()
		return True

	async def wait_for_user(self, device_id):
		event = self.user_events.get(device_id)

		if not event:
			return None

		await event.wait()
		return self.get_user_id(device_id)
	
	def get_user_id(self, device_id):
		device = self.devices.get(device_id)

		if not device:
			return None

		return device["user_id"]

	def unregister(self, device_id, websocket):
		device = self.devices.get(device_id)

		if not device:
			return

		if device["websocket"] is websocket:
			device["status"] = "offline"
			device["websocket"] = None
			device["last_seen"] = datetime.now()
		device_service.update_status(device_id, "offline")

	def get_websocket(self, device_id):
		device = self.devices.get(device_id)

		if device and device["status"] == "online":
			return device["websocket"]

		return None

	def is_current_connection(self, device_id, websocket: WebSocket):
		return websocket == self.get_websocket(device_id)

	def create_pending_request(self, request_id):
		future = asyncio.get_running_loop().create_future()
		self.pending_requests[request_id] = future
		return future

	def resolve_request(self, request_id, data):
		future = self.pending_requests.pop(request_id, None)

		if future and not future.done():
			future.set_result(data)

	def cancel_request(self, request_id):
		self.pending_requests.pop(request_id, None)

	def get_device(self, device_id):
		return self.devices.get(device_id)

	def get_connected_devices(self):
		return [
			{
				"device_id": device_id,
				"name": data["name"],
				"user_id": data["user_id"],
				"status": data["status"],
				"last_seen": data["last_seen"]
			}
			for device_id, data in self.devices.items()
			if data["status"] == "online"
		]


manager = DeviceManager()