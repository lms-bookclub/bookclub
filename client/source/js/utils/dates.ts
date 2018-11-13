/**
 * Turns a timestamp into a human-readable string. Provides app-standard arguments.
 *
 * @param {string} timestamp
 * @returns {string}
 */
export function toStandardString(timestamp: string): string {
  return new Date(timestamp).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get the time in milliseconds of a given timestamp. Uses Date.now() if not found.
 * @param {string} timestamp
 */
export function timeOf(timestamp?: string): number {
  return new Date(timestamp || Date.now()).getTime()
}