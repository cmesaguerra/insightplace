from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB configuration
MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ.get('DB_NAME', 'insightplace')

# Global client instance
client: AsyncIOMotorClient = None
database: AsyncIOMotorDatabase = None

async def connect_to_mongo():
    """Create database connection"""
    global client, database
    client = AsyncIOMotorClient(MONGO_URL)
    database = client[DB_NAME]
    print(f"Connected to MongoDB: {DB_NAME}")

async def close_mongo_connection():
    """Close database connection"""
    global client
    if client:
        client.close()
        print("Disconnected from MongoDB")

async def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    return database

async def create_indexes():
    """Create database indexes for better performance"""
    if database is None:
        return
    
    # User indexes
    await database.users.create_index("email", unique=True)
    await database.users.create_index("company_id")
    await database.users.create_index("active")
    
    # Company indexes
    await database.companies.create_index("name", unique=True)
    await database.companies.create_index("active")
    
    # Report indexes
    await database.reports.create_index("company_id")
    await database.reports.create_index("status")
    await database.reports.create_index("created_at")
    await database.reports.create_index("title")
    
    # Activity log indexes
    await database.activity_logs.create_index("user_id")
    await database.activity_logs.create_index("timestamp")
    await database.activity_logs.create_index("activity_type")
    await database.activity_logs.create_index("ip_address")
    
    print("Database indexes created")
