import React, { useState, useEffect } from 'react'
import { useTasks } from '../../hooks/useTasks'
import Input from '../Common/Input'
import Button from '../Common/Button'
import { TASK_TYPES } from '../../utils/constants'

const TaskForm = ({ task, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    taskType: TASK_TYPES.DAILY,
    frequency: 1,
    deadline: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { addTask, modifyTask } = useTasks()

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        taskType: task.taskType,
        frequency: task.frequency,
        deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : ''
      })
    }
  }, [task])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = {
        ...formData,
        frequency: parseInt(formData.frequency),
        deadline: formData.taskType === TASK_TYPES.DEADLINE && formData.deadline 
          ? new Date(formData.deadline).toISOString() 
          : null
      }

      if (task) {
        await modifyTask(task.id, data)
      } else {
        await addTask(data)
      }

      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Task Title"
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter task title"
        required
      />

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description (optional)"
          rows="3"
          className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Task Type <span className="text-red-500">*</span>
        </label>
        <select
          name="taskType"
          value={formData.taskType}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value={TASK_TYPES.DAILY}>Daily (Recurring)</option>
          <option value={TASK_TYPES.DEADLINE}>Deadline (One-time)</option>
        </select>
      </div>

      <Input
        label="Frequency (times per day)"
        type="number"
        name="frequency"
        value={formData.frequency}
        onChange={handleChange}
        min="1"
        required
      />

      {formData.taskType === TASK_TYPES.DEADLINE && (
        <Input
          label="Deadline"
          type="datetime-local"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
        />
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          fullWidth
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          fullWidth
        >
          {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}

export default TaskForm