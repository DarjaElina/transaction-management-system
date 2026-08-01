import { refreshToken } from './auth'

let refreshPromise: Promise<void> | null = null

export const refreshTokenOnce = () => {
  if (!refreshPromise) {
    refreshPromise = refreshToken().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}
