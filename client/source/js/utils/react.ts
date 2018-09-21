export function map(obj: object, callback: (any, string, number) => any) {
  return Object.keys(obj).map((key, i) => callback(obj[key], key, i));
}