import axios from 'axios'
import { refreshTokenOnce } from './refresh'
const API_URL: string =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    if (!originalRequest) {
      return Promise.reject(error)
    }

    if (
      originalRequest.url?.includes('/auth/token/refresh') ||
      originalRequest.url?.includes('/auth/logout')
    ) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await refreshTokenOnce()

        return api(originalRequest)
      } catch (refreshError) {
        window.location.href = '/session-expired'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
