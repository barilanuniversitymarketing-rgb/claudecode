import json
import anthropic

client = anthropic.Anthropic()

SYSTEM_PROMPT = """אתה מבקר מבנה ותבניות תוכן.
תפקידך לוודא שתיאורי תוכניות לימודים עומדים בדרישות התבנית שהוגדרה על-ידי המשתמש.
ענה תמיד בפורמט JSON בלבד."""

USER_PROMPT = """## תוכן שנכתב:
{generated_content}

## דרישות התבנית (סעיפים):
{template_sections_text}

## משימה:
בדוק האם התוכן עומד בדרישות התבנית:
1. כל הסעיפים המסומנים "חובה" חייבים להופיע עם כותרת ## מתאימה
2. הסעיפים צריכים להופיע בסדר הנכון
3. כל סעיף צריך להכיל תוכן ממשי (לא ריק)

ענה בפורמט JSON:
{{
  "passed": true/false,
  "issues": ["בעיה 1", "בעיה 2", ...],
  "summary": "סיכום קצר"
}}"""


def _format_sections(sections: list[dict]) -> str:
    lines = []
    for i, sec in enumerate(sections, 1):
        req = "חובה" if sec.get("required") else "אופציונלי"
        lines.append(f"{i}. {sec['title']} ({req})")
    return "\n".join(lines)


def check_template(
    generated_content: str,
    template_sections: list[dict],
) -> dict:
    """Critique generated content for template compliance. Returns {passed, issues, summary}."""
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": USER_PROMPT.format(
                    generated_content=generated_content,
                    template_sections_text=_format_sections(template_sections),
                ),
            }
        ],
    )
    text = response.content[0].text.strip()
    try:
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text)
    except json.JSONDecodeError:
        return {"passed": True, "issues": [], "summary": "לא ניתן לנתח תשובה"}
