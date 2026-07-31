import type { Mutation, Query } from '@tanstack/react-query'
import { refreshToken } from './auth'
import type { AxiosError } from 'axios'

let failedQueue: {
  query?: Query<unknown, unknown, unknown, readonly unknown[]>
  mutation?: Mutation<unknown, unknown, unknown, unknown>
  variables?: unknown
}[] = []

let isRefreshing = false

const processFailedQueue = () => {
  failedQueue.forEach(({ query, mutation, variables }) => {
    if (mutation) {
      const { options } = mutation
      mutation.setOptions({ ...options })
      mutation.execute(variables)
    }

    if (query) {
      query.fetch()
    }
  })

  isRefreshing = false
  failedQueue = []
}

const errorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  query?: Query<unknown, unknown, unknown, readonly unknown[]>,
  mutation?: Mutation<unknown, unknown, unknown, unknown>,
  variables?: unknown,
) => {
  if (shouldRefreshToken(error)) {
    if (mutation) {
      refreshTokenAndRetry(undefined, mutation, variables)
    } else {
      refreshTokenAndRetry(query)
    }

    return
  }

  console.error(error)
}

export const queryErrorHandler = (
  error: Error,
  query: Query<unknown, unknown, unknown, readonly unknown[]>,
) => {
  errorHandler(error, query)
}

export const mutationErrorHandler = (
  error: unknown,
  variables: unknown,
  _: unknown,
  mutation: Mutation<unknown, unknown, unknown, unknown>,
) => {
  errorHandler(error, undefined, mutation, variables)
}

const shouldRefreshToken = (error: AxiosError) => {
  const url = error.config?.url

  if (!url) {
    return false
  }

  const excludedRoutes = [
    '/auth/login',
    '/auth/signup',
    '/auth/logout',
    '/auth/token/refresh',
  ]

  return (
    error.response?.status === 401 &&
    !excludedRoutes.some((route) => url.includes(route))
  )
}

const refreshTokenAndRetry = async (
  query?: Query<unknown, unknown, unknown, readonly unknown[]>,
  mutation?: Mutation<unknown, unknown, unknown, unknown>,
  variables?: unknown,
) => {
  if (isRefreshing) {
    failedQueue.push({ query, mutation, variables })

    return
  }

  try {
    isRefreshing = true

    failedQueue.push({ query, mutation, variables })

    await refreshToken()

    processFailedQueue()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (refreshError: any) {
    if (refreshError.response?.status === 401) {
      window.location.href = '/session-expired'
    }
    // TODO: handle server errors
    console.error(refreshError)
  }
}
