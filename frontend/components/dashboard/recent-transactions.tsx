import Link from "next/link"

import type { Transaction } from "@/lib/api/transactions"
import { TransactionItem } from "@/components/transactions/transaction-item"

interface RecentTransactionsProps {
    transactions: Transaction[]
    currency: string
}

export function RecentTransactions({ transactions, currency }: RecentTransactionsProps) {
    const recentTransactions = transactions.slice(0, 3)

    return (
        <section>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-[#667085]">Activity</p>

                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#020b36]">Recent transactions</h2>
                </div>

                {transactions.length > 0 && (
                    <Link href="/transactions" className="text-sm font-semibold text-[#2480fd] transition-colors hover:text-[#176fe8]">
                        View all
                    </Link>
                )}
            </div>

            <div className="border border-[#e5e7eb] bg-white px-6">
                {recentTransactions.length === 0 ? (
                    <div className="py-10 text-center">
                        <p className="text-base font-medium text-[#020b36]">No transactions yet</p>

                        <p className="mt-2 text-sm text-[#667085]">Your recent activity will appear here.</p>
                    </div>
                ) : (
                    recentTransactions.map((transaction) => <TransactionItem key={transaction.id} transaction={transaction} currency={currency} />)
                )}
            </div>
        </section>
    )
}
