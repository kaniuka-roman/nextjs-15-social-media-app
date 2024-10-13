import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDate, formatDistanceToNowStrict } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}
export const formatRelativeDate = (from: Date) => {
   const now = new Date()
   if (now.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
      return formatDistanceToNowStrict(from, { addSuffix: true })
   } else if (now.getFullYear() === from.getFullYear()) {
      return formatDate(from, 'MMM d HH:mm')
   } else {
      return formatDate(from, 'MMM d, yyy')
   }
}

export const formatNumber = (n: number) => {
   return Intl.NumberFormat('uk-UA', {
      notation: 'compact',
      maximumFractionDigits: 1,
   }).format(n)
}

export const slugify = (input: string) => {
   return input
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^a-z0-9-]/g, '')
}
