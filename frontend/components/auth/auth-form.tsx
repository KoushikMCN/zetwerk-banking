"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Eye, EyeOff } from "lucide-react"

import { login, register } from "@/lib/api/auth"
import { ApiError } from "@/lib/api/client"

interface AuthFormProps {
    mode: "login" | "register"
}

export function AuthForm({ mode }: AuthFormProps) {
    const router = useRouter()

    const isLogin = mode === "login"

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        setError(null)
        setIsSubmitting(true)

        try {
            if (isLogin) {
                await login({
                    email,
                    password,
                })
            } else {
                await register({
                    email,
                    password,
                })
            }

            router.replace("/dashboard")
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message)
            } else {
                setError("Something went wrong. Please try again.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            <div className="mb-10">
                <p className="mb-3 text-sm font-semibold text-[#2480fd]">{isLogin ? "Welcome back" : "Get started"}</p>

                <h2 className="text-4xl font-semibold tracking-[-0.035em] text-[#020b36]">{isLogin ? "Sign in" : "Create your account"}</h2>

                <p className="mt-3 text-base leading-7 text-[#667085]">
                    {isLogin ? "Access your account and manage your money." : "Create an account to start managing your money."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="mb-2 block text-[15px] font-medium text-[#020b36]">
                        Email
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        className="w-full border border-[#d9dce3] bg-white px-4 py-3.5 text-base text-[#020b36] outline-none transition focus:border-[#2480fd] focus:ring-2 focus:ring-[#2480fd]/10"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="mb-2 block text-[15px] font-medium text-[#020b36]">
                        Password
                    </label>

                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            className="w-full border border-[#d9dce3] bg-white px-4 py-3.5 pr-12 text-base text-[#020b36] outline-none transition focus:border-[#2480fd] focus:ring-2 focus:ring-[#2480fd]/10"
                            placeholder="Enter your password"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((visible) => !visible)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-[#667085] transition-colors hover:text-[#020b36]"
                        >
                            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                        </button>
                    </div>
                </div>

                {error && (
                    <div role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#2480fd] px-4 py-3.5 text-base font-semibold text-white transition hover:bg-[#176fe8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? (isLogin ? "Signing in..." : "Creating account...") : isLogin ? "Sign in" : "Create account"}
                </button>
            </form>

            <p className="mt-8 text-center text-base text-[#667085]">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <Link href={isLogin ? "/register" : "/login"} className="font-semibold text-[#020b36] underline decoration-[#2480fd] underline-offset-4">
                    {isLogin ? "Create one" : "Sign in"}
                </Link>
            </p>
        </div>
    )
}
