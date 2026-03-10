import { env } from "@/lib/config/env";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = RequestInit;

export const apiClient = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const shouldSetJsonHeader = options.body !== undefined && !(options.body instanceof FormData);

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(shouldSetJsonHeader ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let details: unknown;
    try {
      details = await response.json();
    } catch {
      details = await response.text();
    }

    throw new ApiError("Request failed", response.status, details);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
