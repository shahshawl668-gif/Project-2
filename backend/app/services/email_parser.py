from dataclasses import dataclass
from enum import Enum


class EmailSignal(str, Enum):
    APPLICATION_RECEIVED = "APPLICATION_RECEIVED"
    REJECTED = "REJECTED"
    INTERVIEW = "INTERVIEW"
    UNKNOWN = "UNKNOWN"


@dataclass
class ParsedEmailEvent:
    signal: EmailSignal
    confidence: float
    company_name: str | None = None
    raw_subject: str | None = None


class EmailParserService:
    """Phase-2 integration surface for Gmail and inbound email processing."""

    def parse(self, subject: str, body: str) -> ParsedEmailEvent:
        text = f"{subject}\n{body}".lower()
        if "application received" in text:
            return ParsedEmailEvent(EmailSignal.APPLICATION_RECEIVED, confidence=0.9, raw_subject=subject)
        if "regret to inform" in text or "unfortunately" in text:
            return ParsedEmailEvent(EmailSignal.REJECTED, confidence=0.8, raw_subject=subject)
        if "interview" in text:
            return ParsedEmailEvent(EmailSignal.INTERVIEW, confidence=0.7, raw_subject=subject)
        return ParsedEmailEvent(EmailSignal.UNKNOWN, confidence=0.2, raw_subject=subject)
