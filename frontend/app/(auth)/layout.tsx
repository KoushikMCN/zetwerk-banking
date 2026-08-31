import type { Metadata } from "next"
import type { ReactNode } from "react"

interface AuthLayoutProps {
    children: ReactNode
}

export const metadata: Metadata = {
    title: "Login | Zetwerk Banking",
    description: "Secure digital banking",
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <main className="min-h-screen bg-[#fffef1]">
            <div className="grid min-h-screen lg:grid-cols-2">
                <section className="hidden bg-[#020b36] px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between xl:px-16 2xl:px-20">
                    <div>
                        <p className="text-base font-bold tracking-tight">ZETWERK</p>

                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-white/60">Banking</p>
                    </div>

                    <div className="max-w-xl">
                        <p className="mb-7 text-sm font-semibold uppercase tracking-[0.2em] text-[#2480fd]">Simple. Secure. Reliable.</p>

                        <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.04em] xl:text-6xl 2xl:text-7xl">
                            Your money,
                            <br />
                            under control.
                        </h1>

                        <p className="mt-7 max-w-lg text-lg leading-8 text-white/60">Manage your account, send money securely, and keep track of every transaction.</p>
                    </div>

                    <p className="text-sm text-white/40">Secure digital banking</p>
                </section>

                <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-12 xl:px-16">
                    <div className="w-full max-w-md">{children}</div>
                </section>
            </div>
        </main>
    )
}
