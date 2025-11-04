import React, { useState, useEffect } from 'react'
import { Flame, Target, TrendingUp, CheckCircle } from 'lucide-react'
import { getStatsOverview } from '../../api/stats'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const StatsPanel = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await getStatsOverview()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return <div className="mb-8">Loading stats...</div>
  }

  const COLORS = ['#3b82f6', '#f59e0b']

  return (
    <div className="mb-8 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Streak</p>
              <p className="text-3xl font-bold text-orange-500">{stats.currentStreak}</p>
            </div>
            <Flame className="text-orange-500" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Longest Streak</p>
              <p className="text-3xl font-bold text-blue-500">{stats.longestStreak}</p>
            </div>
            <TrendingUp className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed Days</p>
              <p className="text-3xl font-bold text-green-500">{stats.totalCompletedDays}</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Tasks</p>
              <p className="text-3xl font-bold text-purple-500">{stats.activeTasks}</p>
            </div>
            <Target className="text-purple-500" size={32} />
          </div>
        </div>
      </div>

      {/* Charts */}
      {stats.taskTypeBreakdown && stats.taskTypeBreakdown.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Task Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.taskTypeBreakdown}
                dataKey="count"
                nameKey="taskType"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {stats.taskTypeBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default StatsPanel