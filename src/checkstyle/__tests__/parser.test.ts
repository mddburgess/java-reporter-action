import CheckstyleParser from "../parser";

describe("CheckstyleParser", () => {
  it("can parse an empty Checkstyle report", () => {
    const report = new CheckstyleParser("src/checkstyle/__tests__/__fixtures__/empty.xml").read();
    expect(report).toMatchSnapshot();
  });
});
