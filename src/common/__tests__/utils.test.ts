import { chunk, plural } from "../utils";

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

describe("plural()", () => {
  it("uses plural form for quantity 0", () => {
    const result = plural(0, "noun");
    expect(result).toBe("0 nouns");
  });

  it("uses singular form for quantity 1", () => {
    const result = plural(1, "noun");
    expect(result).toBe("1 noun");
  });

  it("uses plural form for quantity greater than 1", () => {
    const result = plural(2, "noun");
    expect(result).toBe("2 nouns");
  });
});
