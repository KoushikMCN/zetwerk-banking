"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createTransfer, type CreateTransferInput } from "@/lib/api/transfers"

export function useCreateTransfer() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ input, idempotencyKey }: { input: CreateTransferInput; idempotencyKey: string }) => createTransfer(input, idempotencyKey),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["account"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["transactions"],
                }),
            ])
        },
    })
}
