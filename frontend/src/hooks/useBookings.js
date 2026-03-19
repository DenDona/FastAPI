import { useState, useEffect } from 'react'
import { bookingAPI } from '../api/client'

export function useBookings(filters = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchBookings = async () => {
      try {
        setLoading(true)
        setError(null)
        const params = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v != null && v !== '')
        )
        const response = await bookingAPI.getAll(params)

        if (isMounted) {
          setData(response.data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.detail || err.message || 'Ошибка загрузки')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchBookings()

    // Cleanup function
    return () => {
      isMounted = false
    }
  }, [JSON.stringify(filters)]) // Сериализуем filters для стабильной ссылки

  return { data, loading, error, refetch: () => {} }
}

export default useBookings