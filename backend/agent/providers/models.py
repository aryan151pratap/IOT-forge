from typing import Any

MODEL_REGISTRY: dict[str, dict[str, Any]] = {}

def add_models(provider: str, models: dict[str, tuple[str, int, str, int]],):
    for alias, (model_name, rpm, tpm, rpd) in models.items():
        MODEL_REGISTRY[alias] = {
            "provider": provider,
            "model_name": model_name,
            "rpm": rpm,
            "tpm": tpm,
            "rpd": rpd,
        }


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

add_models(
    "groq",
    {
        "llama-3.3-70b": ("llama-3.3-70b-versatile", 30, "100K", 1000),
        "llama-3.1-8b": ("llama-3.1-8b-instant", 30, "100K", 1000),
        "gpt-oss-120b": ("openai/gpt-oss-120b", 30, "100K", 1000),
        "gpt-oss-20b": ("openai/gpt-oss-20b", 30, "100K", 1000),
    },
)


DEFAULT_MODEL_ALIAS = "gemini-3.5-flash-lite"


def get_model_config(alias: str) -> dict[str, Any]:
    config = MODEL_REGISTRY.get(alias)

    if not config:
        available = ", ".join(MODEL_REGISTRY)
        raise ValueError(
            f"Invalid model alias '{alias}'. Available: {available}"
        )

    return config


def list_available_models(provider: str | None = None) -> list[str]:
    print(MODEL_REGISTRY)
    if provider is None:
        return list(MODEL_REGISTRY)

    provider = provider.lower()

    return [
        alias
        for alias, config in MODEL_REGISTRY.items()
        if config["provider"].lower() == provider
    ]