const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured")
}

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number
    ) {
        super(message)
        this.name = "ApiError"
    }
}

function getErrorMessage(data: unknown): string {
    if (data && typeof data === "object" && "message" in data) {
        const message = data.message

        if (typeof message === "string") {
            return message
        }

        if (Array.isArray(message) && message.every((item) => typeof item === "string")) {
            return message.join(", ")
        }
    }

    return "Something went wrong"
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    let response: Response

    try {
        response = await fetch(`${API_URL}${path}`, {
            ...options,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        })
    } catch {
        throw new ApiError("Unable to connect to the server. Please try again.", 0)
    }

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new ApiError(getErrorMessage(data), response.status)
    }

    return data as T
}
