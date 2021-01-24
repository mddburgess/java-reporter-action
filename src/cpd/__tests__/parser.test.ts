import CpdParser from "../parser";

describe("CpdParser", () => {
  it("can parse an empty CPD report", () => {
    const report = new CpdParser("src/cpd/__tests__/__fixtures__/empty.xml").read();
    expect(report).toMatchSnapshot();
  });
});
