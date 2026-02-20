from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import User, TokenData, ActivityType
import os
from database import get_database
from utils import log_activity

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user_by_email(db: AsyncIOMotorDatabase, email: str) -> Optional[dict]:
    """Get user from database by email"""
    return await db.users.find_one({"email": email})

async def get_user_by_id(db: AsyncIOMotorDatabase, user_id: str) -> Optional[dict]:
    """Get user from database by ID"""
    return await db.users.find_one({"id": user_id})

async def authenticate_user(db: AsyncIOMotorDatabase, email: str, password: str, ip_address: str = None) -> Union[dict, bool]:
    """Authenticate user with email and password"""
    user = await get_user_by_email(db, email)
    if not user:
        # Log failed login attempt
        await log_activity(
            db, None, email, ActivityType.FAILED_LOGIN,
            f"Failed login attempt for {email} - user not found",
            ip_address
        )
        return False
    
    if not user.get("active", True):
        await log_activity(
            db, user["id"], email, ActivityType.FAILED_LOGIN,
            f"Failed login attempt for {email} - user inactive",
            ip_address
        )
        return False
    
    if not verify_password(password, user["hashed_password"]):
        await log_activity(
            db, user["id"], email, ActivityType.FAILED_LOGIN,
            f"Failed login attempt for {email} - invalid password",
            ip_address
        )
        return False
    
    # Update last login
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Log successful login
    await log_activity(
        db, user["id"], email, ActivityType.LOGIN,
        f"Successful login for {email}",
        ip_address
    )
    
    return user

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get current authenticated user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        if email is None or user_id is None:
            raise credentials_exception
        token_data = TokenData(email=email, user_id=user_id)
    except JWTError:
        raise credentials_exception
    
    user = await get_user_by_id(db, token_data.user_id)
    if user is None:
        raise credentials_exception
    
    if not user.get("active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive"
        )
    
    return User(**user)

async def get_user_from_token(token: str, db: AsyncIOMotorDatabase) -> Optional[User]:
    """Validate a JWT token string and return the user if valid"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        if email is None or user_id is None:
            return None
        
        user = await get_user_by_id(db, user_id)
        if user is None or not user.get("active", True):
            return None
        
        return User(**user)
    except JWTError:
        return None

async def get_admin_user(current_user: User = Depends(get_current_user)):
    """Ensure current user is an admin"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

def get_client_ip(request: Request) -> str:
    """Extract client IP address from request"""
    # Check for forwarded IP first (if behind proxy)
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    
    # Check for real IP header
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    # Fall back to direct client
    return request.client.host if request.client else "unknown"
