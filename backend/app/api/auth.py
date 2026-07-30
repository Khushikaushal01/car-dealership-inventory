from fastapi import APIRouter

router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"]
)


@router.post("/register")
def register():
    return {"message": "User registered successfully"}


@router.post("/login")
def login():
    return {
        "access_token": "dummy_token",
        "token_type": "bearer"
    }
