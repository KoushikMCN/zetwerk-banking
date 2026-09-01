import type { ReactNode } from "react"
import { Wallet } from "lucide-react"

import { GuestGuard } from "@/components/auth/guest-guard"

interface AuthLayoutProps {
    children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <GuestGuard>
            <main className="min-h-screen bg-[#fffef1]">
                {/* Mobile header */}
                <header className="flex items-center border-b border-[#e5e7eb] bg-[#fffef1] px-6 py-4 sm:px-8 lg:hidden">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center bg-[#020b36] text-white">
                            <Wallet size={18} />
                        </div>

                        <div className="leading-tight">
                            <p className="text-sm font-bold tracking-tight text-[#020b36]">ZETWERK</p>

                            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#667085]">Banking</p>
                        </div>
                    </div>
                </header>

                <div className="grid min-h-screen lg:grid-cols-2">
                    {/* Desktop branding */}
                    <section className="hidden bg-[#020b36] p-12 text-white lg:flex lg:flex-col lg:justify-between 2xl:p-16">
                        <div>
                            <p className="text-sm font-bold tracking-tight">ZETWERK</p>

                            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">Banking</p>
                        </div>

                        <div className="max-w-lg">
                            <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-[#2480fd]">Simple. Secure. Reliable.</p>

                            <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.04em] xl:text-6xl 2xl:text-7xl">
                                Your money,
                                <br />
                                under control.
                            </h1>

                            <p className="mt-6 max-w-md text-base leading-7 text-white/60">Manage your account, send money securely, and keep track of every transaction.</p>
                        </div>

                        <p className="text-xs text-white/40">Secure digital banking</p>
                    </section>

                    {/* Auth form */}
                    <section className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12 sm:px-8 lg:min-h-screen lg:px-12 2xl:px-16">
                        <div className="w-full max-w-md">{children}</div>
                    </section>
                </div>
            </main>
        </GuestGuard>
    )
}
