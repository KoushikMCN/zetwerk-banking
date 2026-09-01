"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

import { useCurrentUser } from "@/lib/auth/use-current-user"
import { logout } from "@/lib/api/auth"

interface AuthGuardProps {
    children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter()

    const { isLoading, isError, data } = useCurrentUser()

    const queryClient = useQueryClient()

    useEffect(() => {
        if (!isLoading && (isError || !data)) {
            void logout().finally(() => {
                queryClient.clear()
                router.replace("/login")
            })
        }
    }, [data, isError, isLoading, queryClient, router])

    if (isLoading || isError || !data) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-sm text-[#667085]">Loading your account...</div>
            </div>
        )
    }

    return children
}
