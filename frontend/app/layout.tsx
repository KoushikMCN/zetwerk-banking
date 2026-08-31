import type { Metadata } from "next"

import { Toaster } from "sonner"

import { QueryProvider } from "@/components/providers/query-provider"

import "./globals.css"

export const metadata: Metadata = {
    title: "Zetwerk Banking",
    description: "Secure digital banking",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>
                <QueryProvider>
                    {children}
                    <Toaster position="top-right" richColors closeButton />
                </QueryProvider>
            </body>
        </html>
    )
}
