
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  BORROW = 'BORROW',
  LEND = 'LEND',
}

export enum AccountSource {
  CASH = 'CASH',
  BANK = 'BANK',
  MFS = 'MFS',
}

export enum DebtStatus {
  PENDING = 'PENDING',
  PARTIALLY_REPAID = 'PARTIALLY_REPAID',
  SETTLED = 'SETTLED',
  BAD_DEBT = 'BAD_DEBT',
}

export interface Beneficiary {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: number;
}

export interface Repayment {
  id: string;
  amount: number;
  date: number;
  source: AccountSource;
  notes?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  source: AccountSource;
  date: number;
  notes?: string;
  // Debt specific fields
  beneficiaryId?: string;
  repayDate?: number;
  status?: DebtStatus;
  repayments?: Repayment[];
}

export interface FinancialStats {
  totalWealth: number;
  cashBalance: number;
  bankBalance: number;
  mfsBalance: number;
  receivable: number;
  payable: number;
  totalEarnings: number;
  totalExpenses: number;
}
