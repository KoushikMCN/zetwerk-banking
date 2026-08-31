import { z } from "zod"

export const transferSchema = z.object({
    destinationAccountNumber: z.string().trim().min(10, "Account number is too short").max(20, "Account number is too long"),

    amount: z
        .string()
        .trim()
        .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount with up to 2 decimal places")
        .refine((value) => {
            const amount = Number(value)
            return Number.isFinite(amount) && amount > 0
        }, "Amount must be greater than zero"),
})

export type TransferFormValues = z.infer<typeof transferSchema>
