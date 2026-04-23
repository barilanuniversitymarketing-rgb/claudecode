import os


DEFAULT_MODEL = "claude-sonnet-4-6"

MODELS = {
    "claude-sonnet-4-6": {"provider": "anthropic", "label": "Claude Sonnet"},
    "gpt-4o":            {"provider": "openai",    "label": "GPT-4o"},
    "gemini-1.5-pro":    {"provider": "google",    "label": "Gemini 1.5 Pro"},
}


def call_llm(model: str, system: str, user: str, max_tokens: int = 2048) -> str:
    """Unified LLM call. Routes to the correct provider based on model id."""
    info = MODELS.get(model)
    if not info:
        raise ValueError(f"Unknown model '{model}'. Supported: {list(MODELS)}")

    provider = info["provider"]

    if provider == "anthropic":
        import anthropic
        client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
        response = client.messages.create(
            model=model,
            max_tokens=max_tokens,
            system=system,
            messages=[{"role": "user", "content": user}],
        )
        return response.content[0].text.strip()

    if provider == "openai":
        from openai import OpenAI
        client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
        response = client.chat.completions.create(
            model=model,
            max_tokens=max_tokens,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        )
        return response.choices[0].message.content.strip()

    if provider == "google":
        import google.generativeai as genai
        genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
        gemini = genai.GenerativeModel(
            model_name=model,
            system_instruction=system,
        )
        response = gemini.generate_content(user)
        return response.text.strip()

    raise ValueError(f"Unhandled provider '{provider}'")
