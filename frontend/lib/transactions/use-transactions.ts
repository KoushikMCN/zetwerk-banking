"use client"

import { useQuery } from "@tanstack/react-query"

import { getTransactions } from "@/lib/api/transactions"

export function useTransactions(page: number, limit = 10) {
    return useQuery({
        queryKey: ["transactions", { page, limit }],
        queryFn: () => getTransactions(page, limit),
    })
}
