import { useState, useEffect } from 'react';
import { roomAPI, bookingAPI } from '../../api/client';

export default function BookingForm({ onSubmit, onCancel }) {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    room_id: '',
    title: '',
    start_time: '',
    end_time: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    roomAPI.getAll().then(res => setRooms(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await bookingAPI.create({
        ...formData,
        room_id: Number(formData.room_id),
      });
      onSubmit();
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка создания бронирования');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h3 className="font-bold mb-3">📅 Новое бронирование</h3>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <select
        required
        value={formData.room_id}
        onChange={(e) => setFormData(f => ({ ...f, room_id: e.target.value }))}
        className="w-full border p-2 rounded mb-2"
      >
        <option value="">Выберите комнату</option>
        {rooms.map(r => (
          <option key={r.id} value={r.id}>{r.name} (вместимость: {r.capacity})</option>
        ))}
      </select>

      <input
        required
        type="text"
        placeholder="Название встречи"
        maxLength={200}
        value={formData.title}
        onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
        className="w-full border p-2 rounded mb-2"
      />

      <div className="grid grid-cols-2 gap-2 mb-2">
        <input
          required
          type="datetime-local"
          value={formData.start_time}
          onChange={(e) => setFormData(f => ({ ...f, start_time: e.target.value }))}
          className="border p-2 rounded"
        />
        <input
          required
          type="datetime-local"
          value={formData.end_time}
          onChange={(e) => setFormData(f => ({ ...f, end_time: e.target.value }))}
          className="border p-2 rounded"
        />
      </div>
      <p className="text-xs text-gray-500 mb-3">⏰ Время указывается в вашем часовом поясе</p>

      <div className="flex gap-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Забронировать
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
          Отмена
        </button>
      </div>
    </form>
  );
}