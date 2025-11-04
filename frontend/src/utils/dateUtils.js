import { format, formatDistanceToNow, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns'

export const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy')
}

export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

export const getRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const getCountdown = (deadline) => {
  const now = new Date()
  const target = new Date(deadline)
  
  const days = differenceInDays(target, now)
  const hours = differenceInHours(target, now) % 24
  const minutes = differenceInMinutes(target, now) % 60
  
  if (days > 0) {
    return `${days}d ${hours}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m`
  } else {
    return 'Expired'
  }
}

export const isDeadlineSoon = (deadline) => {
  const days = differenceInDays(new Date(deadline), new Date())
  return days <= 3
}