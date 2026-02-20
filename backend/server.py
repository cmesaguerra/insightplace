from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging
from pathlib import Path
from dotenv import load_dotenv

# Import database functions
from database import connect_to_mongo, close_mongo_connection, create_indexes

# Import route modules
from routes.auth import router as auth_router
from routes.admin import router as admin_router
from routes.client import router as client_router

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    await create_indexes()
    await create_admin_user()
    yield
    # Shutdown
    await close_mongo_connection()

# Create the main app
app = FastAPI(
    title="InsightPlace Client Portal API",
    description="API for InsightPlace client portal and admin management",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(client_router)

# Create uploads directory
UPLOAD_DIR = Path("/app/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Mount static files for uploaded reports (with authentication in routes)
# Note: This is for internal serving, actual file access is handled by the client routes
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Basic API routes
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "InsightPlace Client Portal API"}

# Legacy routes (keep existing functionality)
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime
from database import get_database
from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

@app.get("/api/")
async def root():
    return {"message": "InsightPlace Client Portal API"}

@app.post("/api/status", response_model=StatusCheck)
async def create_status_check(
    input: StatusCheckCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@app.get("/api/status", response_model=List[StatusCheck])
async def get_status_checks(db: AsyncIOMotorDatabase = Depends(get_database)):
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize admin user on startup
async def create_admin_user():
    """Create default admin user and company if they don't exist"""
    from auth import get_password_hash
    from models import User, Company, UserRole
    from database import get_database
    
    db = await get_database()
    
    # Create default company
    admin_company = await db.companies.find_one({"name": "InsightPlace Admin"})
    if not admin_company:
        admin_company = Company(
            name="InsightPlace Admin",
            description="Administrative company for InsightPlace"
        )
        await db.companies.insert_one(admin_company.dict())
        logger.info("Created admin company")
    else:
        admin_company = Company(**admin_company)
    
    # Create admin user
    admin_user = await db.users.find_one({"email": "admin@insightplace.com"})
    if not admin_user:
        admin_user = User(
            email="admin@insightplace.com",
            full_name="Admin User",
            company_id=admin_company.id,
            role=UserRole.ADMIN,
            hashed_password=get_password_hash("admin123")
        )
        await db.users.insert_one(admin_user.dict())
        logger.info("Created admin user: admin@insightplace.com / admin123")
    
    # Create Paloma Valencia company
    paloma_company = await db.companies.find_one({"name": "Campaña Paloma Valencia"})
    if not paloma_company:
        paloma_company = Company(
            name="Campaña Paloma Valencia",
            description="Campaña electoral de Paloma Valencia"
        )
        await db.companies.insert_one(paloma_company.dict())
        logger.info("Created Paloma Valencia company")
        
        # Create demo user for Paloma Valencia
        demo_user = User(
            email="carlos.mesa@palomavalencia.com",
            full_name="Carlos Mesa",
            company_id=paloma_company.id,
            role=UserRole.CLIENT,
            hashed_password=get_password_hash("password123")
        )
        await db.users.insert_one(demo_user.dict())
        logger.info("Created demo user: carlos.mesa@palomavalencia.com / password123")