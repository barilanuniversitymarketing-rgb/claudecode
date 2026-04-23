export const MODELS = [
  {
    id: "claude-sonnet-4-6",
    label: "Claude",
    sublabel: "Sonnet · Anthropic",
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#e9d5ff",
  },
  {
    id: "gpt-4o",
    label: "ChatGPT",
    sublabel: "GPT-4o · OpenAI",
    color: "#059669",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    id: "gemini-1.5-pro",
    label: "Gemini",
    sublabel: "1.5 Pro · Google",
    color: "#dc2626",
    bg: "#fff1f2",
    border: "#fecdd3",
  },
];

export const DEFAULT_MODEL = "claude-sonnet-4-6";

export function getModel(id) {
  return MODELS.find((m) => m.id === id) || MODELS[0];
}
