from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class TransactionType(str, Enum):
    INCOME = 'INCOME'
    EXPENSE = 'EXPENSE'
    BORROW = 'BORROW'
    LEND = 'LEND'

class AccountSource(str, Enum):
    CASH = 'CASH'
    BANK = 'BANK'
    MFS = 'MFS'

class DebtStatus(str, Enum):
    PENDING = 'PENDING'
    PARTIALLY_REPAID = 'PARTIALLY_REPAID'
    SETTLED = 'SETTLED'
    BAD_DEBT = 'BAD_DEBT'

class Beneficiary(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    createdAt: int

class Repayment(BaseModel):
    id: str
    amount: float
    date: int
    source: AccountSource
    notes: Optional[str] = None

class Transaction(BaseModel):
    id: str
    type: TransactionType
    amount: float
    category: str
    source: AccountSource
    date: int
    notes: Optional[str] = None
    beneficiaryId: Optional[str] = None
    repayDate: Optional[int] = None
    status: Optional[DebtStatus] = None
    repayments: Optional[List[Repayment]] = None

    class Config:
        use_enum_values = True
