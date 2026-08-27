from abc import ABC, abstractmethod

class LLMProvider(ABC):

    @abstractmethod
    async def stream(self, message, model):
        pass

    @abstractmethod
    async def model_list(self):
        pass