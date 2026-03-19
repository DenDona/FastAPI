import { useState, useEffect, useCallback } from 'react'
import { roomAPI } from '../api/client'

export function useRooms(filters = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  return { data, loading, error, refetch: fetchRooms }
}

export default useRooms