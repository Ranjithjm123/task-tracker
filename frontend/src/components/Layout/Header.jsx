import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, History, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import ThemeToggle from './ThemeToggle'

const Header = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-blue-600">Task Tracker 🔥</h1>
            
            <nav className="flex space-x-4">
              <Link
                to="/"
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
                  ${isActive('/') 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
              >
                <Home size={18} />
                <span>Dashboard</span>
              </Link>
              
              <Link
                to="/history"
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
                  ${isActive('/history') 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
              >
                <History size={18} />
                <span>History</span>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Welcome, </span>
              <span className="font-semibold">{user?.username}</span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header