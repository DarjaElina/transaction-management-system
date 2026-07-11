import { delay, http, HttpResponse } from 'msw'

export const handlers = [
  http.get('http://localhost:8000/api/categories', () => {
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

  http.post('http://localhost:8000/api/categories', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>

    await delay(500)

    return HttpResponse.json({
      id: '123',
      name: body.name,
      allowed_type: body.allowed_type,
    })
  }),

  http.post('http://localhost:8000/api/transactions', async ({ request }) => {
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

  http.get('http://localhost:8000/api/statistics/income-expense', () => {
    return HttpResponse.json([
      {
        label: '2026-07-08T00:00:00',
        income: '1000.00',
        expense: '50.00',
      },
      {
        label: '2026-07-09T00:00:00',
        income: '0',
        expense: '20.00',
      },
    ])
  }),
]
