export interface AuthMessageResponse {
  message: string;
}

export interface CurrentUser {
  userId: string;
  email: string;
}

export interface Account {
  accountNumber: string;
  balance: string;
  currency: string;
  createdAt: string;
}

export type TransactionType = 'DEBIT' | 'CREDIT';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: string;
  balanceAfter: string;
  createdAt: string;
  transfer: {
    id: string;
    sourceAccountId: string;
    destinationAccountId: string;
  };
}

export interface TransferResponse {
  id: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: string;
  currency: string;
  status: 'COMPLETED';
  idempotencyKey: string;
  createdAt: string;
}