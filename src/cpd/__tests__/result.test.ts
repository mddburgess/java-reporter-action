import { RunCondition } from "../../check/types";
import CpdResult from "../result";

describe("CpdResult", () => {
  it("can handle an empty report", () => {
    const report = { duplications: [] };
    const result = new CpdResult(RunCondition.autodetect, [report]);

    expect(result.shouldCompleteCheck()).toBe(true);
    expect(result.conclusion).toBe("success");
    expect(result.title).toBe("0 duplications found");
    expect(result.summary).toBe("0 duplications found");
    expect(result.text).toBeUndefined();
    expect(result.annotations).toStrictEqual([]);
  });
});
