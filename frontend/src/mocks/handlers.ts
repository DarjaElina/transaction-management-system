import { delay, http, HttpResponse } from 'msw'
import { API_URL } from './config'

export const handlers = [
  http.get(`${API_URL}/categories`, () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Food',
        allowed_type: 'expense',
      },
      {
        id: '2',
        name: 'Work',
        allowed_type: 'income',
      },
    ])
  }),

  http.post(`${API_URL}/categories`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>

    await delay(500)

    return HttpResponse.json({
      id: '123',
      name: body.name,
      allowed_type: body.allowed_type,
    })
  }),

  http.post(`${API_URL}/transactions`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>

    await delay(500)

    return HttpResponse.json(
      {
        id: crypto.randomUUID(),
        ...body,
        createdAt: new Date().toISOString(),
      },
      { status: 200 },
    )
  }),

  http.get(`${API_URL}/statistics/spending-by-category`, () => {
    return HttpResponse.json([
      {
        category: 'Food',
        amount: '50.00',
      },
      {
        category: 'Transport',
        amount: '20.00',
      },
    ])
  }),
]
