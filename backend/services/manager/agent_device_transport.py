import asyncio

class AgentDeviceTransport:

    def __init__(self):
        self.pending_requests = {}

    def create_pending_request(self, request_id):
        future = asyncio.get_running_loop().create_future()
        self.pending_requests[request_id] = {"future": future, "buffer": []}
        return future
    
    async def resolve_request(self, request_id, data):
        entry = self.pending_requests.get(request_id)
        if not entry:
            return

        if data.get("stream"):
            entry["buffer"].append(data.get("data", ""))
            return

        future = entry["future"]
        self.pending_requests.pop(request_id, None)
        if not future.done():
            future.set_result({"data": data.get("data", ""), "buffer": entry["buffer"]})

    def cancel_request(self, request_id):
        self.pending_requests.pop(request_id, None)


agent_device_transport = AgentDeviceTransport()