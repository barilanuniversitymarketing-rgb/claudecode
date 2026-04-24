import json
from agents.llm import call_llm, DEFAULT_MODEL

SYSTEM_PROMPT = """אתה עוזר מומחה שמכיר היטב את אוניברסיטת בר-אילן.
תפקידך הוא לזהות לאיזה פקולטה ומחלקה שייכת תוכנית לימודים נתונה, ולמצוא את כתובת ה-URL של עמוד התוכנית באתר האוניברסיטה.
ענה תמיד בפורמט JSON בלבד, ללא טקסט נוסף."""

USER_PROMPT_TEMPLATE = """תוכנית הלימודים: "{program_name}"

מצא את הפקולטה, המחלקה וכתובת ה-URL של עמוד התוכנית באתר בר-אילן (biu.ac.il).
אם אינך בטוח ב-URL המדויק, נחש את הכתובת הסבירה ביותר על בסיס מבנה האתר הידוע.

החזר JSON בפורמט הבא בלבד:
{{
  "faculty": "שם הפקולטה בעברית",
  "department": "שם המחלקה בעברית",
  "program_url": "https://...",
  "confidence": "high|medium|low"
}}"""


def find_faculty(program_name: str, model: str = DEFAULT_MODEL) -> dict:
    """Use an LLM to identify faculty, department, and URL for a BIU program."""
    text = call_llm(
        model=model,
        system=SYSTEM_PROMPT,
        user=USER_PROMPT_TEMPLATE.format(program_name=program_name),
        max_tokens=512,
    )
    try:
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text)
    except json.JSONDecodeError:
        return {"faculty": None, "department": None, "program_url": None, "confidence": "low"}
