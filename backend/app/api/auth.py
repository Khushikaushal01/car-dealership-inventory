from fastapi import APIRouter

router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"]
)


@router.post("/register")
def register():
    return {"message": "User registered successfully"}
