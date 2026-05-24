import type { ApiError } from '@/types/api'

const BASE_URL = 'https://dragonsofmugloar.com/api/v2'

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: `Request failed: ${response.status} ${response.statusText}`,
    }
    throw error
  }

  return response.json() as Promise<T>
}
