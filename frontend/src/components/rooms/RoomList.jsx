import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRooms } from '../../hooks/useRooms'
import { roomAPI } from '../../api/client'
import RoomCard from './RoomCard'
import RoomForm from './RoomForm'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

export default function RoomList() {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [filters, setFilters] = useState({
    min_capacity: '',
    has_projector: '',
    is_available: '',
  })

  const { data: rooms, loading, error, refetch } = useRooms(filters)

  const handleCreate = async (data) => {
    await roomAPI.create(data)
    setShowForm(false)
    refetch()
  }

  const handleBook = (room) => {
    navigate('/bookings', { state: { selectedRoom: room } })
  }

  const clearFilters = () => {
    setFilters({
      min_capacity: '',
      has_projector: '',
      is_available: '',
    })
  }

  return (
    <div>
      {/* Заголовок */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🚪 Переговорные комнаты</h1>
          <p className="text-gray-500 mt-1">
            {rooms.length} {rooms.length === 1 ? 'комната' : rooms.length < 5 ? 'комнаты' : 'комнат'}
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
              <option value="true">Доступные</option>
              <option value="false">Недоступные</option>
            </select>
          </div>

          <Button variant="secondary" onClick={clearFilters}>
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

      {/* Ошибка */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          ❌ {error}
        </div>
      )}

      {/* Список комнат */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} onBook={handleBook} />
          ))}
        </div>
      )}

      {/* Пустой список */}
      {!loading && !error && rooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg"> Комнаты не найдены</p>
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