import { RunCondition } from "../../check";
import PmdResult, { annotateViolation } from "../result";

describe("PmdResult", () => {
  it("handles an empty report", () => {
    const report = { violations: [] };
    const result = new PmdResult(RunCondition.autodetect, [report]);

    expect(result.shouldCompleteCheck()).toBe(true);
    expect(result.conclusion).toBe("success");
    expect(result.title).toBe("0 violations found");
    expect(result.summary).toBe("0 violations found");
    expect(result.text).toBeUndefined();
    expect(result.annotations).toStrictEqual([]);
  });
});

describe("annotateViolation()", () => {
  it("returns a failure annotation for a P1 violation", () => {
    const result = annotateViolation({
      filePath: "package/Class.java",
      startLine: 1,
      endLine: 2,
      startColumn: 3,
      endColumn: 4,
      ruleset: "ruleset",
      rule: "rule",
      priority: "1",
      message: "message",
    });
    expect(result).toStrictEqual({
      path: "package/Class.java",
      start_line: 1,
      end_line: 1,
      annotation_level: "failure",
      message: "message",
      title: "ruleset: rule",
    });
  });

  it("returns a warning annotation for a P5 violation", () => {
    const result = annotateViolation({
      filePath: "package/Class.java",
      startLine: 1,
      endLine: 2,
      startColumn: 3,
      endColumn: 4,
      ruleset: "ruleset",
      rule: "rule",
      priority: "5",
      message: "message",
    });
    expect(result).toStrictEqual({
      path: "package/Class.java",
      start_line: 1,
      end_line: 1,
      annotation_level: "warning",
      message: "message",
      title: "ruleset: rule",
    });
  });
});
