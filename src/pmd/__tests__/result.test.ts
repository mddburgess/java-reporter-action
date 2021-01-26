import PmdResult from "../result";
import { RunCondition } from "../../check";

describe("PmdResult", () => {
  it("can handle an empty report", () => {
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
