import axios from 'axios'
const API_URL: string =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url?.includes('/auth/token/refresh') &&
//       !originalRequest.url?.includes('/auth/logout') &&
//       !originalRequest.url?.includes('/auth/login') &&
//       !originalRequest.url?.includes('/auth/signup')
//     ) {
//       originalRequest._retry = true

//       try {
//         await api.post('/auth/token/refresh')

//         return api(originalRequest)

//       } catch (refreshError) {

//         window.location.href = '/session-expired'

//         return Promise.reject(refreshError)
//       }
//     }

//     return Promise.reject(error)
//   }
// )
