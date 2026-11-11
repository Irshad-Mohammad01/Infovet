"""
In-memory rate limiter to protect the contact submission endpoint against abuse/spam.
"""

from collections import defaultdict
import time
from typing import Optional

from fastapi import HTTPException, status

from app.config import settings


class InMemoryRateLimiter:
    def __init__(self) -> None:
        self._records: dict[str, list[float]] = defaultdict(list)

    def is_rate_limited(self, client_ip: Optional[str]) -> bool:
        if not client_ip:
            return False

        now = time.time()
        window = float(settings.rate_limit_window_seconds)
        max_requests = settings.rate_limit_max

        # Prune old timestamps
        history = self._records[client_ip]
        cutoff = now - window
        while history and history[0] < cutoff:
            history.pop(0)

        if len(history) >= max_requests:
            return True

        history.append(now)
        return False

    def check_rate_limit(self, client_ip: Optional[str]) -> None:
        if self.is_rate_limited(client_ip):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=(
                    f"Too many messages sent. Please wait before submitting again."
                ),
            )

    def clear(self) -> None:
        """Reset rate limiter (used primarily in testing)."""
        self._records.clear()


rate_limiter = InMemoryRateLimiter()
