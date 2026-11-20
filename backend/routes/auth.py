import secrets
import time
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel

from backend.database.db import get_db, verify_password, hash_password, seed_demo_users

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: Optional[bool] = False

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    role: str
    clearance: str

class LoginResponse(BaseModel):
    token: str
    user: UserProfile
    expires_at: int
    session_mode: str

# In-memory session cache for fast lookup
ACTIVE_SESSIONS: Dict[str, Dict[str, Any]] = {}

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    email = request.email.strip().lower()
    password = request.password.strip()

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required.")

    # 1. Query user from SQLite database with fallback seeding
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Ensure demo users are present
        cursor.execute("SELECT COUNT(*) FROM users")
        if cursor.fetchone()[0] == 0:
            seed_demo_users(conn)

        cursor.execute("SELECT * FROM users WHERE LOWER(email) = ?", (email,))
        user_row = cursor.fetchone()

        if user_row:
            user_data = dict(user_row)
            if not verify_password(password, user_data["password_hash"], user_data["salt"]):
                raise HTTPException(
                    status_code=401, 
                    detail="Invalid credentials. Please verify your enterprise email and password."
                )
            profile_data = {
                "id": user_data["id"],
                "name": user_data["name"],
                "email": user_data["email"],
                "role": user_data["role"],
                "clearance": user_data["clearance"]
            }
        else:
            # Check basic email structure for custom evaluation demo access
            if "@" not in email or "." not in email.split("@")[-1] or len(password) < 6:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid enterprise credentials. Please check your credentials or use the Demo Login option."
                )
            
            # Create persistent ad-hoc analyst profile for custom demo evaluation accounts
            name_part = email.split("@")[0].replace(".", " ").title()
            user_id = f"USR-SOC-{secrets.token_hex(3).upper()}"
            pwd_hash, salt = hash_password(password)
            role = "Security Operations Analyst"
            clearance = "Level 3 (Enterprise SOC Access)"

            cursor.execute(
                """
                INSERT INTO users (id, name, email, password_hash, salt, role, clearance)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (user_id, name_part, email, pwd_hash, salt, role, clearance)
            )
            profile_data = {
                "id": user_id,
                "name": name_part,
                "email": email,
                "role": role,
                "clearance": clearance
            }

        # 2. Generate cryptographically secure session token and store in user_sessions
        token = f"stnl_{secrets.token_hex(24)}"
        duration = 86400 * 7 if request.remember_me else 86400  # 7 days or 24 hours
        expires_at = int(time.time()) + duration

        cursor.execute(
            """
            INSERT OR REPLACE INTO user_sessions (token, user_id, expires_at, remember_me)
            VALUES (?, ?, ?, ?)
            """,
            (token, profile_data["id"], expires_at, 1 if request.remember_me else 0)
        )

    session_entry = {
        "token": token,
        "user": profile_data,
        "expires_at": expires_at,
        "remember_me": request.remember_me
    }
    ACTIVE_SESSIONS[token] = session_entry

    return LoginResponse(
        token=token,
        user=UserProfile(**profile_data),
        expires_at=expires_at,
        session_mode="persistent" if request.remember_me else "session"
    )

@router.get("/verify")
def verify_session(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication token missing or invalid.")
    
    token = authorization.split(" ")[1].strip()
    current_time = int(time.time())

    # 1. Check in-memory session cache first
    session = ACTIVE_SESSIONS.get(token)
    if session:
        if current_time > session["expires_at"]:
            ACTIVE_SESSIONS.pop(token, None)
            with get_db() as conn:
                conn.cursor().execute("DELETE FROM user_sessions WHERE token = ?", (token,))
            raise HTTPException(status_code=401, detail="Session has expired. Please re-authenticate.")
        return {
            "status": "valid",
            "user": session["user"],
            "expires_at": session["expires_at"]
        }

    # 2. Query persistent SQLite database across serverless cold starts / multi-process restarts
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT s.token, s.expires_at, s.remember_me, u.id, u.name, u.email, u.role, u.clearance
            FROM user_sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.token = ?
            """,
            (token,)
        )
        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=401, detail="Session expired or invalid. Please sign in again.")
        
        session_row = dict(row)
        if current_time > session_row["expires_at"]:
            cursor.execute("DELETE FROM user_sessions WHERE token = ?", (token,))
            raise HTTPException(status_code=401, detail="Session has expired. Please re-authenticate.")

        user_profile = {
            "id": session_row["id"],
            "name": session_row["name"],
            "email": session_row["email"],
            "role": session_row["role"],
            "clearance": session_row["clearance"]
        }

        # Repopulate memory cache
        ACTIVE_SESSIONS[token] = {
            "token": token,
            "user": user_profile,
            "expires_at": session_row["expires_at"],
            "remember_me": bool(session_row["remember_me"])
        }

        return {
            "status": "valid",
            "user": user_profile,
            "expires_at": session_row["expires_at"]
        }

@router.post("/logout")
def logout(authorization: Optional[str] = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1].strip()
        ACTIVE_SESSIONS.pop(token, None)
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM user_sessions WHERE token = ?", (token,))
    return {"status": "logged_out", "message": "Enterprise session terminated successfully."}
