/**
 * Normalize a string to hyphenated lower case.
 * Source: https://gist.github.com/mathewbyrne/1280286
 *
 * @param {string} str
 * @returns {string}
 */
export function normalize(str: string): string {
  return str.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * Generates a string '1 point' or 'x points', based on the point value provided.
 *
 * @param {number} points
 * @returns {string}
 */
export function pointString(points: number): string {
  return `${points} ${points === 1 ? 'point' : 'points'}`;
}