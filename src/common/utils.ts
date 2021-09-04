import path from "path";

export const chunk = <T>(array: T[] | undefined, size: number): T[][] => {
  if (array === undefined || array.length === 0) {
    return [[]];
  }
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const plural = (quantity: number, noun: string): string =>
  quantity === 1 ? `${quantity} ${noun}` : `${quantity} ${noun}s`;

export const relativePath = (absolutePath: string): string =>
  process.env.GITHUB_WORKSPACE
    ? path.relative(process.env.GITHUB_WORKSPACE, absolutePath)
    : absolutePath;

export const sum = <T>(array: T[], fn: (item: T) => number): number =>
  array.map(fn).reduce((a, b) => a + b, 0);
