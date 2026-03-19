import { formatDate } from '../../utils/formatDate'

export default function RoomCard({ room, onBook }) {
  const isBusyNow = !room.is_available

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
          <p className="text-gray-500 text-sm mt-1">{room.description || 'Нет описания'}</p>
        </div>
        <span className={`
          px-3 py-1 rounded-full text-sm font-medium
          ${isBusyNow 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'}
        `}>
          {isBusyNow ? '✗ Занята' : '✓ Свободна'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <span className="mr-2">👥</span>
          <span>Вместимость: <strong>{room.capacity}</strong> чел.</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="mr-2">📽️</span>
          <span>Проектор: <strong>{room.has_projector ? 'Есть' : 'Нет'}</strong></span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="mr-2">📍</span>
          <span>Этаж: <strong>{room.floor || 'Не указан'}</strong></span>
        </div>
      </div>

      {room.created_at && (
        <p className="text-xs text-gray-400 mb-4">
          Создана: {formatDate(room.created_at)}
        </p>
      )}

      {room.has_future_bookings && !isBusyNow && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-2 rounded-lg mb-4 text-sm">
          ⏰ Есть будущие бронирования
        </div>
      )}

      <button
        onClick={() => onBook?.(room)}
        disabled={isBusyNow}
        className={`
          w-full py-2.5 px-4 rounded-lg font-medium transition-colors
          ${!isBusyNow
            ? 'bg-primary-600 text-white hover:bg-primary-700'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
        `}
      >
        {!isBusyNow ? '📅 Забронировать' : ' Занята сейчас'}
      </button>
    </div>
  )
}