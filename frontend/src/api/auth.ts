import type { LoginRequest, SignupRequest, Token, User } from '@/types/auth'
import { api } from './client'

export const signup = async (request: SignupRequest) => {
  const { data } = await api.post('/auth/signup', request)
  return data
}

export const login = async (request: LoginRequest): Promise<Token> => {
  const { data } = await api.post('/auth/login', request)
  return data
}

export const logout = async () => {
  await api.post('/auth/logout')
}

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get('/users/me')
  return data
}
