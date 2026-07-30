import bcrypt


def hash_password(password: str) -> str:
    # Ensure password fits within bcrypt's limit and is encoded as bytes
    password_bytes = password.encode('utf-8')
    # Generate salt with standard rounds (12)
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        password_bytes = password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception:
        return False