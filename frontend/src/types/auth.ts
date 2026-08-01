export type SignupRequest = {
  first_name: string
  last_name: string
  email: string
  password: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type Token = {
  access_token: string
  token_type: string
}

export type User = {
  email: string
  first_name: string
  last_name: string
  disabled: false
  id: string
}
