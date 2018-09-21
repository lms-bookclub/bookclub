/**
 * Turns an object into JSON. Shorthand for standard arguments.
 *
 * @param {Object} object
 * @returns {string}
 */
export function toJSON(object = {}): string {
  return JSON.stringify(object, null, 4);
}