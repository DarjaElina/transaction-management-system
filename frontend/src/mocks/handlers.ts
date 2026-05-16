import { delay, http, HttpResponse } from 'msw'

export const handlers = [
  http.get('http://localhost:8000/categories', ({ request }) => {
    const url = new URL(request.url)
    const name = url.searchParams.get('name')

    if (name === 'Food') {
      return HttpResponse.json([
        {
          id: '1',
          name: 'Food',
          allowed_type: 'expense',
          creatable: false,
        },
      ])
    }

    return HttpResponse.json([])
  }),

  http.post('http://localhost:8000/transactions', async ({ request }) => {
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
]
