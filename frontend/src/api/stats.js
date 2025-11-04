import axios from './axios'

export const getHeatmapData = async (days = 365) => {
  const response = await axios.get('/stats/heatmap', { params: { days } })
  return response.data
}

export const getStatsOverview = async () => {
  const response = await axios.get('/stats/overview')
  return response.data
}