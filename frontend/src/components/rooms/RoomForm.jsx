import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function RoomForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    capacity: initialData?.capacity || 1,
    floor: initialData?.floor || 1,
    has_projector: initialData?.has_projector || false,
    is_available: initialData?.is_available ?? true,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Очищаем ошибку при изменении
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Название обязательно'
    if (formData.name.length > 100) newErrors.name = 'Максимум 100 символов'
    if (formData.capacity < 1) newErrors.capacity = 'Минимум 1 человек'
    if (formData.capacity > 100) newErrors.capacity = 'Максимум 100 человек'
    if (formData.floor < 1) newErrors.floor = 'Минимум 1 этаж'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await onSubmit({
        ...formData,
        capacity: Number(formData.capacity),
        floor: Number(formData.floor),
      })
    } catch (error) {
      setErrors({ submit: error.response?.data?.detail || 'Ошибка сохранения' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.submit}
        </div>
      )}

      <Input
        label="Название комнаты *"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Переговорная А"
        maxLength={100}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Описание
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Описание комнаты..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Вместимость (чел.) *"
          name="capacity"
          type="number"
          value={formData.capacity}
          onChange={handleChange}
          error={errors.capacity}
          min={1}
          max={100}
        />
        <Input
          label="Этаж *"
          name="floor"
          type="number"
          value={formData.floor}
          onChange={handleChange}
          error={errors.floor}
          min={1}
        />
      </div>

      <div className="flex items-center space-x-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="has_projector"
            checked={formData.has_projector}
            onChange={handleChange}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-gray-700">📽️ Есть проектор</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="is_available"
            checked={formData.is_available}
            onChange={handleChange}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-gray-700">✓ Доступна для бронирования</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel} type="button">
          Отмена
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Сохранение...' : (initialData ? 'Обновить' : 'Создать')}
        </Button>
      </div>
    </form>
  )
}