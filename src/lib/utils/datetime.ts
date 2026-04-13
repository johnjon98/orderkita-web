import { format, formatDistanceToNow, parseISO, differenceInMinutes } from 'date-fns'

export function formatDateTime(utcString: string): string {
  return format(parseISO(utcString), 'd MMM yyyy, h:mm a')
}

export function formatTime(utcString: string): string {
  return format(parseISO(utcString), 'h:mm a')
}

export function formatDate(utcString: string): string {
  return format(parseISO(utcString), 'd MMM yyyy')
}

export function timeAgo(utcString: string): string {
  return formatDistanceToNow(parseISO(utcString), { addSuffix: true })
}

export function elapsedMinutes(utcString: string): number {
  return differenceInMinutes(new Date(), parseISO(utcString))
}

export function formatElapsed(utcString: string): string {
  const mins = elapsedMinutes(utcString)
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  const remaining = mins % 60
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`
}
