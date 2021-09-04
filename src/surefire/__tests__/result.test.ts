import { RunCondition } from "../../check/types";
import SurefireParser from "../parser";
import SurefireResult from "../result";

describe("SurefireResult", () => {
  it("can handle an empty Surefire report", () => {
    const report = {
      name: "com.example.ExampleTest",
      tests: 0,
      passed: 0,
      failures: 0,
      errors: 0,
      skipped: 0,
      testCases: [],
    };
    const result = new SurefireResult(RunCondition.autodetect, [report]);

    expect(result.shouldCompleteCheck()).toBe(true);
    expect(result.conclusion).toBe("success");
    expect(result.title).toBe("0 tests passed");
    expect(result.summary).toBeDefined();
    expect(result.text).toBeDefined();
    expect(result.annotations).toStrictEqual([]);
  });

  it("can handle a real Surefire report", () => {
    const report = new SurefireParser("src/surefire/__tests__/__fixtures__/v3/junit5.xml").read();
    expect(report).toBeDefined();

    const result = new SurefireResult(RunCondition.autodetect, [report!]); // eslint-disable-line
    expect(result.shouldCompleteCheck()).toBe(true);
    expect(result.conclusion).toBe("failure");
    expect(result.title).toBe("6 tests failed");
    expect(result.summary).toMatchSnapshot();
    expect(result.text).toMatchSnapshot();
    expect(result.annotations).toMatchSnapshot();
  });
});
