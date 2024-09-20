import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/*
 * Best way to get error message.
 * vistit: https://remix.run/docs/en/main/guides/not-found#root-error-boundary
 */
export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }
  return 'Unknown Error'
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
