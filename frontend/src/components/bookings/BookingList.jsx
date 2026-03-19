import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useBookings } from '../../hooks/useBookings'
import { bookingAPI, roomAPI } from '../../api/client'
import BookingCard from './BookingCard'
import BookingForm from './BookingForm'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

export default function BookingList() {
  const location = useLocation()
  const [showForm, setShowForm] = useState(false)
  const [rooms, setRooms] = useState({})
  const selectedRoom = location.state?.selectedRoom

  const { data: bookings, loading, error, refetch } = useBookings()

  useEffect(() => {
    // Загружаем названия комнат для отображения
    const loadRooms = async () => {
      try {
        const res = await roomAPI.getAll()
        const roomsMap = {}
        res.data.forEach(room => {
          roomsMap[room.id] = room.name
        })
        setRooms(roomsMap)
      } catch (err) {
        console.error('Ошибка загрузки комнат:', err)
      }
    }
    loadRooms()
  }, [])

  useEffect(() => {
    if (selectedRoom) {
      setShowForm(true)
    }
  }, [selectedRoom])

  const handleCreate = async (data) => {
    await bookingAPI.create(data)
    setShowForm(false)
    refetch()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите отменить бронирование?')) {
      try {
        await bookingAPI.delete(id)
        refetch()
      } catch (error) {
        alert('Ошибка удаления: ' + (error.response?.data?.detail || error.message))
      }
    }
  }

  return (
    <div>
      {/* Заголовок */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📅 Бронирования</h1>
          <p className="text-gray-500 mt-1">
            {bookings.length} {bookings.length === 1 ? 'бронирование' : bookings.length < 5 ? 'бронирования' : 'бронирований'}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          + Новое бронирование
        </Button>
      </div>

      {/* Загрузка */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          ❌ {error}
        </div>
      )}

      {/* Список бронирований */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              roomName={rooms[booking.room_id]}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Пустой список */}
      {!loading && !error && bookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">📭 Бронирований нет</p>
          <p className="text-gray-400 mt-2">Создайте первое бронирование!</p>
          <Button onClick={() => setShowForm(true)} className="mt-4">
            + Создать бронирование
          </Button>
        </div>
      )}

      {/* Модальное окно создания */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          // Очищаем state после закрытия
          if (selectedRoom) window.history.replaceState({}, document.title)
        }}
        title="📅 Новое бронирование"
        size="lg"
      >
        <BookingForm
          onSubmit={handleCreate}
          onCancel={() => {
            setShowForm(false)
            if (selectedRoom) window.history.replaceState({}, document.title)
          }}
          selectedRoom={selectedRoom}
        />
      </Modal>
    </div>
  )
}