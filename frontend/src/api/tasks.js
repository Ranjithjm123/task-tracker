import axios from './axios'

export const getTasks = async () => {
  const response = await axios.get('/tasks')
  return response.data
}

export const createTask = async (taskData) => {
  const response = await axios.post('/tasks', taskData)
  return response.data
}

export const updateTask = async (id, updates) => {
  const response = await axios.put(`/tasks/${id}`, updates)
  return response.data
}

export const deleteTask = async (id) => {
  const response = await axios.delete(`/tasks/${id}`)
  return response.data
}

export const completeTask = async (id) => {
  const response = await axios.post(`/tasks/${id}/complete`)
  return response.data
}

export const uncompleteTask = async (id) => {
  const response = await axios.post(`/tasks/${id}/uncomplete`)
  return response.data
}