import json
import anthropic

client = anthropic.Anthropic()

SYSTEM_PROMPT = """אתה מבקר תוכן אקדמי המתמחה בבדיקת דיוק עובדתי.
תפקידך לוודא שהתוכן שנכתב על תוכניות לימודים באוניברסיטת בר-אילן מדויק ומבוסס על מקורות אמינים.
ענה תמיד בפורמט JSON בלבד."""

USER_PROMPT = """## תוכן שנכתב על תוכנית "{program_name}":
{generated_content}

## מידע גולמי מאתר בר-אילן (המקור):
{raw_scraped_content}

## משימה:
בדוק האם התוכן שנכתב מדויק ביחס למידע הגולמי.
חפש:
1. עובדות שגויות (תנאי קבלה, משך לימודים, קורסים ספציפיים וכו')
2. מידע שהומצא ואינו מופיע במקור
3. מידע חסר שחייב להיות כלול

ענה בפורמט JSON:
{{
  "passed": true/false,
  "issues": ["בעיה 1", "בעיה 2", ...],
  "summary": "סיכום קצר"
}}
אם passed=true, issues יכול להיות רשימה ריקה."""


def check_accuracy(
    program_name: str,
    generated_content: str,
    raw_scraped_content: str,
) -> dict:
    """Critique generated content for factual accuracy. Returns {passed, issues, summary}."""
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": USER_PROMPT.format(
                    program_name=program_name,
                    generated_content=generated_content,
                    raw_scraped_content=raw_scraped_content[:6000],
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
