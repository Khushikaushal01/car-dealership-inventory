"""
JWT token utilities.

SECRET_KEY is loaded exclusively from the JWT_SECRET environment variable.
A missing variable raises ValueError at import time so the app fails fast
rather than running silently with an insecure or empty secret.
"""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt

# ---------------------------------------------------------------------------
# Configuration — fail loudly if JWT_SECRET is not set in the environment
# ---------------------------------------------------------------------------
_secret = os.getenv("JWT_SECRET")
if not _secret:
    raise ValueError(
        "JWT_SECRET environment variable is not set.  "
        "Add it to your .env file (see .env.example) and restart."
    )

SECRET_KEY: str = _secret
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Return a signed JWT encoding *data* with an expiry."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    """Decode and verify a JWT.  Returns the payload dict or None on failure."""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None
