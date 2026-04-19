import re
from collections import Counter

from openai import OpenAI

from app.core.config import get_settings
from app.schemas.ai import MatchResponse

settings = get_settings()

TOKEN_PATTERN = re.compile(r"[A-Za-z][A-Za-z0-9+#.\-]{2,}")
STOPWORDS = {
    "about",
    "after",
    "also",
    "been",
    "being",
    "between",
    "build",
    "candidate",
    "company",
    "develop",
    "experience",
    "from",
    "have",
    "into",
    "job",
    "looking",
    "need",
    "required",
    "role",
    "strong",
    "team",
    "their",
    "they",
    "this",
    "with",
    "work",
    "years",
}


def _normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def extract_keywords(text: str, *, limit: int = 20) -> list[str]:
    tokens = TOKEN_PATTERN.findall(_normalize_text(text))
    filtered = [token for token in tokens if token not in STOPWORDS]
    token_counts = Counter(filtered)
    return [keyword for keyword, _ in token_counts.most_common(limit)]


def _default_suggestions(missing_keywords: list[str], score: int) -> list[str]:
    suggestions = []
    if missing_keywords:
        suggestions.append(
            f"Add measurable examples showing experience with {', '.join(missing_keywords[:5])}."
        )
    if score < 50:
        suggestions.append("Tailor your summary to mirror the target role and core responsibilities.")
    suggestions.append("Highlight outcomes, tools, and domain keywords in your most relevant bullet points.")
    return suggestions[:3]


def _generate_openai_suggestions(
    job_description: str,
    resume_text: str,
    missing_keywords: list[str],
) -> list[str]:
    if not settings.openai_api_key:
        return []

    client = OpenAI(api_key=settings.openai_api_key)
    prompt = (
        "You are improving a candidate resume for a job application. "
        "Return exactly three concise bullet-style suggestions as plain lines with no numbering. "
        f"Missing keywords: {', '.join(missing_keywords[:10]) or 'none'}\n\n"
        f"Job description:\n{job_description}\n\nResume:\n{resume_text}"
    )

    completion = client.responses.create(
        model=settings.openai_model,
        input=prompt,
    )
    content = completion.output_text.strip()
    return [line.lstrip("- ").strip() for line in content.splitlines() if line.strip()][:3]


def analyze_match(job_description: str, resume_text: str) -> MatchResponse:
    job_keywords = extract_keywords(job_description)
    resume_keywords = set(extract_keywords(resume_text, limit=40))
    matched_keywords = [keyword for keyword in job_keywords if keyword in resume_keywords]
    missing_keywords = [keyword for keyword in job_keywords if keyword not in resume_keywords]

    total_keywords = max(len(job_keywords), 1)
    score = round((len(matched_keywords) / total_keywords) * 100)

    suggestions = _default_suggestions(missing_keywords, score)
    try:
        openai_suggestions = _generate_openai_suggestions(
            job_description, resume_text, missing_keywords
        )
        if openai_suggestions:
            suggestions = openai_suggestions
    except Exception:
        pass

    return MatchResponse(
        match_score=score,
        matched_keywords=matched_keywords,
        missing_keywords=missing_keywords[:10],
        improvement_suggestions=suggestions,
    )
