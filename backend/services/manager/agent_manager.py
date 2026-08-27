from agent.agent import Agent


class AgentManager:

    def __init__(self):
        self.agents = {}

    def get_agent(self, user_id: int):
        if user_id not in self.agents:
            self.agents[user_id] = Agent()

        return self.agents[user_id]

    def remove_agent(self, user_id: int):
        self.agents.pop(user_id, None)


agent_manager = AgentManager()