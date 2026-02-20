from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Request
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.security import HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from datetime import datetime, timedelta
import os
import aiofiles
import uuid
from pathlib import Path

from models import (
    LoginRequest, LoginResponse, User, UserCreate, UserResponse, UserUpdate,
    Company, CompanyCreate, Report, ReportCreate, ReportUpdate, 
    DashboardStats, ActivityLog, ActivityType, ReportStatus
)
from auth import (
    authenticate_user, create_access_token, get_current_user, get_admin_user,
    get_password_hash, get_client_ip
)
from database import get_database
from utils import log_activity, sanitize_filename, format_file_size

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/login", response_model=LoginResponse)
async def login(
    login_data: LoginRequest,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Authenticate user and return access token"""
    ip_address = get_client_ip(request)
    user_agent = request.headers.get("User-Agent", "Unknown")
    
    user = await authenticate_user(
        db, login_data.email, login_data.password, ip_address
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get company information
    company = await db.companies.find_one({"id": user["company_id"]})
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    # Create access token
    access_token_expires = timedelta(hours=24)
    access_token = create_access_token(
        data={"sub": user["email"], "user_id": user["id"]},
        expires_delta=access_token_expires
    )
    
    # Ensure all required fields exist with defaults
    user_data = {
        "id": user["id"],
        "email": user["email"],
        "full_name": user["full_name"],
        "company_id": user["company_id"],
        "role": user["role"],
        "active": user.get("active", True),
        "last_login": user.get("last_login"),
        "created_at": user.get("created_at", datetime.utcnow())
    }
    
    company_data = {
        "id": company["id"],
        "name": company["name"],
        "description": company.get("description"),
        "active": company.get("active", True),
        "created_at": company.get("created_at", datetime.utcnow()),
        "updated_at": company.get("updated_at", datetime.utcnow())
    }
    
    return LoginResponse(
        access_token=access_token,
        user=UserResponse(**user_data),
        company=Company(**company_data)
    )

@router.post("/logout")
async def logout(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Log user logout"""
    ip_address = get_client_ip(request)
    
    await log_activity(
        db, current_user.id, current_user.email, ActivityType.LOGOUT,
        f"User logged out: {current_user.email}", ip_address
    )
    
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(**current_user.dict())
