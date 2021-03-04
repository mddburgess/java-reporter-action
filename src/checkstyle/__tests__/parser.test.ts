import * as glob from "@actions/glob";
import CheckstyleParser from "../parser";

describe("CheckstyleParser", () => {
  it("can parse an empty Checkstyle report", () => {
    const report = new CheckstyleParser("src/checkstyle/__tests__/__fixtures__/empty.xml").read();
    expect(report).toMatchSnapshot();
  });

  it("can parse a real Checkstyle report", async () => {
    const globber = await glob.create("**/target/checkstyle-result.xml");
    const paths = await globber.glob();
    expect(paths.length).toBeGreaterThan(0);

    const report = new CheckstyleParser(paths[0]).read();
    expect(report).toMatchSnapshot();
  });
});
