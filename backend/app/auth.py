from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime, timedelta, timezone
import bcrypt
from jose import jwt

from app.config import settings
from app.supabase_client import get_supabase

router = APIRouter(prefix="/api/auth", tags=["auth"])

# ── Schemas ──────────────────────────────────────────────────────

class AuthRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)
    password: str = Field(..., min_length=6)

class AuthResponse(BaseModel):
    token: str
    username: str
    user_id: str

# ── Helpers ──────────────────────────────────────────────────────

JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = 72

def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def _verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def _create_token(user_id: str, username: str) -> str:
    payload = {
        "sub": user_id,
        "username": username,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=JWT_ALGORITHM)

# ── Endpoints ────────────────────────────────────────────────────

@router.post("/signup", response_model=AuthResponse)
async def signup(body: AuthRequest):
    """Register a new user with username + password."""
    try:
        db = get_supabase()

        # Check if username already exists
        existing = (
            db.table("users")
            .select("id")
            .eq("username", body.username)
            .execute()
        )
        if existing.data:
            raise HTTPException(status_code=409, detail="Username already taken")

        # Insert new user
        password_hash = _hash_password(body.password)
        result = (
            db.table("users")
            .insert({"username": body.username, "password_hash": password_hash})
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create user")

        user = result.data[0]
        token = _create_token(user["id"], user["username"])

        return AuthResponse(token=token, username=user["username"], user_id=user["id"])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


@router.post("/signin", response_model=AuthResponse)
async def signin(body: AuthRequest):
    """Sign in with existing username + password."""
    try:
        db = get_supabase()

        result = (
            db.table("users")
            .select("*")
            .eq("username", body.username)
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        user = result.data[0]

        if not _verify_password(body.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid username or password")

        token = _create_token(user["id"], user["username"])

        return AuthResponse(token=token, username=user["username"], user_id=user["id"])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
