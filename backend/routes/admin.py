from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Request
from fastapi.responses import HTMLResponse, FileResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from datetime import datetime
import os
import aiofiles
import uuid
import shutil
import zipfile
from pathlib import Path

from models import (
    User, UserCreate, UserResponse, UserUpdate,
    Company, CompanyCreate, Report, ReportCreate, ReportUpdate, 
    DashboardStats, ActivityLog, ActivityType, ReportStatus,
    FileUploadResponse
)
from auth import get_admin_user, get_password_hash, get_client_ip
from database import get_database
from utils import log_activity, sanitize_filename, format_file_size
from email_service import send_email, send_email_bulk, get_welcome_email_html, get_new_report_email_html

router = APIRouter(prefix="/api/admin", tags=["admin"])

# Portal URL for email links
PORTAL_URL = os.environ.get("PORTAL_URL", "https://secure-report-viewer.preview.emergentagent.com")

# File storage configuration
UPLOAD_DIR = Path("/app/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_FILE_TYPES = ["html", "pdf", "png", "jpg", "jpeg", "gif", "csv", "xlsx", "docx", "zip"]

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    admin_user: User = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get dashboard statistics for admin"""
    # Get counts
    total_companies = await db.companies.count_documents({"active": True})
    total_users = await db.users.count_documents({"active": True})
    total_reports = await db.reports.count_documents({"status": ReportStatus.PUBLISHED})
    total_access_logs = await db.activity_logs.count_documents({})
    
    # Get recent activities
    recent_activities_cursor = db.activity_logs.find().sort("timestamp", -1).limit(10)
    recent_activities = await recent_activities_cursor.to_list(length=10)
    
    return DashboardStats(
        total_companies=total_companies,
        total_users=total_users,
        total_reports=total_reports,
        total_access_logs=total_access_logs,
        recent_activities=[ActivityLog(**activity) for activity in recent_activities]
    )

# Company Management
@router.post("/companies", response_model=Company)
async def create_company(
    company_data: CompanyCreate,
    request: Request,
    admin_user: User = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new company"""
    # Check if company already exists
    existing = await db.companies.find_one({"name": company_data.name})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company with this name already exists"
        )
    
    company = Company(**company_data.dict())
    await db.companies.insert_one(company.dict())
    
    # Log activity
    await log_activity(
        db, admin_user.id, admin_user.email, ActivityType.COMPANY_CREATE,
        f"Created company: {company.name}", get_client_ip(request)
    )
    
    return company

@router.get("/companies", response_model=List[Company])
async def get_companies(
    admin_user: User = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all companies"""
    companies = await db.companies.find().to_list(length=None)
    return [Company(**company) for company in companies]

# User Management
@router.post("/users", response_model=UserResponse)
async def create_user(
    user_data: UserCreate,
    request: Request,
    send_notification: bool = False,
    admin_user: User = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new user. Set send_notification=true to email credentials."""
    # Check if user already exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Verify company exists
    company = await db.companies.find_one({"id": user_data.company_id})
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    # Store original password before hashing (for email notification)
    original_password = user_data.password
    
    # Create user with hashed password
    user_dict = user_data.dict()
    hashed_password = get_password_hash(user_dict.pop("password"))
    user_dict["hashed_password"] = hashed_password
    
    user = User(**user_dict)
    await db.users.insert_one(user.dict())
    
    # Log activity
    await log_activity(
        db, admin_user.id, admin_user.email, ActivityType.USER_CREATE,
        f"Created user: {user.email} for company: {company['name']}",
        get_client_ip(request)
    )
    
    # Send welcome email if requested
    if send_notification:
        html_content = get_welcome_email_html(
            user_name=user.full_name,
            user_email=user.email,
            password=original_password,
            company_name=company['name'],
            portal_url=PORTAL_URL
        )
        await send_email(
            recipient_email=user.email,
            subject="Bienvenido al Portal de Clientes - InsightPlace",
            html_content=html_content
        )
    
    return UserResponse(**user.dict())

@router.get("/users", response_model=List[UserResponse])
async def get_users(
    company_id: Optional[str] = None,
    admin_user: User = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all users, optionally filtered by company"""
    filter_query = {}
    if company_id:
        filter_query["company_id"] = company_id
    
    users = await db.users.find(filter_query).to_list(length=None)
    return [UserResponse(**user) for user in users]

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    request: Request,
    admin_user: User = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Delete a user"""
    # Find user
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent deleting yourself
    if user["id"] == admin_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    # Delete user
    await db.users.delete_one({"id": user_id})
    
    # Log activity
    await log_activity(
        db, admin_user.id, admin_user.email, ActivityType.USER_DELETE,
        f"Deleted user: {user['email']}",
        get_client_ip(request)
    )
    
    return {"message": "User deleted successfully"}

@router.delete("/companies/{company_id}")
async def delete_company(
    company_id: str,
    request: Request,
    admin_user: User = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Delete a company and all associated users and reports"""
    # Find company
    company = await db.companies.find_one({"id": company_id})
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    # Check if admin belongs to this company
    if admin_user.company_id == company_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own company"
        )
    
    # Delete all users in this company
    await db.users.delete_many({"company_id": company_id})
    
    # Delete all reports for this company
    await db.reports.delete_many({"company_id": company_id})
    
    # Delete company
    await db.companies.delete_one({"id": company_id})
    
    # Log activity
    await log_activity(
        db, admin_user.id, admin_user.email, ActivityType.COMPANY_DELETE,
        f"Deleted company: {company['name']} and all associated data",
        get_client_ip(request)
    )
    
    return {"message": "Company deleted successfully"}

# Report Management
@router.post("/reports/upload")
async def upload_report(
    request: Request,
    admin_user: User = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
    title: str = Form(...),
    description: str = Form(""),
    company_id: str = Form(...),
    allow_download: str = Form("false"),
    notify_users: str = Form("false"),
    files: List[UploadFile] = File(...)
):
    """Upload report files. Set notify_users=true to email all company users."""
    # Verify company exists
    company = await db.companies.find_one({"id": company_id})
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    # Parse boolean values
    allow_download_bool = allow_download.lower() == "true"
    notify_users_bool = notify_users.lower() == "true"
    
    # Create company directory
    company_dir = UPLOAD_DIR / sanitize_filename(company["name"]) / sanitize_filename(title)
    company_dir.mkdir(parents=True, exist_ok=True)
    
    uploaded_files = []
    main_file = None
    total_size = 0
    
    for file in files:
        if not file.filename:
            continue
            
        # Validate file type
        file_ext = file.filename.split('.')[-1].lower()
        if file_ext not in ALLOWED_FILE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type .{file_ext} not allowed"
            )
        
        # Save file
        safe_filename = sanitize_filename(file.filename)
        file_path = company_dir / safe_filename
        
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
            total_size += len(content)
        
        # Handle ZIP files - extract them
        if file_ext == 'zip':
            try:
                with zipfile.ZipFile(file_path, 'r') as zip_ref:
                    zip_ref.extractall(company_dir)
                
                # Find all extracted files
                for extracted_file in company_dir.rglob('*'):
                    if extracted_file.is_file() and extracted_file != file_path:
                        # Skip macOS metadata files and __MACOSX folder
                        if '__MACOSX' in str(extracted_file) or extracted_file.name.startswith('._'):
                            continue
                        
                        relative_path = str(extracted_file.relative_to(UPLOAD_DIR))
                        uploaded_files.append(relative_path)
                        
                        # Set main file if it's Main.html or index.html (preferred names)
                        if extracted_file.suffix.lower() == '.html' and not main_file:
                            if extracted_file.name.lower() in ['main.html', 'index.html']:
                                main_file = relative_path
                
                # If no Main.html or index.html found, pick first HTML file
                if not main_file:
                    for f in uploaded_files:
                        if f.lower().endswith('.html'):
                            main_file = f
                            break
                
                # Remove the ZIP file after extraction
                file_path.unlink()
            except Exception as e:
                # If extraction fails, keep the ZIP as is
                uploaded_files.append(str(file_path.relative_to(UPLOAD_DIR)))
        else:
            uploaded_files.append(str(file_path.relative_to(UPLOAD_DIR)))
            
            # Set main file if it's HTML
            if file_ext == 'html' and not main_file:
                main_file = str(file_path.relative_to(UPLOAD_DIR))
    
    if not main_file:
        main_file = uploaded_files[0] if uploaded_files else ""
    
    # Create report record
    report = Report(
        title=title,
        description=description,
        company_id=company_id,
        main_file=main_file,
        supporting_files=[f for f in uploaded_files if f != main_file],
        file_size=total_size,
        allow_download=allow_download_bool,
        uploaded_by=admin_user.id,
        status=ReportStatus.PUBLISHED
    )
    
    await db.reports.insert_one(report.dict())
    
    # Log activity
    await log_activity(
        db, admin_user.id, admin_user.email, ActivityType.REPORT_UPLOAD,
        f"Uploaded report '{title}' for {company['name']}",
        get_client_ip(request),
        metadata={"report_id": report.id, "file_count": len(uploaded_files)}
    )
    
    # Send notifications to company users if requested
    notifications_sent = 0
    if notify_users_bool:
        company_users = await db.users.find({"company_id": company_id}).to_list(length=None)
        for user in company_users:
            html_content = get_new_report_email_html(
                user_name=user.get("full_name", "Usuario"),
                report_title=title,
                company_name=company["name"],
                portal_url=PORTAL_URL
            )
            await send_email(
                recipient_email=user["email"],
                subject=f"Nuevo Reporte Disponible: {title}",
                html_content=html_content
            )
            notifications_sent += 1
    
    return {
        "message": "Report uploaded successfully",
        "report_id": report.id,
        "files_uploaded": len(uploaded_files),
        "total_size": format_file_size(total_size),
        "notifications_sent": notifications_sent
    }

@router.get("/reports", response_model=List[Report])
async def get_reports(
    admin_user: User = Depends(get_admin_user),
    company_id: Optional[str] = None,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all reports, optionally filtered by company"""
    filter_query = {}
    if company_id:
        filter_query["company_id"] = company_id
    
    reports = await db.reports.find(filter_query).sort("created_at", -1).to_list(length=None)
    return [Report(**report) for report in reports]

# Activity Logs
@router.get("/activity-logs", response_model=List[ActivityLog])
async def get_activity_logs(
    admin_user: User = Depends(get_admin_user),
    limit: int = 100,
    user_id: Optional[str] = None,
    activity_type: Optional[str] = None,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get activity logs"""
    filter_query = {}
    if user_id:
        filter_query["user_id"] = user_id
    if activity_type:
        filter_query["activity_type"] = activity_type
    
    logs = await db.activity_logs.find(filter_query).sort("timestamp", -1).limit(limit).to_list(length=limit)
    return [ActivityLog(**log) for log in logs]
