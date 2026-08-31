"use client"

import { AccountCard } from "@/components/dashboard/account-card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"

import { useRecentTransactions } from "@/lib/transactions/use-recent-transactions"
import { useAccount } from "@/lib/account/use-account"
import { useCurrentUser } from "@/lib/auth/use-current-user"

export default function DashboardPage() {
    const { data: user, isLoading: userLoading } = useCurrentUser()

    const { data: account, isLoading: accountLoading, isError: accountError } = useAccount()

    const { data: transactions, isLoading: transactionsLoading, isError: transactionsError } = useRecentTransactions()

    const isLoading = userLoading || accountLoading || transactionsLoading

    const isError = accountError || transactionsError

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="h-8 w-48 animate-pulse bg-[#e9eadf]" />
                <div className="h-52 animate-pulse bg-white" />
            </div>
        )
    }

    if (isError || !account || !user || !transactions) {
        return (
            <div role="alert" className="border border-red-200 bg-red-50 px-5 py-4 text-base text-red-700">
                Unable to load your account. Please try again.
            </div>
        )
    }

    return (
        <div className="space-y-10">
            <DashboardHeader email={user.email} />

            <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <AccountCard account={account} />
                <QuickActions />
            </section>

            <RecentTransactions transactions={transactions} currency={account.currency} />
        </div>
    )
}
