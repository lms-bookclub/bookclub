interface ArrayConstructor {
  from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>;
  from<T>(arrayLike: ArrayLike<T>): Array<T>;
}

interface generateCallback {
  (i: number): any
}

export function generate(size: number, value: generateCallback|any) {
  let callback = typeof value === 'function'
    ? (v, i) => value(i)
    : () => value;

  return Array.from({ length: size }, callback);
}

export function randomEntry(array: any[]) {
  let i = Math.floor(Math.random() * array.length);

  return array[i];
}

export function closest(array: number[], target) {
  return array.reduce(function(prev, curr) {
      return (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);
  });
}