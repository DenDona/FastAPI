import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { roomAPI, bookingAPI } from '../../api/client'
import RoomCard from './RoomCard'
import RoomForm from './RoomForm'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

export default function RoomList() {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filters, setFilters] = useState({
    min_capacity: '',
    has_projector: '',
    is_available: '',
  })

  // Загружаем комнаты и бронирования
  const fetchData = async () => {
    try {
      setLoading(true)
      const [roomsRes, bookingsRes] = await Promise.all([
        roomAPI.getAll(),
        bookingAPI.getAll()
      ])
      setRooms(roomsRes.data)
      setBookings(bookingsRes.data)
    } catch (error) {
      console.error('Ошибка загрузки:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Проверяем, занята ли комната прямо сейчас
  const isRoomBusyNow = (roomId) => {
    const now = new Date()
    return bookings.some(booking => {
      if (booking.room_id !== roomId) return false
      const start = new Date(booking.start_time)
      const end = new Date(booking.end_time)
      return now >= start && now <= end
    })
  }

  // Проверяем, будет ли комната занята в будущем
  const hasFutureBookings = (roomId) => {
    const now = new Date()
    return bookings.some(booking => {
      if (booking.room_id !== roomId) return false
      return new Date(booking.start_time) > now
    })
  }

  const handleCreate = async (data) => {
    await roomAPI.create(data)
    setShowForm(false)
    fetchData()
  }

  const handleBook = (room) => {
    navigate('/bookings', { state: { selectedRoom: room } })
  }

  // Фильтрация комнат
  const filteredRooms = rooms.filter(room => {
    if (filters.min_capacity && room.capacity < Number(filters.min_capacity)) return false
    if (filters.has_projector === 'true' && !room.has_projector) return false
    if (filters.has_projector === 'false' && room.has_projector) return false

    const isBusy = isRoomBusyNow(room.id)
    if (filters.is_available === 'true' && isBusy) return false
    if (filters.is_available === 'false' && !isBusy) return false

    return true
  })

  return (
    <div>
      {/* Заголовок */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🚪 Переговорные комнаты</h1>
          <p className="text-gray-500 mt-1">
            {filteredRooms.length} {filteredRooms.length === 1 ? 'комната' : filteredRooms.length < 5 ? 'комнаты' : 'комнат'}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          + Добавить комнату
        </Button>
      </div>

      {/* Фильтры */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Мин. вместимость
            </label>
            <input
              type="number"
              value={filters.min_capacity}
              onChange={(e) => setFilters(f => ({ ...f, min_capacity: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="От 1"
              min={1}
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Проектор
            </label>
            <select
              value={filters.has_projector}
              onChange={(e) => setFilters(f => ({ ...f, has_projector: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Все</option>
              <option value="true">С проектором</option>
              <option value="false">Без проектора</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <select
              value={filters.is_available}
              onChange={(e) => setFilters(f => ({ ...f, is_available: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Все</option>
              <option value="true">Свободные сейчас</option>
              <option value="false">Занятые сейчас</option>
            </select>
          </div>

          <Button
            variant="secondary"
            onClick={() => setFilters({ min_capacity: '', has_projector: '', is_available: '' })}
          >
            Сбросить
          </Button>
        </div>
      </div>

      {/* Загрузка */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Список комнат */}
      {!loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => {
            const isBusyNow = isRoomBusyNow(room.id)
            const hasFuture = hasFutureBookings(room.id)

            return (
              <RoomCard
                key={room.id}
                room={{
                  ...room,
                  is_available: !isBusyNow, // Динамический статус!
                  has_future_bookings: hasFuture
                }}
                onBook={handleBook}
              />
            )
          })}
        </div>
      )}

      {/* Пустой список */}
      {!loading && filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">😕 Комнаты не найдены</p>
          <p className="text-gray-400 mt-2">Измените фильтры или добавьте новую комнату</p>
        </div>
      )}

      {/* Модальное окно создания */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="🆕 Новая комната"
        size="lg"
      >
        <RoomForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  )
}