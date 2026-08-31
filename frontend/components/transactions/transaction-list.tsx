import type { Transaction } from "@/lib/api/transactions"

import { TransactionItem } from "./transaction-item"

interface TransactionListProps {
    transactions: Transaction[]
    currency: string
}

export function TransactionList({ transactions, currency }: TransactionListProps) {
    if (transactions.length === 0) {
        return (
            <div className="border border-[#e5e7eb] bg-white px-6 py-12 text-center">
                <p className="text-base font-medium text-[#020b36]">No transactions yet</p>

                <p className="mt-2 text-sm text-[#667085]">Your transaction history will appear here.</p>
            </div>
        )
    }

    return (
        <div className="border border-[#e5e7eb] bg-white px-6">
            {transactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} currency={currency} />
            ))}
        </div>
    )
}
