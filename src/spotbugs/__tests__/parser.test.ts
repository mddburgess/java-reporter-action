import SpotbugsParser from "../parser";

describe("SpotbugsParser", () => {
  it("can parse an empty SpotBugs report", () => {
    const report = new SpotbugsParser("src/spotbugs/__tests__/__fixtures__/empty.xml").read();
    expect(report).toMatchSnapshot();
  });
});
