import { useEffect, useState } from 'react';
import { roomAPI } from '../../api/client';
import RoomCard from './RoomCard';
import RoomForm from './RoomForm';

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ min_capacity: '', has_projector: '' });

  const fetchRooms = async () => {
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const res = await roomAPI.getAll(params);
      setRooms(res.data);
    } catch (err) {
      console.error('Ошибка загрузки комнат:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, [filters]);

  const handleCreate = async (data) => {
    await roomAPI.create(data);
    setShowForm(false);
    fetchRooms();
  };

  if (loading) return <div className="p-4">Загрузка...</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🚪 Переговорные комнаты</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? '✕ Закрыть' : '+ Добавить комнату'}
        </button>
      </div>

      {showForm && <RoomForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}

      {/* Фильтры */}
      <div className="flex gap-4 mb-4">
        <input
          type="number"
          placeholder="Мин. вместимость"
          value={filters.min_capacity}
          onChange={(e) => setFilters(f => ({ ...f, min_capacity: e.target.value }))}
          className="border p-2 rounded"
        />
        <select
          value={filters.has_projector}
          onChange={(e) => setFilters(f => ({ ...f, has_projector: e.target.value }))}
          className="border p-2 rounded"
        >
          <option value="">Все проекторы</option>
          <option value="true">С проектором</option>
          <option value="false">Без проектора</option>
        </select>
      </div>

      {/* Список */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map(room => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
      {rooms.length === 0 && <p className="text-gray-500">Комнаты не найдены</p>}
    </div>
  );
}