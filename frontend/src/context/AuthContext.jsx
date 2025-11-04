import React, { createContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister, logout as apiLogout, refreshAccessToken } from '../api/auth'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('accessToken')
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    const response = await apiLogin(credentials)
    localStorage.setItem('accessToken', response.accessToken)
    localStorage.setItem('refreshToken', response.refreshToken)
    
    const userData = {
      id: response.userId,
      username: response.username,
      email: response.email
    }
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return response
  }

  const register = async (data) => {
    const response = await apiRegister(data)
    localStorage.setItem('accessToken', response.accessToken)
    localStorage.setItem('refreshToken', response.refreshToken)
    
    const userData = {
      id: response.userId,
      username: response.username,
      email: response.email
    }
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return response
}
const logout = async () => {
try {
await apiLogout()
} catch (error) {
console.error('Logout error:', error)
} finally {
localStorage.removeItem('accessToken')
localStorage.removeItem('refreshToken')
localStorage.removeItem('user')
setUser(null)
}
}
const refreshToken = async () => {
try {
const refreshTokenValue = localStorage.getItem('refreshToken')
if (!refreshTokenValue) throw new Error('No refresh token')
  const response = await refreshAccessToken(refreshTokenValue)
  localStorage.setItem('accessToken', response.accessToken)
  return response.accessToken
} catch (error) {
  logout()
  throw error
}
}
return (
<AuthContext.Provider value={{ user, login, register, logout, refreshToken, loading }}>
{children}
</AuthContext.Provider>
)
}