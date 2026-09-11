from typing import Any
from groq import Groq

client = Groq()

MODEL_REGISTRY: dict[str, dict[str, Any]] = {}

def add_models(provider: str, models: dict[str, tuple[str, int, str, int]]) -> None:
    """Register model metadata: (model_name, rpm, tpm, rpd)."""
    for alias, (model_name, rpm, tpm, rpd) in models.items():
        MODEL_REGISTRY[alias] = {
            "provider": provider,
            "model_name": model_name,
            "rpm": rpm,
            "tpm": tpm,
            "rpd": rpd,
        }

# 1. Register Gemini models
add_models(
    "gemini",
    {
        "gemini-3.5-flash-lite": ("gemini-3.5-flash-lite", 15, "250K", 500),
        "gemini-3.1-flash-lite": ("gemini-3.1-flash-lite", 15, "250K", 500),
        "gemini-3.8-flash": ("gemini-3.8-flash", 5, "250K", 20),
        "gemini-3.7-flash": ("gemini-3.7-flash", 5, "250K", 20),
        "gemini-3.6-flash": ("gemini-3.6-flash", 5, "250K", 20),
        "gemini-3.5-flash": ("gemini-3.5-flash", 5, "250K", 20),
        "gemini-3-flash": ("gemini-3-flash", 5, "250K", 20),
        "gemini-2.5-flash": ("gemini-2.5-flash", 5, "250K", 20),
        "gemini-2.5-flash-lite": ("gemini-2.5-flash-lite", 10, "250K", 20),
    },
)

# 2. Register candidate Groq models
add_models(
    "groq",
    {
        # Primary LLM / Reasoning models
        "gpt-oss-120b": ("openai/gpt-oss-120b", 30, "8K", 1000),
        "gpt-oss-20b": ("openai/gpt-oss-20b", 30, "8K", 1000),
    },
)

# Recommended default model alias from your active set
DEFAULT_MODEL_ALIAS = "gemini-3.5-flash-lite"

# 3. Dynamic verification against active Groq API endpoints
def sync_and_validate_groq_models() -> list[str]:
    """Fetch active Groq models and remove any unavailable model names from registry."""
    try:
        active_models = {m.id for m in client.models.list().data}
        print(active_models)
    except Exception as e:
        print(f"Warning: Could not fetch Groq models ({e}). Keeping registry static.")
        return []

    unsupported_aliases = []
    for alias, config in list(MODEL_REGISTRY.items()):
        if config["provider"] == "groq" and config["model_name"] not in active_models:
            unsupported_aliases.append(alias)
            del MODEL_REGISTRY[alias]

    if unsupported_aliases:
        print(f"Removed inactive Groq aliases from registry: {unsupported_aliases}")

    return list(active_models)


def get_model_config(alias: str) -> dict[str, Any]:
    config = MODEL_REGISTRY.get(alias)
    if not config:
        available = ", ".join(MODEL_REGISTRY.keys())
        raise ValueError(f"Invalid model alias '{alias}'. Available: {available}")
    return config


def list_available_models(provider: str | None = None) -> list[str]:
    if provider is None:
        return list(MODEL_REGISTRY.keys())

    provider = provider.lower()
    return [
        alias
        for alias, config in MODEL_REGISTRY.items()
        if config["provider"].lower() == provider
    ]


# Initialize validation on startup
active_groq_ids = sync_and_validate_groq_models()