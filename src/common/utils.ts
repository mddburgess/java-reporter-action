import path from "path";

export function chunk<T>(array: T[] | undefined, size: number): T[][] {
  if (array === undefined || array.length === 0) {
    return [[]];
  }
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function flatMap<T, R>(array: T[], fn: (object: T) => R[]): R[] {
  return array.map(fn).reduce((a, b) => a.concat(b));
}

export function plural(quantity: number, noun: string): string {
  return quantity === 1 ? `${quantity} ${noun}` : `${quantity} ${noun}s`;
}

export function relativePath(absolutePath: string): string {
  return process.env.GITHUB_WORKSPACE
    ? path.relative(process.env.GITHUB_WORKSPACE, absolutePath)
    : absolutePath;
}

export function sum<T>(array: T[], fn: (item: T) => number): number {
  return array.map(fn).reduce((a, b) => a + b);
}
