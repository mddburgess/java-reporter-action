import SpotbugsResult from "../result";
import { RunCondition } from "../../check";

describe("SpotbugsResult", () => {
  it("can handle an empty report", () => {
    const report = { bugs: [], categories: new Map<string, string>() };
    const result = new SpotbugsResult(RunCondition.autodetect, [report]);

    expect(result.shouldCompleteCheck()).toBe(true);
    expect(result.conclusion).toBe("success");
    expect(result.title).toBe("0 bugs found");
    expect(result.summary).toBe("0 bugs found");
    expect(result.text).toBeUndefined();
    expect(result.annotations).toStrictEqual([]);
  });
});
