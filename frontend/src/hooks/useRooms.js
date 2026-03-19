import { useState, useCallback } from 'react'
import { roomAPI } from '../api/client'

export function useRooms(initialFilters = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(initialFilters)

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
      )
      const response = await roomAPI.getAll(params)
      setData(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Загружаем один раз при монтировании
  useState(() => {
    fetchRooms()
  })

  return {
    data,
    loading,
    error,
    refetch: fetchRooms,
    setFilters
  }
}

export default useRooms