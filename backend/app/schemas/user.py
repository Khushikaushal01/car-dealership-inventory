from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


class UserCreate(BaseModel):
    """
    Registration payload.  is_admin is intentionally absent — callers
    can never grant themselves admin privileges at sign-up.
    """
    username: str
    email: str
    # Enforce minimum password strength at the schema layer
    password: str = Field(..., min_length=8, description="Minimum 8 characters")


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    is_admin: bool
    role: str

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str