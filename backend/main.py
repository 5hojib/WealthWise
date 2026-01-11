from fastapi import FastAPI, HTTPException, Body, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import List, Optional
import motor.motor_asyncio
from bson import ObjectId

from db import get_beneficiaries_collection, get_transactions_collection
from models import Beneficiary, Transaction

app = FastAPI()

beneficiaries_collection = get_beneficiaries_collection()
transactions_collection = get_transactions_collection()

# Beneficiary routes
@app.get("/api/beneficiaries", response_model=List[Beneficiary])
async def get_beneficiaries():
    beneficiaries = await beneficiaries_collection.find().to_list(100)
    return beneficiaries

@app.post("/api/beneficiaries")
async def add_or_update_beneficiary(beneficiary: Beneficiary):
    await beneficiaries_collection.update_one(
        {'id': beneficiary.id},
        {'$set': beneficiary.dict()},
        upsert=True
    )
    return {"status": "success"}

@app.delete("/api/beneficiaries")
async def delete_beneficiary(id: str = Query(...)):
    await beneficiaries_collection.delete_one({'id': id})
    return {"status": "success"}

# Transaction routes
@app.get("/api/transactions", response_model=List[Transaction])
async def get_transactions():
    transactions = await transactions_collection.find().to_list(1000)
    return transactions

@app.post("/api/transactions")
async def add_or_update_transaction(transaction: Transaction):
    await transactions_collection.update_one(
        {'id': transaction.id},
        {'$set': transaction.dict()},
        upsert=True
    )
    return {"status": "success"}

@app.delete("/api/transactions")
async def delete_transaction(id: str = Query(...)):
    await transactions_collection.delete_one({'id': id})
    return {"status": "success"}

# Serve frontend
app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    return FileResponse('dist/index.html')

@app.get("/")
async def root():
    return FileResponse('dist/index.html')
