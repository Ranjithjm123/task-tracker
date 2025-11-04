import { useState, useEffect, useCallback } from 'react'
import { getTasks, createTask, updateTask, deleteTask, completeTask, uncompleteTask } from '../api/tasks'

export const useTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getTasks()
      setTasks(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTask = async (taskData) => {
    const newTask = await createTask(taskData)
    setTasks(prev => [...prev, newTask])
    return newTask
  }

  const modifyTask = async (id, updates) => {
    const updated = await updateTask(id, updates)
    setTasks(prev => prev.map(task => task.id === id ? updated : task))
    return updated
  }

  const removeTask = async (id) => {
    await deleteTask(id)
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const markComplete = async (id) => {
    const updated = await completeTask(id)
    setTasks(prev => prev.map(task => task.id === id ? updated : task))
    return updated
  }

  const markUncomplete = async (id) => {
    const updated = await uncompleteTask(id)
    setTasks(prev => prev.map(task => task.id === id ? updated : task))
    return updated
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    modifyTask,
    removeTask,
    markComplete,
    markUncomplete
  }
}