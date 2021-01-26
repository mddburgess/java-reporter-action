import PmdParser from "../parser";

describe("PmdParser", () => {
  it("can parse an empty PMD report", () => {
    const report = new PmdParser("src/pmd/__tests__/__fixtures__/empty.xml").read();
    expect(report).toMatchSnapshot();
  });
});
