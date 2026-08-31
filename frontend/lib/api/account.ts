import { apiFetch } from './client';

export interface Account {
  accountNumber: string;
  balance: string;
  currency: string;
  createdAt: string;
}

export function getAccount() {
  return apiFetch<Account>('/account');
}