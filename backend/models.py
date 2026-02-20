from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class UserRole(str, Enum):
    ADMIN = "admin"
    CLIENT = "client"

class ReportStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"

class ActivityType(str, Enum):
    LOGIN = "login"
    LOGOUT = "logout"
    REPORT_VIEW = "report_view"
    REPORT_DOWNLOAD = "report_download"
    REPORT_UPLOAD = "report_upload"
    USER_CREATE = "user_create"
    COMPANY_CREATE = "company_create"
    FAILED_LOGIN = "failed_login"

# Company Models
class CompanyBase(BaseModel):
    name: str
    description: Optional[str] = None
    active: bool = True

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# User Models
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    company_id: str
    role: UserRole = UserRole.CLIENT
    active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    active: Optional[bool] = None

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    hashed_password: str
    last_login: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    company_id: str
    role: UserRole
    active: bool
    last_login: Optional[datetime]
    created_at: datetime

# Authentication Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    company: Company

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None

# Report Models
class ReportBase(BaseModel):
    title: str
    description: Optional[str] = None
    company_id: str
    status: ReportStatus = ReportStatus.DRAFT
    tags: List[str] = []

class ReportCreate(ReportBase):
    main_file: str  # Path to main HTML file
    supporting_files: List[str] = []  # Paths to supporting files

class ReportUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ReportStatus] = None
    tags: Optional[List[str]] = None
    allow_download: Optional[bool] = None

class Report(ReportBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    main_file: str
    supporting_files: List[str] = []
    file_size: int = 0
    download_count: int = 0
    view_count: int = 0
    allow_download: bool = False  # Default: view only, no download
    uploaded_by: str  # User ID
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Activity Log Models
class ActivityLogBase(BaseModel):
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    activity_type: ActivityType
    description: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    metadata: Dict[str, Any] = {}

class ActivityLogCreate(ActivityLogBase):
    pass

class ActivityLog(ActivityLogBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Statistics Models
class DashboardStats(BaseModel):
    total_companies: int
    total_users: int
    total_reports: int
    total_access_logs: int
    recent_activities: List[ActivityLog]

# File Upload Models
class FileUploadResponse(BaseModel):
    filename: str
    path: str
    size: int
    content_type: Optional[str] = None
