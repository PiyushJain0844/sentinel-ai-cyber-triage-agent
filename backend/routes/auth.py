import secrets
import time
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel

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

# Prototype in-memory session token store
# Note: For production enterprise scale, use JWT with asymmetric RSA/ECDSA signing or Redis cluster
ACTIVE_SESSIONS: Dict[str, Dict[str, Any]] = {}

# Recognized Enterprise SOC Demo Accounts
AUTHORIZED_ACCOUNTS = {
    "analyst@sentinel.cyber": {
        "password": "Sentinel@2026!",
        "profile": {
            "id": "USR-SEC-091",
            "name": "Sarah Connor",
            "email": "analyst@sentinel.cyber",
            "role": "Senior SOC Lead Analyst",
            "clearance": "Level 4 (Top Secret / SCI)"
        }
    },
    "admin@sentinel.cyber": {
        "password": "SentinelAdmin#1",
        "profile": {
            "id": "USR-SEC-001",
            "name": "Marcus Vance",
            "email": "admin@sentinel.cyber",
            "role": "SecOps Director",
            "clearance": "Level 5 (Directorate Access)"
        }
    }
}

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    email = request.email.strip().lower()
    password = request.password.strip()

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required.")

    # Validate against authorized accounts or allow valid enterprise email format for demo
    user_record = AUTHORIZED_ACCOUNTS.get(email)
    
    if user_record:
        if user_record["password"] != password:
            raise HTTPException(
                status_code=401, 
                detail="Invalid credentials. Please verify your enterprise email and password."
            )
        profile_data = user_record["profile"]
    else:
        # Check basic email structure (name@domain.ext)
        if "@" not in email or "." not in email.split("@")[-1] or len(password) < 6:
            raise HTTPException(
                status_code=401,
                detail="Invalid enterprise credentials. Please check your credentials or use the Demo Login option."
            )
        # Create ad-hoc analyst profile for custom demo users
        name_part = email.split("@")[0].replace(".", " ").title()
        profile_data = {
            "id": f"USR-SOC-{secrets.token_hex(3).upper()}",
            "name": name_part,
            "email": email,
            "role": "Security Operations Analyst",
            "clearance": "Level 3 (Enterprise SOC Access)"
        }

    # Generate cryptographically secure session token
    token = f"stnl_{secrets.token_hex(24)}"
    duration = 86400 * 7 if request.remember_me else 86400  # 7 days or 24 hours
    expires_at = int(time.time()) + duration

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
    session = ACTIVE_SESSIONS.get(token)

    if not session:
        raise HTTPException(status_code=401, detail="Session expired or invalid. Please sign in again.")
    
    if time.time() > session["expires_at"]:
        ACTIVE_SESSIONS.pop(token, None)
        raise HTTPException(status_code=401, detail="Session has expired. Please re-authenticate.")

    return {
        "status": "valid",
        "user": session["user"],
        "expires_at": session["expires_at"]
    }

@router.post("/logout")
def logout(authorization: Optional[str] = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1].strip()
        ACTIVE_SESSIONS.pop(token, None)
    return {"status": "logged_out", "message": "Enterprise session terminated successfully."}
