import { RunCondition } from "../../check/types";
import SurefireResult from "../result";

describe("SurefireResult", () => {
  it("can handle an empty report", () => {
    const report = {
      name: "com.example.ExampleTest",
      tests: 0,
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
});
