import Link from "next/link"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

export function QuickActions() {
    return (
        <div className="border border-[#e5e7eb] bg-white p-8 sm:p-10">
            <p className="text-sm font-medium text-[#667085]">Quick actions</p>

            <div className="mt-6 grid gap-3">
                <Link
                    href="/transfer"
                    className="flex items-center justify-between border border-[#e5e7eb] px-4 py-4 text-left transition hover:border-[#2480fd] hover:bg-[#f8faff]"
                >
                    <span className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center bg-[#eef5ff] text-[#2480fd]">
                            <ArrowUpRight size={17} />
                        </span>

                        <span className="text-base font-medium text-[#020b36]">Transfer money</span>
                    </span>

                    <span className="text-[#667085]">→</span>
                </Link>

                <Link
                    href="/transactions"
                    className="flex items-center justify-between border border-[#e5e7eb] px-4 py-4 text-left transition hover:border-[#2480fd] hover:bg-[#f8faff]"
                >
                    <span className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center bg-[#eef5ff] text-[#2480fd]">
                            <ArrowDownLeft size={17} />
                        </span>

                        <span className="text-base font-medium text-[#020b36]">Transaction history</span>
                    </span>

                    <span className="text-[#667085]">→</span>
                </Link>
            </div>
        </div>
    )
}
