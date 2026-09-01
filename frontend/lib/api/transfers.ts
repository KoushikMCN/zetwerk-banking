import { apiFetch } from './client'

export interface CreateTransferInput {
    destinationAccountNumber: string
    amount: string
}

export interface Transfer {
    id: string
    sourceAccountId: string
    destinationAccountId: string
    amount: string
    currency: string
    status: 'COMPLETED'
    createdAt: string
}

export function createTransfer(
    input: CreateTransferInput,
    idempotencyKey: string,
) {
    return apiFetch<Transfer>('/transfers', {
        method: 'POST',
        headers: {
            'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(input),
    })
}