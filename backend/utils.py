from motor.motor_asyncio import AsyncIOMotorDatabase
from models import ActivityLogCreate, ActivityType
from datetime import datetime
from typing import Optional, Dict, Any
import uuid

async def log_activity(
    db: AsyncIOMotorDatabase,
    user_id: Optional[str],
    user_email: Optional[str],
    activity_type: ActivityType,
    description: str,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
):
    """Log user activity to database"""
    activity = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "user_email": user_email,
        "activity_type": activity_type.value,
        "description": description,
        "ip_address": ip_address,
        "user_agent": user_agent,
        "metadata": metadata or {},
        "timestamp": datetime.utcnow()
    }
    
    await db.activity_logs.insert_one(activity)

def sanitize_filename(filename: str) -> str:
    """Sanitize filename for safe storage"""
    import re
    # Remove or replace dangerous characters
    filename = re.sub(r'[<>:"/\|?*]', '_', filename)
    # Remove leading/trailing dots and spaces
    filename = filename.strip(' .')
    # Ensure it's not empty
    if not filename:
        filename = 'unnamed_file'
    return filename

def get_file_extension(filename: str) -> str:
    """Get file extension from filename"""
    return filename.split('.')[-1].lower() if '.' in filename else ''

def is_allowed_file_type(filename: str, allowed_types: list) -> bool:
    """Check if file type is allowed"""
    extension = get_file_extension(filename)
    return extension in allowed_types

def format_file_size(size_bytes: int) -> str:
    """Format file size in human readable format"""
    if size_bytes == 0:
        return "0 B"
    
    size_names = ["B", "KB", "MB", "GB", "TB"]
    i = 0
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1
    
    return f"{size_bytes:.1f} {size_names[i]}"
