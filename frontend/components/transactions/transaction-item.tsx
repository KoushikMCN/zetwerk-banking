"use client"

import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

import type { Transaction } from "@/lib/api/transactions"

interface TransactionItemProps {
    transaction: Transaction
    currency: string
}

export function TransactionItem({ transaction, currency }: TransactionItemProps) {
    const isCredit = transaction.type === "CREDIT"

    const counterpartyAccount = isCredit ? transaction.transfer.sourceAccount.accountNumber : transaction.transfer.destinationAccount.accountNumber

    const directionLabel = isCredit ? "Money received" : "Money sent"

    const counterpartyLabel = isCredit ? "From" : "To"

    const formattedDate = new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(transaction.createdAt))

    return (
        <article className="flex items-start gap-3 px-0 py-5 sm:gap-4 sm:px-6">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center ${isCredit ? "bg-[#edf9f2] text-[#16834a]" : "bg-[#fef2f2] text-[#dc2626]"}`}>
                {isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-base font-medium text-[#020b36]">{directionLabel}</p>

                <p className="mt-1 truncate text-sm text-[#667085]">
                    {counterpartyLabel} {counterpartyAccount}
                </p>

                <p className="mt-1 text-xs text-[#98a2b3]">{formattedDate}</p>
            </div>

            <div className="w-25 shrink-0 text-right">
                <p className={`text-base font-normal ${isCredit ? "text-[#16834a]" : "text-[#dc2626]"}`}>
                    {isCredit ? "+" : "-"} {currency} {transaction.amount}
                </p>

                <p className="mt-1 text-xs leading-5 text-[#98a2b3]">
                    Balance {currency} {transaction.balanceAfter}
                </p>
            </div>
        </article>
    )
}
