
import React, { useState } from 'react'
import { Check, X, Edit2, Trash2, Clock, Repeat } from 'lucide-react'
import { useTasks } from '../../hooks/useTasks'
import { getCountdown, isDeadlineSoon } from '../../utils/dateUtils'
import Button from '../Common/Button'
import Modal from '../Common/Modal'
import TaskForm from './TaskForm'

const TaskCard = ({ task }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { markComplete, markUncomplete, removeTask } = useTasks()
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    if (task.todayCount >= task.frequency) return
    
    setLoading(true)
    try {
      await markComplete(task.id)
    } catch (error) {
      console.error('Failed to complete task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUncomplete = async () => {
    if (task.todayCount <= 0) return
    
    setLoading(true)
    try {
      await markUncomplete(task.id)
    } catch (error) {
      console.error('Failed to uncomplete task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    setLoading(true)
    try {
      await removeTask(task.id)
    } catch (error) {
      console.error('Failed to delete task:', error)
    } finally {
      setLoading(false)
    }
  }

  const progressPercentage = (task.todayCount / task.frequency) * 100
  const isDeadline = task.taskType === 'DEADLINE'
  const deadlineSoon = isDeadline && task.deadline && isDeadlineSoon(task.deadline)

  return (
    <>
      <div className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 p-4 transition-all
        ${task.todayCompleted ? 'border-green-500' : 'border-gray-200 dark:border-gray-700'}
        ${deadlineSoon ? 'border-orange-500' : ''}
      `}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-1">{task.title}</h4>
            {task.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
            )}
          </div>
          
          <div className="flex space-x-1 ml-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              disabled={loading}
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded transition-colors"
              disabled={loading}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Task Type Badge */}
        <div className="flex items-center space-x-2 mb-3">
          {isDeadline ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
              <Clock size={12} className="mr-1" />
              Deadline
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              <Repeat size={12} className="mr-1" />
              Daily
            </span>
          )}

          {task.todayCompleted && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              ✓ Completed
            </span>
          )}
        </div>

        {/* Deadline Countdown */}
        {isDeadline && task.deadline && (
          <div className={`
            mb-3 p-2 rounded-lg text-sm font-medium
            ${deadlineSoon 
              ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' 
              : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
          `}>
            ⏳ {getCountdown(task.deadline)} remaining
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium">
              {task.todayCount} / {task.frequency}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                task.todayCompleted ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={handleUncomplete}
            variant="secondary"
            size="sm"
            disabled={loading || task.todayCount === 0}
            className="flex-1"
          >
            <X size={16} className="mr-1" />
            Undo
          </Button>
          <Button
            onClick={handleComplete}
            variant={task.todayCompleted ? "success" : "primary"}
            size="sm"
            disabled={loading || task.todayCount >= task.frequency}
            className="flex-1"
          >
            <Check size={16} className="mr-1" />
            {task.todayCompleted ? 'Done' : 'Complete'}
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Task"
      >
        <TaskForm
          task={task}
          onClose={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </>
  )
}

export default TaskCard