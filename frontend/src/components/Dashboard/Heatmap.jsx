import React, { useState, useEffect } from 'react'
import { getHeatmapData } from '../../api/stats'
import {
  format,
  subDays,
  eachDayOfInterval,
  getDay,
  getMonth,
} from 'date-fns'

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
    if (allCompleted) return 'bg-orange-500'
    const colors = [
      'bg-gray-200 dark:bg-gray-700',
      'bg-green-200 dark:bg-green-900',
      'bg-green-300 dark:bg-green-700',
      'bg-green-400 dark:bg-green-600',
      'bg-green-500 dark:bg-green-500',
    ]
    return colors[intensity]
  }

  // === Create GitHub-style calendar structure ===
  const today = new Date()
  const startDate = subDays(today, 364)
  const allDays = eachDayOfInterval({ start: startDate, end: today })

  // Map fetched data by date
  const dataMap = new Map()
  heatmapData.forEach((d) => dataMap.set(format(new Date(d.date), 'yyyy-MM-dd'), d))

  // Group into weeks (Sunday–Saturday)
  const weeks = []
  let currentWeek = []

  allDays.forEach((date) => {
    const dayData = dataMap.get(format(date, 'yyyy-MM-dd')) || {
      date,
      totalTasks: 0,
      completionCount: 0,
      allCompleted: false,
    }
    currentWeek.push(dayData)

    if (getDay(date) === 6) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })
  if (currentWeek.length > 0) weeks.push(currentWeek)

  // Determine month labels
  const monthLabels = []
  let lastMonth = null
  weeks.forEach((week, index) => {
    if (week.length > 0) {
      const firstDay = new Date(week[0].date)
      const month = getMonth(firstDay)
      if (month !== lastMonth) {
        monthLabels.push({
          label: format(firstDay, 'MMM'),
          index,
        })
        lastMonth = month
      }
    }
  })

  if (loading) {
    return <div className="text-center py-8">Loading heatmap...</div>
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      {/* Header and Legend */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Activity Heatmap</h2>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-4 h-4 rounded ${getColor(level, false)}`}
              />
            ))}
            <div className="w-4 h-4 rounded bg-orange-500" title="All tasks completed" />
          </div>
          <span className="text-gray-600 dark:text-gray-400">More</span>
        </div>
      </div>

      {/* === Month Labels Row === */}
      <div className="overflow-x-auto">
        <div className="flex flex-col">
          {/* Month Labels */}
          <div className="flex mb-1 text-xs text-gray-500 dark:text-gray-400">
            {weeks.map((_, weekIndex) => {
              const label = monthLabels.find((m) => m.index === weekIndex)
              return (
                <div key={weekIndex} className="w-4 h-3 flex justify-center">
                  {label ? label.label : ''}
                </div>
              )
            })}
          </div>

          {/* Heatmap Grid */}
          <div className="flex space-x-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col space-y-[3px]">
                {Array.from({ length: 7 }).map((_, i) => {
                  const day = week[i]
                  const date = day ? new Date(day.date) : null
                  const intensity = day ? getIntensity(day) : 0
                  const colorClass = day
                    ? getColor(intensity, day.allCompleted)
                    : 'bg-gray-100 dark:bg-gray-700'

                  return (
                    <div
                      key={i}
                      className={`w-3.5 h-3.5 rounded-sm ${colorClass} hover:scale-110 transition-transform duration-150 cursor-pointer`}
                      title={
                        date
                          ? `${format(date, 'MMM dd, yyyy')} — ${day.completionCount}/${day.totalTasks} tasks ${day.allCompleted ? '🔥' : ''
                          }`
                          : ''
                      }
                    ></div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>🔥 = All tasks completed for the day!</p>
      </div>
    </div>
  )
}

export default Heatmap
