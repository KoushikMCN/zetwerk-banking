"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { useAccount } from "@/lib/account/use-account"
import { useCreateTransfer } from "@/lib/transfer/use-create-transfer"
import { transferSchema, type TransferFormValues } from "@/lib/transfer/transfer-schema"
import { formatCurrency } from "@/lib/utils/currency"

export function TransferForm() {
    const transferMutation = useCreateTransfer()

    const { data: account } = useAccount()

    const [isReviewing, setIsReviewing] = useState(false)
    const [showBalance, setShowBalance] = useState(false)

    const router = useRouter()

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<TransferFormValues>({
        resolver: zodResolver(transferSchema),
        defaultValues: {
            destinationAccountNumber: "",
            amount: "",
        },
    })

    function handleReview() {
        setIsReviewing(true)
    }

    async function handleConfirm() {
        const values = getValues()
        const idempotencyKey = crypto.randomUUID()

        try {
            await transferMutation.mutateAsync({
                input: {
                    destinationAccountNumber: values.destinationAccountNumber.trim(),
                    amount: values.amount.trim(),
                },
                idempotencyKey,
            })

            toast.success("Transfer completed successfully", {
                description: `${values.amount} sent to ${values.destinationAccountNumber}`,
            })

            router.replace("/dashboard")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to complete the transfer")
        }
    }

    const isSubmitting = transferMutation.isPending

    if (isReviewing) {
        const values = getValues()

        return (
            <div className="space-y-7">
                <div>
                    <p className="text-sm font-medium text-[#667085]">Review transfer</p>

                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#020b36]">Confirm the details</h2>
                </div>

                <div className="divide-y divide-[#e5e7eb] border border-[#e5e7eb]">
                    <div className="px-5 py-4">
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#667085]">Sending</p>

                        <p className="mt-1 text-2xl font-semibold text-[#020b36]">₹{values.amount}</p>
                    </div>

                    <div className="px-5 py-4">
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#667085]">Destination account</p>

                        <p className="mt-1 text-base font-medium tracking-wide text-[#020b36]">{values.destinationAccountNumber}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setIsReviewing(false)}
                        className="h-12 flex-1 border border-[#d9dce3] px-5 text-sm font-semibold text-[#020b36] transition hover:bg-[#f8faff] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Go back
                    </button>

                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleConfirm}
                        className="flex h-12 flex-1 items-center justify-center gap-2 bg-[#2480fd] px-5 text-sm font-semibold text-white transition hover:bg-[#176fe8] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={17} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Confirm transfer
                                <ArrowRight size={17} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(handleReview)} className="space-y-6">
            <div>
                <label htmlFor="destinationAccountNumber" className="block text-sm font-medium text-[#020b36]">
                    Destination account number
                </label>

                <input
                    id="destinationAccountNumber"
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    placeholder="ACC12345678"
                    {...register("destinationAccountNumber")}
                    className="mt-2 h-12 w-full border border-[#d9dce3] bg-white px-4 text-base text-[#020b36] outline-none transition placeholder:text-[#98a2b3] focus:border-[#2480fd] focus:ring-1 focus:ring-[#2480fd]"
                />

                {errors.destinationAccountNumber && (
                    <p className="mt-2 text-sm text-[#dc2626]" role="alert">
                        {errors.destinationAccountNumber.message}
                    </p>
                )}
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="amount" className="block text-sm font-medium text-[#020b36]">
                        Amount
                    </label>

                    {account && (
                        <button
                            type="button"
                            onClick={() => setShowBalance((visible) => !visible)}
                            className="flex items-center gap-1.5 text-sm font-medium text-[#667085] transition-colors hover:text-[#2480fd]"
                            aria-expanded={showBalance}
                        >
                            {showBalance ? <EyeOff size={15} /> : <Eye size={15} />}

                            {showBalance ? "Hide balance" : "Show balance"}
                        </button>
                    )}
                </div>

                <div className="relative mt-2">
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base text-[#667085]">₹</span>

                    <input
                        id="amount"
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        placeholder="0.00"
                        {...register("amount")}
                        className="h-12 w-full border border-[#d9dce3] bg-white pl-9 pr-4 text-base text-[#020b36] outline-none transition placeholder:text-[#98a2b3] focus:border-[#2480fd] focus:ring-1 focus:ring-[#2480fd]"
                    />
                </div>

                {showBalance && account && (
                    <div className="mt-3 flex items-center justify-between border border-[#e5e7eb] bg-[#f8faff] px-4 py-3">
                        <span className="text-sm text-[#667085]">Available balance</span>

                        <span className="text-sm font-semibold text-[#020b36]">{formatCurrency(account.balance, account.currency)}</span>
                    </div>
                )}

                {errors.amount && (
                    <p className="mt-2 text-sm text-[#dc2626]" role="alert">
                        {errors.amount.message}
                    </p>
                )}
            </div>

            <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 bg-[#2480fd] px-5 text-sm font-semibold text-white transition hover:bg-[#176fe8]">
                Review transfer
                <ArrowRight size={17} />
            </button>
        </form>
    )
}
