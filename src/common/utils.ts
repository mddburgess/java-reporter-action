export function flatMap<T, R>(array: T[], fn: (object: T) => R[]): R[] {
  return array.map(fn).reduce((a, b) => a.concat(b));
}

export function plural(quantity: number, noun: string): string {
  return quantity === 1 ? `${quantity} ${noun}` : `${quantity} ${noun}s`;
}
