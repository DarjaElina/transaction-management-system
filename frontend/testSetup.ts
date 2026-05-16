import { afterAll, afterEach, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { server } from './src/mocks/server'

beforeAll(() => server.listen())

afterEach(() => {
  cleanup()
})

afterAll(() => server.close())
