from agents.llm import call_llm, DEFAULT_MODEL

SYSTEM_PROMPT = """אתה כותב תוכן מקצועי ומיומן המתמחה בכתיבה עברית אקדמית.
תפקידך לכתוב תיאורים משכנעים ואינפורמטיביים של תוכניות לימודים באוניברסיטת בר-אילן,
המיועדים לפלטפורמות חיצוניות (GEO) כדי לעודד סטודנטים פוטנציאליים להירשם.
כתוב תמיד בעברית תקינה ומקצועית, בנוסח שיווקי-אקדמי מאוזן."""


def build_template_instructions(sections: list[dict]) -> str:
    lines = ["כתוב את התוכן לפי הסעיפים הבאים (בדיוק בסדר זה):"]
    for i, sec in enumerate(sections, 1):
        req = "חובה" if sec.get("required") else "אופציונלי"
        lines.append(f"{i}. ## {sec['title']} ({req})")
        lines.append(f"   הנחיה: {sec['description']}")
    return "\n".join(lines)


def write_content(
    program_name: str,
    raw_scraped_content: str,
    template_sections: list[dict],
    correction_prompt: str | None = None,
    model: str = DEFAULT_MODEL,
) -> str:
    """Generate Hebrew program summary using the selected LLM."""
    template_instructions = build_template_instructions(template_sections)

    correction_note = ""
    if correction_prompt:
        correction_note = f"""
## תיקון נדרש
המשתמש ביקש לתקן את הגרסה הקודמת:
{correction_prompt}

שים לב לתקן את הנקודות הנ"ל בגרסה החדשה.
"""

    user_message = f"""## תוכנית הלימודים: {program_name}

## מידע שנאסף מאתר בר-אילן:
{raw_scraped_content[:8000]}

{correction_note}

## הוראות כתיבה:
{template_instructions}

כתוב את התיאור בעברית בלבד. השתמש בכותרות Markdown (##) עבור כל סעיף.
הסעיפים המסומנים כחובה חייבים להופיע. סעיפים אופציונליים יש לכלול רק אם יש מידע רלוונטי.
אורך מומלץ: 400-700 מילים סה"כ."""

    return call_llm(model=model, system=SYSTEM_PROMPT, user=user_message, max_tokens=2048)
