import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

export const getReports = async () => {
  const response = await api.get('/reports')
  return response.data
}

export const createReport = async (reportData) => {
  const response = await api.post('/reports', reportData)
  return response.data
}

export const updateReport = async (id, reportData) => {
  const response = await api.put(`/reports/${id}`, reportData)
  return response.data
}

export const deleteReport = async (id) => {
  const response = await api.delete(`/reports/${id}`)
  return response.data
}

export default api 