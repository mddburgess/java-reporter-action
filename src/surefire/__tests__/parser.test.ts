import SurefireParser from "../parser";

describe("SurefireParser", () => {
  it("can parse a Surefire v2 report for JUnit 4", () => {
    const report = new SurefireParser("src/surefire/__tests__/__fixtures__/v2/junit4.xml").read();
    expect(report).toMatchSnapshot();
  });

  it("can parse a Surefire v2 report for JUnit 5", () => {
    const report = new SurefireParser("src/surefire/__tests__/__fixtures__/v2/junit5.xml").read();
    expect(report).toMatchSnapshot();
  });

  it("can parse a Surefire v3 report for JUnit 4", () => {
    const report = new SurefireParser("src/surefire/__tests__/__fixtures__/v3/junit4.xml").read();
    expect(report).toMatchSnapshot();
  });

  it("can parse a Surefire v3 report for JUnit 5", () => {
    const report = new SurefireParser("src/surefire/__tests__/__fixtures__/v3/junit5.xml").read();
    expect(report).toMatchSnapshot();
  });
});
