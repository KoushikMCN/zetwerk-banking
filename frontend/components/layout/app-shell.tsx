"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, LogOut, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

import { logout } from "@/lib/api/auth"
import { useCurrentUser } from "@/lib/auth/use-current-user"

interface AppShellProps {
    children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data: user } = useCurrentUser()

    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [])

    async function handleLogout() {
        setIsOpen(false)

        try {
            await logout()
        } finally {
            queryClient.clear()
            router.replace("/login")
        }
    }

    return (
        <div className="min-h-screen bg-[#fffef1]">
            <header className="border-b border-[#e5e7eb] bg-[#fffef1]">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center bg-[#020b36] text-white">
                            <Wallet size={18} />
                        </div>

                        <div className="leading-tight">
                            <p className="text-sm font-bold tracking-tight text-[#020b36]">ZETWERK</p>

                            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#667085]">Banking</p>
                        </div>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsOpen((open) => !open)}
                            aria-expanded={isOpen}
                            aria-haspopup="menu"
                            className="flex items-center gap-2 text-sm font-medium text-[#020b36] transition-colors hover:text-[#2480fd]"
                        >
                            <span>{user?.email ?? "Account"}</span>

                            <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isOpen && (
                            <div role="menu" className="absolute right-0 top-full z-50 mt-3 w-56 border border-[#e5e7eb] bg-white p-1 shadow-lg">
                                <div className="border-b border-[#e5e7eb] px-3 py-3">
                                    <p className="truncate text-sm font-medium text-[#020b36]">{user?.email}</p>

                                    <p className="mt-1 text-xs text-[#667085]">Account</p>
                                </div>

                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2 px-3 py-3 text-left text-sm font-medium text-[#667085] transition-colors hover:bg-[#f8faff] hover:text-[#020b36]"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">{children}</main>
        </div>
    )
}
