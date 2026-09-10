import inspect
from services.device_registration import device_service
from services.user_register import user_register


class User_tools:
	"""
	Tools for the AI agent to manage the authenticated user's profile and devices.
	"""
	
	def __init__(self):
		self.user_id = None
		self.callbacks: dict = {}

	def set_user_id(self, user_id: str):
		self.user_id = user_id

	def set_callback(self, name: str, callback_function):
		self.callbacks[name] = callback_function

	def get_tools(self):
		return [
			self.get_my_profile,
			self.get_my_devices,
			self.disconnect_to_device,
			self.update_my_preferences,
			self.connect_to_device,
			self.check_device,
		]
	
	async def _safe_execute(self, func, error_msg, *args, **kwargs):
		if not self.user_id:
			return {"status": "error", "message": "Authentication required. User ID is not set."}
		
		try:
			result = func(*args, **kwargs)
			if inspect.isawaitable(result):
				result = await result
			if result is not None and result is not False:
				return {"status": "success", "data": result}
			return {"status": "error", "message": error_msg}
		except Exception as e:
			return {"status": "error", "message": f"Operation failed: {str(e)}"}

	async def _run_callback(self, name: str, error_msg: str, *args, **kwargs) -> dict:
		callback = self.callbacks.get(name)
		if not callback:
			return {"status": "error", "message": f"System callback '{name}' is not configured."}
		return await self._safe_execute(callback, error_msg, *args, **kwargs)

	async def connect_to_device(self, device_id: str) -> dict:
		"""Connects the AI agent to a specific IoT device to access its commands."""
		devices = (await self.get_my_devices()).get("data", [])
		if str(device_id) not in [str(d.get("device_id", d.get("id"))) for d in devices]:
			return {"status": "error", "message": f"Access denied to device {device_id}."}
		return await self._run_callback("connect", f"Failed to connect to device {device_id}.", device_id)

	async def disconnect_to_device(self) -> dict:
		"""
		Detaches the agent from the currently connected device and returns it to
		account-level tools (profile, device list, etc). Does NOT remove or unlink
		the device from the account — it stays registered and can be reconnected later.
		"""
		return await self._run_callback("disconnect", "Failed to leave the current device session.")

	async def check_device(self) -> dict:
		"""
		check whether any device is currently connected to the agent.
		"""
		return await self._run_callback("check_device", "No device is currently connected.")
	
	async def get_my_profile(self) -> dict:
		"""
		Retrieves the profile details of the currently logged-in user.
		Use this to find out the user's name, email, and account status.
		"""
		return await self._safe_execute(user_register.get_user_by_id, "User profile not found in the database.", self.user_id)

	async def get_my_devices(self) -> dict:
		"""
		Fetches a list of all IoT devices currently registered to or owned by the logged-in user.
		Use this to see what devices are connected to the user's account and their statuses.
		"""
		return await self._safe_execute(device_service.get_user_devices, "No devices found for this user account.", self.user_id)

	async def update_my_preferences(self, preferences: dict) -> dict:
		"""
		Updates the current user's profile information or account preferences.
		Pass a dictionary containing only the keys and values that need to be changed (e.g., {"name": "New Name"}).
		"""
		return await self._safe_execute(user_register.update_specific_columns, "User not found or no changes were made.", self.user_id, **preferences)


user_tool = User_tools()