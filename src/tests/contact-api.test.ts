import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('resend', () => {
  const sendMock = vi.fn().mockResolvedValue({ id: 'test-id' })
  return {
    Resend: class {
      emails = { send: sendMock }
    },
  }
})

beforeEach(() => {
  vi.stubEnv('RESEND_API_KEY', 're_test_key')
})

async function callEndpoint(body: unknown) {
  const { POST } = await import('../pages/api/contact')
  const request = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  return POST({ request } as any)
}

describe('POST /api/contact', () => {
  it('returns 200 for a valid submission', async () => {
    const res = await callEndpoint({
      name: 'Max Mustermann',
      email: 'max@example.com',
      message: 'Hello, I would like to discuss a project.',
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('returns 422 when name is missing', async () => {
    const res = await callEndpoint({
      email: 'max@example.com',
      message: 'Hello',
    })

    expect(res.status).toBe(422)
    const json = await res.json()
    expect(json.errors.name).toBeDefined()
  })

  it('returns 422 when email is missing', async () => {
    const res = await callEndpoint({
      name: 'Max',
      message: 'Hello',
    })

    expect(res.status).toBe(422)
    const json = await res.json()
    expect(json.errors.email).toBeDefined()
  })

  it('returns 422 when message is missing', async () => {
    const res = await callEndpoint({
      name: 'Max',
      email: 'max@example.com',
    })

    expect(res.status).toBe(422)
    const json = await res.json()
    expect(json.errors.message).toBeDefined()
  })

  it('returns 422 for an invalid email address', async () => {
    const res = await callEndpoint({
      name: 'Max',
      email: 'not-an-email',
      message: 'Hello',
    })

    expect(res.status).toBe(422)
    const json = await res.json()
    expect(json.errors.email).toBeDefined()
  })

  it('returns 422 when all fields are empty strings', async () => {
    const res = await callEndpoint({
      name: '',
      email: '',
      message: '',
    })

    expect(res.status).toBe(422)
    const json = await res.json()
    expect(json.errors.name).toBeDefined()
    expect(json.errors.email).toBeDefined()
    expect(json.errors.message).toBeDefined()
  })
})
