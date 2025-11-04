import React, { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import Header from '../Layout/Header'
import { getHeatmapData } from '../../api/stats'
import { format } from 'date-fns'

const History = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const data = await getHeatmapData(90)
      const completedDays = data.days
        .filter(day => day.allCompleted || day.completionCount > 0)
        .reverse()
      setHistory(completedDays)
    } catch (error) {
      console.error('Failed to fetch history:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Calendar className="mr-2" />
            Completion History
          </h2>

          {loading ? (
            <p className="text-center py-8">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="text-center py-8 text-gray-500 dark:text-gray-400">
              No completion history yet. Start completing tasks to build your streak!
            </p>
          ) : (
            <div className="space-y-4">
              {history.map((day, index) => (
                <div
                  key={index}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${day.allCompleted 
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {day.allCompleted ? '🔥' : '✓'}
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {format(new Date(day.date), 'EEEE, MMMM dd, yyyy')}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {day.completionCount} of {day.totalTasks} tasks completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {day.allCompleted && (
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-orange-500 text-white">
                          Perfect Day!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default History