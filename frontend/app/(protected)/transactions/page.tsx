"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { TransactionList } from "@/components/transactions/transaction-list"
import { useAccount } from "@/lib/account/use-account"
import { useTransactions } from "@/lib/transactions/use-transactions"

export default function TransactionsPage() {
    const [page, setPage] = useState(1)

    const { data: account, isLoading: accountLoading, isError: accountError } = useAccount()

    const { data, isLoading: transactionsLoading, isError: transactionsError } = useTransactions(page)

    const isLoading = accountLoading || transactionsLoading
    const isError = accountError || transactionsError

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="h-10 w-64 animate-pulse bg-[#e9eadf]" />

                <div className="h-96 animate-pulse bg-white" />
            </div>
        )
    }

    if (isError || !account || !data) {
        return (
            <div role="alert" className="border border-red-200 bg-red-50 px-5 py-4 text-base text-red-700">
                Unable to load your transaction history. Please try again.
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <section>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2480fd]">Activity</p>

                <h1 className="mt-2 text-4xl font-semibold tracking-[-0.035em] text-[#020b36] sm:text-5xl 2xl:text-6xl">Transaction history</h1>

                <p className="mt-2 text-base text-[#667085]">View all activity on your account.</p>
            </section>

            <TransactionList transactions={data.data} currency={account.currency} />

            {data.meta.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        disabled={page === 1}
                        onClick={() => setPage((current) => current - 1)}
                        className="flex items-center gap-2 border border-[#d9dce3] px-4 py-2.5 text-sm font-medium text-[#020b36] transition hover:bg-[#f8faff] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>

                    <p className="text-sm text-[#667085]">
                        Page {data.meta.page} of {data.meta.totalPages}
                    </p>

                    <button
                        type="button"
                        disabled={page === data.meta.totalPages}
                        onClick={() => setPage((current) => current + 1)}
                        className="flex items-center gap-2 border border-[#d9dce3] px-4 py-2.5 text-sm font-medium text-[#020b36] transition hover:bg-[#f8faff] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    )
}
