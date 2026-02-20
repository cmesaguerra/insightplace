from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import HTMLResponse, FileResponse, StreamingResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from pathlib import Path
import aiofiles
import os

from models import User, Report, Company, ActivityType
from auth import get_current_user, get_client_ip
from database import get_database
from utils import log_activity

router = APIRouter(prefix="/api/client", tags=["client"])

UPLOAD_DIR = Path("/app/uploads")

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

@router.get("/reports/{report_id}/view")
async def view_report_file(
    report_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """View report HTML file"""
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
    
    return FileResponse(
        file_path,
        media_type="text/html",
        filename=Path(report["main_file"]).name
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
