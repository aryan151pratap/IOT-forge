import sys
import uasyncio as asyncio

from services import device

USER_PATH = "/esp32_client/user"

if USER_PATH not in sys.path:
    sys.path.append(USER_PATH)

class RunnerManager:

    def __init__(self):
        self.task = None

    async def start(self, client):
        if self.task:
            return

        try:
            device.init(client)
            if "runner" in sys.modules:
                del sys.modules["runner"]
            import runner
            self.task = asyncio.create_task(
                runner.main()
            )
            print("runner.py started")

        except Exception as e:
            print("Runner error:", e)

    async def stop(self):
        if self.task:
            self.task.cancel()
            self.task = None

        print("runner.py stopped")

    async def restart(self, client):
        await self.stop()
        await self.start(client)

    def handle_message(self, data):
        device.set_message(data)


runner_manager = RunnerManager()