import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

import type { Transaction } from "@/lib/api/transactions"
import { formatCurrency } from "@/lib/utils/currency"

interface TransactionItemProps {
    transaction: Transaction
    currency: string
}

export function TransactionItem({ transaction, currency }: TransactionItemProps) {
    const isCredit = transaction.type === "CREDIT"

    const counterpartyAccount = isCredit ? transaction.transfer.sourceAccount.accountNumber : transaction.transfer.destinationAccount.accountNumber

    const directionLabel = isCredit ? "Money received" : "Money sent"

    const counterpartyLabel = isCredit ? "From" : "To"

    const icon = isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />

    return (
        <div className="flex items-center justify-between gap-4 border-b border-[#e5e7eb] py-5 last:border-b-0">
            <div className="flex min-w-0 items-center gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center ${isCredit ? "bg-[#edf9f2] text-[#16834a]" : "bg-[#fef2f2] text-[#dc2626]"}`}>{icon}</div>

                <div className="min-w-0">
                    <p className="text-base font-medium text-[#020b36]">{directionLabel}</p>

                    <p className="mt-1 text-sm text-[#667085]">
                        {counterpartyLabel} {counterpartyAccount}
                    </p>

                    <p className="mt-1 text-sm text-[#98a2b3]">
                        {new Date(transaction.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                    </p>
                </div>
            </div>

            <div className="shrink-0 text-right">
                <p className={`text-base font-semibold ${isCredit ? "text-[#16834a]" : "text-[#020b36]"}`}>
                    {isCredit ? "+" : "-"}
                    {formatCurrency(transaction.amount, currency)}
                </p>

                <p className="mt-1 text-sm text-[#667085]">Balance {formatCurrency(transaction.balanceAfter, currency)}</p>
            </div>
        </div>
    )
}
