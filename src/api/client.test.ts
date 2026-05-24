import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiRequest } from './client'

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('apiRequest', () => {
  it('returns parsed JSON on a successful response', async () => {
    const data = { gameId: 'abc123', lives: 3 }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    }))

    const result = await apiRequest('/game/start', { method: 'POST' })
    expect(result).toEqual(data)
  })

  it('sends the correct URL and headers', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    })
    vi.stubGlobal('fetch', mockFetch)

    await apiRequest('/game/start', { method: 'POST' })

    expect(mockFetch).toHaveBeenCalledWith(
      'https://dragonsofmugloar.com/api/v2/game/start',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  })

  it('throws an ApiError with status and message when response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
    }))

    await expect(apiRequest('/bad-path')).rejects.toMatchObject({
      status: 400,
      message: expect.stringContaining('400'),
    })
  })

  it('propagates network errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    await expect(apiRequest('/game/start')).rejects.toThrow('Network error')
  })
})
