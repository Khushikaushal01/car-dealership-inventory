from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, Token
from app.core.security import hash_password, verify_password
from app.core.jwt import create_access_token, decode_token
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"]
)

# Use OAuth2PasswordBearer for extracting the token.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def get_current_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user


@router.post("/register")
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account.

    Security note: callers can never set their own role or is_admin flag.
    Every new account always starts as role='user', is_admin=False.
    To create an admin, update the DB directly after the fact.
    """
    # Check email uniqueness
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    # Check username uniqueness
    if db.query(User).filter(User.username == user_in.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # Security: all new registrations are always role='user', is_admin=False.
    # Admin privileges must be granted directly in the database after the fact.
    db_user = User(
        username=user_in.username,
        email=user_in.email,
        password=hash_password(user_in.password),
        role="user",
        is_admin=False,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User registered successfully"}


@router.post("/login")
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    """Authenticate and return a signed JWT plus basic user info."""
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    # Derive role: DB role column is authoritative; fall back to is_admin flag
    # for rows created before role column existed.
    role = user.role or ("admin" if user.is_admin else "user")

    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": role,
            "is_admin": bool(user.is_admin),
        }
    }
