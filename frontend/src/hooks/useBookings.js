import { useState, useEffect, useCallback } from 'react'
import { bookingAPI } from '../api/client'

export function useBookings(filters = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
      )
      const response = await bookingAPI.getAll(params)
      setData(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  return { data, loading, error, refetch: fetchBookings }
}

export default useBookings