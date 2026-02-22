from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.responses import HTMLResponse, FileResponse, StreamingResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from pathlib import Path
from datetime import datetime, timedelta
import aiofiles
import os
import secrets
import hashlib
import unicodedata

from models import User, Report, Company, ActivityType
from auth import get_current_user, get_client_ip, get_user_from_token
from database import get_database
from utils import log_activity

router = APIRouter(prefix="/api/client", tags=["client"])

UPLOAD_DIR = Path("/app/uploads")

def normalize_path(path_str: str) -> str:
    """Normalize Unicode characters in path to handle Mac NFD vs NFC differences"""
    return unicodedata.normalize('NFD', path_str)

# Store for temporary view tokens (in production, use Redis)
view_tokens = {}

def generate_view_token(user_id: str, report_id: str) -> str:
    """Generate a short-lived token for secure viewing"""
    token = secrets.token_urlsafe(32)
    expiry = datetime.utcnow() + timedelta(minutes=30)  # Token valid for 30 minutes
    view_tokens[token] = {
        "user_id": user_id,
        "report_id": report_id,
        "expiry": expiry
    }
    return token

def validate_view_token(token: str, report_id: str) -> bool:
    """Validate a view token"""
    if token not in view_tokens:
        return False
    
    token_data = view_tokens[token]
    if token_data["report_id"] != report_id:
        return False
    if datetime.utcnow() > token_data["expiry"]:
        del view_tokens[token]
        return False
    
    return True

@router.get("/reports", response_model=List[Report])
async def get_client_reports(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get reports for current user's company"""
    reports = await db.reports.find({
        "company_id": current_user.company_id,
        "status": "published"
    }).sort("created_at", -1).to_list(length=None)
    
    return [Report(**report) for report in reports]

@router.get("/reports/{report_id}", response_model=Report)
async def get_report(
    report_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get specific report details"""
    report = await db.reports.find_one({
        "id": report_id,
        "company_id": current_user.company_id,
        "status": "published"
    })
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Increment view count
    await db.reports.update_one(
        {"id": report_id},
        {"$inc": {"view_count": 1}}
    )
    
    # Log activity
    await log_activity(
        db, current_user.id, current_user.email, ActivityType.REPORT_VIEW,
        f"Viewed report: {report['title']}",
        get_client_ip(request),
        metadata={"report_id": report_id}
    )
    
    return Report(**report)

@router.get("/reports/{report_id}/secure-token")
async def get_secure_view_token(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get a temporary token for secure viewing"""
    report = await db.reports.find_one({
        "id": report_id,
        "company_id": current_user.company_id,
        "status": "published"
    })
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    token = generate_view_token(current_user.id, report_id)
    
    return {
        "token": token,
        "expires_in": 1800,  # 30 minutes in seconds
        "allow_download": report.get("allow_download", False)
    }

@router.get("/reports/{report_id}/view")
async def view_report_file(
    report_id: str,
    request: Request,
    token: Optional[str] = None,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """View report HTML file in secure mode - supports token query param for iframe"""
    # Get user from token (either header or query param)
    current_user = None
    if token:
        current_user = await get_user_from_token(token, db)
    
    if current_user is None:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            header_token = auth_header[7:]
            current_user = await get_user_from_token(header_token, db)
    
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Admin can access all reports, clients only their company's
    if current_user.role == 'admin':
        report = await db.reports.find_one({
            "id": report_id,
            "status": "published"
        })
    else:
        report = await db.reports.find_one({
            "id": report_id,
            "company_id": current_user.company_id,
            "status": "published"
        })
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    file_path = UPLOAD_DIR / report["main_file"]
    
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report file not found"
        )
    
    # Log activity
    await log_activity(
        db, current_user.id, current_user.email, ActivityType.REPORT_VIEW,
        f"Opened report file: {report['title']}",
        get_client_ip(request),
        metadata={"report_id": report_id, "file": report["main_file"]}
    )
    
    # Serve the HTML file directly - no token injection needed
    # Embedded assets will load freely (security is at Main.html level)
    return FileResponse(
        file_path,
        media_type="text/html",
        headers={
            "Cache-Control": "no-store, no-cache, must-revalidate, private",
            "Pragma": "no-cache",
            "Expires": "0",
            "X-Frame-Options": "SAMEORIGIN",
            "X-Content-Type-Options": "nosniff",
        }
    )

@router.get("/reports/{report_id}/asset/{file_name:path}")
async def get_report_asset(
    report_id: str,
    file_name: str,
    request: Request,
    token: Optional[str] = None,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get supporting assets (images, css, etc.) for a report.
    Supports token authentication via query parameter for browser-loaded assets."""
    
    # First try to get user from query parameter token (for embedded assets)
    current_user = None
    if token:
        current_user = await get_user_from_token(token, db)
    
    # If no valid token in query param, try the Authorization header
    if current_user is None:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            header_token = auth_header[7:]  # Remove "Bearer " prefix
            current_user = await get_user_from_token(header_token, db)
    
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    report = await db.reports.find_one({
        "id": report_id,
        "company_id": current_user.company_id,
        "status": "published"
    })
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Get the report's directory
    main_file_path = Path(report["main_file"])
    report_dir = UPLOAD_DIR / main_file_path.parent
    asset_path = report_dir / file_name
    
    # Security: ensure the asset is within the report directory
    try:
        asset_path.resolve().relative_to(report_dir.resolve())
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    if not asset_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )
    
    # Determine content type
    suffix = asset_path.suffix.lower()
    content_types = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".css": "text/css",
        ".js": "application/javascript",
        ".json": "application/json",
        ".html": "text/html",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".ttf": "font/ttf",
        ".eot": "application/vnd.ms-fontobject",
    }
    content_type = content_types.get(suffix, "application/octet-stream")
    
    return FileResponse(
        asset_path,
        media_type=content_type,
        headers={
            "Cache-Control": "no-store, no-cache, must-revalidate, private",
        }
    )

@router.get("/reports/{report_id}/download")
async def download_report(
    report_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    file_path: Optional[str] = None,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Download report file or supporting file"""
    # Admin can access all reports, clients only their company's
    if current_user.role == 'admin':
        report = await db.reports.find_one({
            "id": report_id,
            "status": "published"
        })
    else:
        report = await db.reports.find_one({
            "id": report_id,
            "company_id": current_user.company_id,
            "status": "published"
        })
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check if download is allowed (skip for admin)
    if current_user.role != 'admin' and not report.get("allow_download", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Download not allowed for this report"
        )
    
    # Determine which file to download
    target_file = file_path if file_path else report["main_file"]
    
    # Verify file is part of this report
    allowed_files = [report["main_file"]] + report.get("supporting_files", [])
    if target_file not in allowed_files:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="File access not allowed"
        )
    
    full_path = UPLOAD_DIR / target_file
    
    if not full_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    # Increment download count
    await db.reports.update_one(
        {"id": report_id},
        {"$inc": {"download_count": 1}}
    )
    
    # Log activity
    await log_activity(
        db, current_user.id, current_user.email, ActivityType.REPORT_DOWNLOAD,
        f"Downloaded file: {target_file} from report: {report['title']}",
        get_client_ip(request),
        metadata={"report_id": report_id, "file": target_file}
    )
    
    return FileResponse(
        full_path,
        filename=full_path.name,
        headers={"Content-Disposition": f"attachment; filename={full_path.name}"}
    )

@router.get("/company", response_model=Company)
async def get_company_info(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get current user's company information"""
    company = await db.companies.find_one({"id": current_user.company_id})
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    return Company(**company)

@router.get("/reports/{report_id}/{file_path:path}")
async def get_report_relative_asset(
    report_id: str,
    file_path: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Serve embedded assets (images, charts, etc.) without authentication.
    Security is at the Main.html level - once user has access to Main.html,
    embedded content loads freely just like opening locally."""
    
    # Skip if this matches other endpoints
    if file_path in ['view', 'download', 'secure-token'] or file_path.startswith('asset/'):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    
    # Find the report (no company_id check - just verify report exists)
    report = await db.reports.find_one({
        "id": report_id,
        "status": "published"
    })
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Get the report's directory (where Main.html is located)
    main_file_path = Path(report["main_file"])
    report_dir = UPLOAD_DIR / main_file_path.parent
    
    # Try to find the file with different Unicode normalizations
    # Mac uses NFD (decomposed), Windows/Linux typically use NFC (composed)
    asset_path = report_dir / file_path
    
    if not asset_path.exists():
        # Try NFD normalization (Mac style)
        nfd_path = report_dir / normalize_path(file_path)
        if nfd_path.exists():
            asset_path = nfd_path
        else:
            # Try NFC normalization
            nfc_path = report_dir / unicodedata.normalize('NFC', file_path)
            if nfc_path.exists():
                asset_path = nfc_path
    
    # Security: ensure the asset is within the report directory
    try:
        asset_path.resolve().relative_to(report_dir.resolve())
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    if not asset_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Asset not found: {file_path}"
        )
    
    # Determine content type
    suffix = asset_path.suffix.lower()
    content_types = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".css": "text/css",
        ".js": "application/javascript",
        ".json": "application/json",
        ".html": "text/html",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".ttf": "font/ttf",
        ".eot": "application/vnd.ms-fontobject",
    }
    content_type = content_types.get(suffix, "application/octet-stream")
    
    # Serve all files directly without modification
    return FileResponse(
        asset_path,
        media_type=content_type,
        headers={
            "Cache-Control": "no-store, no-cache, must-revalidate, private",
        }
    )
