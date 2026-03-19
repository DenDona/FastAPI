import { formatDate, formatDateTime } from '../../utils/formatDate'

export default function BookingCard({ booking, roomName, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{booking.title}</h3>
          <p className="text-primary-600 font-medium mt-1">
            🏢 {roomName || `Комната #${booking.room_id}`}
          </p>
        </div>
        <span className={`
          px-3 py-1 rounded-full text-sm font-medium
          ${booking.status === 'confirmed' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'}
        `}>
          {booking.status === 'confirmed' ? '✓ Подтверждено' : '⏳ Ожидает'}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-600">
          <span className="mr-3 text-lg">📅</span>
          <div>
            <p className="text-sm">Начало: <strong>{formatDateTime(booking.start_time)}</strong></p>
            <p className="text-sm">Конец: <strong>{formatDateTime(booking.end_time)}</strong></p>
          </div>
        </div>

        <div className="flex items-center text-gray-600">
          <span className="mr-3 text-lg">⏱️</span>
          <span>
            Длительность: <strong>{Math.round((new Date(booking.end_time) - new Date(booking.start_time)) / 60000)} мин.</strong>
          </span>
        </div>
      </div>

      {booking.created_at && (
        <p className="text-xs text-gray-400 mb-4">
          Создано: {formatDate(booking.created_at)}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => onDelete?.(booking.id)}
          className="flex-1 py-2.5 px-4 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
        >
          🗑️ Отменить
        </button>
      </div>
    </div>
  )
}