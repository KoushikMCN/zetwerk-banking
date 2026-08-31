import { TransferForm } from "@/components/transfer/transfer-form"

export default function TransferPage() {
    return (
        <div className="mx-auto max-w-2xl space-y-8">
            <section>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2480fd]">Payments</p>

                <h1 className="mt-2 text-4xl font-semibold tracking-[-0.035em] text-[#020b36]">Transfer money</h1>

                <p className="mt-2 text-base leading-7 text-[#667085]">Send money securely to another account.</p>
            </section>

            <section className="border border-[#e5e7eb] bg-white p-6 sm:p-8">
                <TransferForm />
            </section>
        </div>
    )
}
