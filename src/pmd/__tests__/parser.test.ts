import * as glob from "@actions/glob";
import PmdParser from "../parser";

describe("PmdParser", () => {
  it("can parse an empty PMD report", () => {
    const report = new PmdParser("src/pmd/__tests__/__fixtures__/empty.xml").read();
    expect(report).toMatchSnapshot();
  });

  it("can parse a real PMD report", async () => {
    const globber = await glob.create("**/target/pmd.xml");
    const paths = await globber.glob();
    expect(paths.length).toBeGreaterThan(0);

    const report = new PmdParser(paths[0]).read();
    expect(report).toMatchSnapshot();
  });
});
