import os
import asyncio

class Manager:

	def __init__(self):
		pass

	def res_back(self, type, request_id, request_type, data, path, operation, stream = False):
		return {
			"type": type,
			"request_id": request_id,
			"request_type": request_type,
			"data": data,
			"path": path,
			"stream": stream,
			"operation": operation
		}

	async def file_operation(self, response, client):
		print(response)
		type = response.get("type")
		operation = response.get("operation")
		request_id = response.get("request_id")
		request_type = response.get("request_type")
		path = response.get("path")
		if operation == "list_folder":
			folders = await self.read_folder(path)
			print(folders)
			response_data = self.res_back(type, request_id, request_type, folders, path, operation)
			await client.send_json(response_data)

		elif operation == "read_file":
			await self.read_file(response, client)

	async def read_folder(self, path="/"):
		entries = []
		for name, type_, *_ in os.ilistdir(path):
			full_path = (path.rstrip("/") + "/" + name) if path != "/" else "/" + name
			entries.append({
				"name": name,
				"path": full_path,
				"type": "folder" if type_ == 0x4000 else "file",
			})
		return entries

	async def read_file(self, response, client):
		type = response.get("type")
		request_id = response.get("request_id")
		request_type = response.get("request_type")
		path = response.get("path")
		operation = response.get("operation")
		try:
			with open(path, "r") as f:
				for line in f:
					await client.send_json({
						"type": type,
						"data": line,
						"request_id": request_id,
						"request_type": request_type,
						"path": path,
						"stream": True,
						"operation": operation
					})

			await client.send_json({
				"type": type,
				"data": "",
				"request_id": request_id,
				"request_type": request_type,
				"stream": False,
				"path": path,
				"operation": operation
			})

		except Exception as e:
			await client.send_json({
				"type": "error",
				"request_id": request_id,
				"request_type": request_type,
				"data": str(e),
				"path": path,
				"stream": False,
				"operation": operation
			})