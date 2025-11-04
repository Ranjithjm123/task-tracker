import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import Header from '../Layout/Header'
import Heatmap from './Heatmap'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import StatsPanel from './StatsPanel'
import Modal from '../Common/Modal'
import Button from '../Common/Button'
import LoadingSpinner from '../Common/LoadingSpinner'
import { useTasks } from '../../hooks/useTasks'

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { tasks, loading } = useTasks()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Stats Panel */}
        <StatsPanel />

        {/* Heatmap */}
        <div className="mb-8">
          <Heatmap />
        </div>

        {/* Task Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Tasks</h2>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              Add Task
            </Button>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <TaskList tasks={tasks} />
          )}
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default Dashboard