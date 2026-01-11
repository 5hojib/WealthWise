
import { 
  Transaction, 
  Beneficiary, 
  FinancialStats, 
  TransactionType, 
  DebtStatus, 
  AccountSource 
} from '../types';

export class StorageService {
  static async getTransactions(): Promise<Transaction[]> {
    const response = await fetch('/api/transactions', { cache: 'no-store' });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch transactions' }));
      throw new Error(errorData.error || 'An unknown error occurred');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }

  static async getBeneficiaries(): Promise<Beneficiary[]> {
    const response = await fetch('/api/beneficiaries', { cache: 'no-store' });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch beneficiaries' }));
      throw new Error(errorData.error || 'An unknown error occurred');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }

  static async saveTransaction(transaction: Transaction): Promise<void> {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to save transaction' }));
      throw new Error(errorData.error || 'An unknown error occurred');
    }
  }

  static async deleteTransaction(id: string): Promise<void> {
    const response = await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to delete transaction' }));
      throw new Error(errorData.error || 'An unknown error occurred');
    }
  }

  static async saveBeneficiary(beneficiary: Beneficiary): Promise<void> {
    const response = await fetch('/api/beneficiaries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(beneficiary)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to save beneficiary' }));
      throw new Error(errorData.error || 'An unknown error occurred');
    }
  }

  static async deleteBeneficiary(id: string): Promise<void> {
    const response = await fetch(`/api/beneficiaries?id=${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to delete beneficiary' }));
      throw new Error(errorData.error || 'An unknown error occurred');
    }
  }

  static calculateStats(transactions: Transaction[]): FinancialStats {
    let cash = 0, bank = 0, mfs = 0, receivable = 0, payable = 0, earnings = 0, expenses = 0;

    transactions.forEach(tx => {
      const amount = tx.amount;
      if (tx.type === TransactionType.INCOME) earnings += amount;
      if (tx.type === TransactionType.EXPENSE) expenses += amount;

      const updateBalance = (source: AccountSource, val: number) => {
        if (source === AccountSource.CASH) cash += val;
        else if (source === AccountSource.BANK) bank += val;
        else if (source === AccountSource.MFS) mfs += val;
      };

      switch (tx.type) {
        case TransactionType.INCOME: updateBalance(tx.source, amount); break;
        case TransactionType.EXPENSE: updateBalance(tx.source, -amount); break;
        case TransactionType.BORROW:
          updateBalance(tx.source, amount);
          if (tx.status !== DebtStatus.SETTLED) {
            const repaid = (tx.repayments || []).reduce((sum, r) => sum + r.amount, 0);
            payable += (amount - repaid);
          }
          (tx.repayments || []).forEach(r => updateBalance(r.source, -r.amount));
          break;
        case TransactionType.LEND:
          updateBalance(tx.source, -amount);
          if (tx.status !== DebtStatus.SETTLED && tx.status !== DebtStatus.BAD_DEBT) {
            const repaid = (tx.repayments || []).reduce((sum, r) => sum + r.amount, 0);
            receivable += (amount - repaid);
          }
          (tx.repayments || []).forEach(r => updateBalance(r.source, r.amount));
          break;
      }
    });

    return {
      cashBalance: cash, bankBalance: bank, mfsBalance: mfs, receivable, payable,
      totalEarnings: earnings, totalExpenses: expenses,
      totalWealth: cash + bank + mfs + receivable - payable,
    };
  }
}
