import { useState, useEffect } from 'react'
import { roomAPI } from '../api/client'

export function useRooms(filters = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchRooms = async () => {
      try {
        setLoading(true)
        setError(null)
        const params = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v != null && v !== '')
        )
        const response = await roomAPI.getAll(params)

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

    fetchRooms()

    return () => {
      isMounted = false
    }
  }, [JSON.stringify(filters)])

  return { data, loading, error, refetch: () => {} }
}

export default useRooms