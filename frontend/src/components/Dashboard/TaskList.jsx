import React from 'react'
import TaskCard from './TaskCard'

const TaskList = ({ tasks }) => {
  const dailyTasks = tasks.filter(task => task.taskType === 'DAILY')
  const deadlineTasks = tasks.filter(task => task.taskType === 'DEADLINE')

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No tasks yet. Create your first task to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {dailyTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            Daily Tasks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {deadlineTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
            Deadline Tasks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deadlineTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskList