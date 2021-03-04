import * as glob from "@actions/glob";
import SpotbugsParser from "../parser";

describe("SpotbugsParser", () => {
  it("can parse an empty SpotBugs report", () => {
    const report = new SpotbugsParser("src/spotbugs/__tests__/__fixtures__/empty.xml").read();
    expect(report).toMatchSnapshot();
  });

  it("can parse a real SpotBugs report", async () => {
    const globber = await glob.create("**/target/spotbugsXml.xml");
    const paths = await globber.glob();
    expect(paths.length).toBeGreaterThan(0);

    const report = new SpotbugsParser(paths[0]).read();
    expect(report).toMatchSnapshot();
  });
});
