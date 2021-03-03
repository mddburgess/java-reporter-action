import { chunk } from "../utils";

describe("chunk()", () => {
  it("returns one empty chunk for undefined", () => {
    const result = chunk(undefined, 3);
    expect(result).toStrictEqual([[]]);
  });

  it("returns one empty chunk for an empty array", () => {
    const result = chunk([], 2);
    expect(result).toStrictEqual([[]]);
  });

  it("returns one chunk for an array smaller than the chunk size", () => {
    const result = chunk([1], 2);
    expect(result).toStrictEqual([[1]]);
  });

  it("returns one chunk for an array equal to the chunk size", () => {
    const result = chunk([1, 2], 2);
    expect(result).toStrictEqual([[1, 2]]);
  });

  it("returns multiple chunks for an array greater than the chunk size", () => {
    const result = chunk([1, 2, 3], 2);
    expect(result).toStrictEqual([[1, 2], [3]]);
  });
});
