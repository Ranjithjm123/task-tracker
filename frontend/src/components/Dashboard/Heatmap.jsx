import React, { useState, useEffect } from 'react'
import { getHeatmapData } from '../../api/stats'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns'

const Heatmap = () => {
  const [heatmapData, setHeatmapData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHeatmapData()
  }, [])

  const fetchHeatmapData = async () => {
    try {
      const data = await getHeatmapData(365)
      setHeatmapData(data.days)
    } catch (error) {
      console.error('Failed to fetch heatmap data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIntensity = (day) => {
    if (!day.totalTasks) return 0
    const ratio = day.completionCount / day.totalTasks
    if (ratio === 0) return 0
    if (ratio < 0.5) return 1
    if (ratio < 0.75) return 2
    if (ratio < 1) return 3
    return 4
  }

  const getColor = (intensity, allCompleted) => {
    if (allCompleted) return 'bg-orange-500' // Fire emoji day
    
    const colors = [
      'bg-gray-200 dark:bg-gray-700',
      'bg-green-200 dark:bg-green-900',
      'bg-green-300 dark:bg-green-700',
      'bg-green-400 dark:bg-green-600',
      'bg-green-500 dark:bg-green-500'
    ]
    return colors[intensity]
  }

  // Get last 12 weeks of data
  const weeksToShow = 12
  const daysToShow = weeksToShow * 7
  const recentDays = heatmapData.slice(-daysToShow)

  // Organize into weeks
  const weeks = []
  for (let i = 0; i < recentDays.length; i += 7) {
    weeks.push(recentDays.slice(i, i + 7))
  }

  if (loading) {
    return <div className="text-center py-8">Loading heatmap...</div>
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Activity Heatmap</h2>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-4 h-4 rounded ${getColor(level, false)}`}
              />
            ))}
            <div className="w-4 h-4 rounded bg-orange-500" title="All tasks completed " />
            </div>
<span className="text-gray-600 dark:text-gray-400">More</span>
</div>
</div>
  <div className="overflow-x-auto">
    <div className="inline-flex space-x-1">
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col space-y-1">
          {week.map((day, dayIndex) => {
            const intensity = getIntensity(day)
            const colorClass = getColor(intensity, day.allCompleted)
            
            return (
              <div
                key={dayIndex}
                className={`w-3 h-3 rounded-sm ${colorClass} transition-all hover:scale-125 cursor-pointer`}
                title={`${format(new Date(day.date), 'MMM dd, yyyy')}\n${day.completionCount}/${day.totalTasks} tasks ${day.allCompleted ? '🔥' : ''}`}
              >
                {day.allCompleted && (
                  <span className="text-xs">🔥</span>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  </div>

  <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
    <p>🔥 = All tasks completed for the day!</p>
  </div>
</div>
)
}
export default Heatmap