import { apiFetch } from "./client"

export type TransactionType = "DEBIT" | "CREDIT"

export interface Transaction {
    id: string
    type: TransactionType
    amount: string
    balanceAfter: string
    createdAt: string
    transfer: {
        id: string
        sourceAccount: {
            accountNumber: string
        }
        destinationAccount: {
            accountNumber: string
        }
    }
}

export interface TransactionPagination {
    data: Transaction[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export function getTransactions(page = 1, limit = 20) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    })

    return apiFetch<TransactionPagination>(`/account/transactions?${params.toString()}`)
}

export function getRecentTransactions() {
    return apiFetch<Transaction[]>("/account/transactions/recent")
}
