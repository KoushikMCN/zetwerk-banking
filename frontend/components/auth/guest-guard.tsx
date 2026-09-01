"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useCurrentUser } from "@/lib/auth/use-current-user"

interface GuestGuardProps {
    children: React.ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
    const router = useRouter()

    const { isLoading, data } = useCurrentUser()

    useEffect(() => {
        if (!isLoading && data) {
            router.replace("/dashboard")
        }
    }, [data, isLoading, router])

    if (isLoading || data) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-sm text-[#667085]">
                    Loading your account...
                </div>
            </div>
        )
    }

    return children
}