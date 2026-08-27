import uasyncio as asyncio
from services.device_id import get_device_info
from services.file_manager import Manager
manager = Manager()

async def handleResponse(client, terminal, response):
	message_type = response.get("type")
	request_id = response.get("request_id")
	request_type = response.get("request_type")
	if message_type in ("command", "cancel"):
		asyncio.create_task(
			terminal.handle_message(
				response,
				client.send_json
			)
		)
	elif message_type == "filesystem":
		await manager.file_operation(response, client)

	elif message_type == "details":
		device_info = get_device_info()
		await client.send_json({
			"type": "details",
			"request_id": response.get("request_id"),
			"request_type": response.get("request_type"),
			"data": device_info
		})


	