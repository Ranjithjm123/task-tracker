import axios from './axios'

export const login = async (credentials) => {
  const response = await axios.post('/auth/login', credentials)
  return response.data
}

export const register = async (userData) => {
  const response = await axios.post('/auth/register', userData)
  return response.data
}

export const logout = async () => {
  const response = await axios.post('/auth/logout')
  return response.data
}

export const refreshAccessToken = async (refreshToken) => {
  const response = await axios.post('/auth/refresh', { refreshToken })
  return response.data
}