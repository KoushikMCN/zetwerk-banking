import { CreditCard } from "lucide-react"

import { formatCurrency } from "@/lib/utils/currency"
import type { Account } from "@/lib/api/account"

interface AccountCardProps {
    account: Account
}

export function AccountCard({ account }: AccountCardProps) {
    return (
        <div className="bg-[#020b36] p-8 text-white sm:p-10 2xl:p-12">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-white/60">Available balance</p>

                    <p className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl 2xl:text-6xl">{formatCurrency(account.balance, account.currency)}</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center bg-white/10">
                    <CreditCard size={21} />
                </div>
            </div>

            <div className="mt-12">
                <p className="text-xs uppercase tracking-[0.16em] text-white/40">Account number</p>

                <p className="mt-2 text-base font-medium tracking-wide">{account.accountNumber}</p>
            </div>
        </div>
    )
}
