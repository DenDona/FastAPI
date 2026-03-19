import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

export function formatDate(dateString, formatStr = 'dd.MM.yyyy HH:mm') {
  try {
    const date = parseISO(dateString)
    return format(date, formatStr, { locale: ru })
  } catch (error) {
    return dateString
  }
}

export function formatDateShort(dateString) {
  return formatDate(dateString, 'dd.MM.yy')
}

export function formatTime(dateString) {
  return formatDate(dateString, 'HH:mm')
}

export function formatDateTime(dateString) {
  return formatDate(dateString, 'dd MMMM yyyy, HH:mm')
}

export default formatDate