'use client'

import { useQuery } from '@tanstack/react-query'

import { getRecentTransactions } from '@/lib/api/transactions'

export function useRecentTransactions() {
    return useQuery({
        queryKey: ['transactions', 'recent'],
        queryFn: getRecentTransactions,
    })
}