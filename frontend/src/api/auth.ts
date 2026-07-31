import type { LoginRequest, SignupRequest, User } from '@/types/auth'
import { api } from './client'

export const signup = async (request: SignupRequest): Promise<User> => {
  const { data } = await api.post('/auth/signup', request)
  return data
}

export const login = async (request: LoginRequest): Promise<void> => {
  await api.post('/auth/login', request)
}

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout')
}

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get('/users/me')
  return data
}

export const refreshToken = async (): Promise<void> => {
  await api.post('auth/token/refresh')
}
