import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGODB_URL")

if not MONGO_URL:
    raise ValueError("Missing MONGODB_URL environment variable")

client = AsyncIOMotorClient(MONGO_URL)
db = client.wealth_tracker

def get_beneficiaries_collection():
    return db.beneficiaries

def get_transactions_collection():
    return db.transactions
