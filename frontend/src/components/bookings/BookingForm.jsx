import { useState, useEffect } from 'react'
import { roomAPI, bookingAPI } from '../../api/client'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function BookingForm({ onSubmit, onCancel, selectedRoom = null }) {
  const [rooms, setRooms] = useState([])
  const [formData, setFormData] = useState({
    room_id: selectedRoom?.id || '',
    title: '',
    start_time: '',
    end_time: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [loadingRooms, setLoadingRooms] = useState(true)

  useEffect(() => {
    roomAPI.getAll({ is_available: true })
      .then(res => setRooms(res.data))
      .catch(console.error)
      .finally(() => setLoadingRooms(false))
  }, [])

  useEffect(() => {
    if (selectedRoom?.id) {
      setFormData(prev => ({ ...prev, room_id: selectedRoom.id }))
    }
  }, [selectedRoom])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.room_id) newErrors.room_id = 'Выберите комнату'
    if (!formData.title.trim()) newErrors.title = 'Название обязательно'
    if (formData.title.length > 200) newErrors.title = 'Максимум 200 символов'
    if (!formData.start_time) newErrors.start_time = 'Укажите время начала'
    if (!formData.end_time) newErrors.end_time = 'Укажите время окончания'

    if (formData.start_time && formData.end_time) {
      const start = new Date(formData.start_time)
      const end = new Date(formData.end_time)

      if (end <= start) {
        newErrors.end_time = 'Время окончания должно быть позже начала'
      }

      const duration = (end - start) / 60000
      if (duration > 480) {
        newErrors.end_time = 'Максимальная длительность 8 часов'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await bookingAPI.create({
        ...formData,
        room_id: Number(formData.room_id),
      })
      onSubmit()
    } catch (error) {
      setErrors({
        submit: error.response?.data?.detail || 'Ошибка создания бронирования. Возможно, комната уже занята.'
      })
    } finally {
      setLoading(false)
    }
  }

  const getMinDateTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.submit}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Комната *
        </label>
        {loadingRooms ? (
          <div className="px-4 py-2 border border-gray-300 rounded-lg text-gray-500">
            Загрузка...
          </div>
        ) : (
          <select
            name="room_id"
            value={formData.room_id}
            onChange={handleChange}
            className={`
              w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
              ${errors.room_id ? 'border-red-500' : 'border-gray-300'}
            `}
          >
            <option value="">Выберите комнату</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.name} (вместимость: {room.capacity}, этаж: {room.floor})
              </option>
            ))}
          </select>
        )}
        {errors.room_id && <p className="mt-1 text-sm text-red-600">{errors.room_id}</p>}
      </div>

      <Input
        label="Название встречи *"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="Совещание отдела"
        maxLength={200}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Начало *"
          name="start_time"
          type="datetime-local"
          value={formData.start_time}
          onChange={handleChange}
          error={errors.start_time}
          min={getMinDateTime()}
        />
        <Input
          label="Окончание *"
          name="end_time"
          type="datetime-local"
          value={formData.end_time}
          onChange={handleChange}
          error={errors.end_time}
          min={formData.start_time || getMinDateTime()}
        />
      </div>

      {formData.start_time && formData.end_time && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          ⏱️ Длительность: <strong>{Math.round((new Date(formData.end_time) - new Date(formData.start_time)) / 60000)} мин.</strong>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel} type="button">
          Отмена
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Создание...' : '📅 Забронировать'}
        </Button>
      </div>
    </form>
  )
}