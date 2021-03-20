import LintAnnotation from "../LintAnnotation";
import LintResult from "../LintResult";

const mockAnnotation = (values = {}): LintAnnotation => ({
  path: "",
  line: 1,
  level: "failure",
  category: "",
  type: "type",
  message: "message",
  details: "details",
  ...values,
});

describe("LintResult", () => {
  const notice = mockAnnotation({
    path: "path/to/Notice.java",
    level: "notice",
    category: "category 1",
  });
  const warning = mockAnnotation({
    path: "path/to/Warning.java",
    level: "warning",
    category: "category 2",
  });
  const failure = mockAnnotation({
    path: "path/to/Failure.java",
    level: "failure",
    category: "category 3",
  });

  it("reports success for an empty annotation list", () => {
    const result = new LintResult([]);
    expect(result.shouldCompleteCheck()).toBe(true);
    expect(result.conclusion).toBe("success");
    expect(result.title).toBe("Passed");
    expect(result.summary).toBe("Passed");
    expect(result.text).toBeUndefined();
    expect(result.annotations).toStrictEqual([]);
  });

  it("reports success for an annotation list containing notices", () => {
    const result = new LintResult([notice]);
    expect(result.shouldCompleteCheck()).toBe(true);
    expect(result.conclusion).toBe("success");
    expect(result.title).toBe("1 notice");
    expect(result.summary).toMatchSnapshot();
    expect(result.text).toMatchSnapshot();
    expect(result.annotations).toMatchSnapshot();
  });

  it("reports neutral for an annotation list containing warnings", () => {
    const result = new LintResult([notice, warning]);
    expect(result.shouldCompleteCheck()).toBe(true);
    expect(result.conclusion).toBe("neutral");
    expect(result.title).toBe("1 warning");
    expect(result.summary).toMatchSnapshot();
    expect(result.text).toMatchSnapshot();
    expect(result.annotations).toMatchSnapshot();
  });

  it("reports failure for an annotation list containing failures", () => {
    const result = new LintResult([notice, warning, failure]);
    expect(result.shouldCompleteCheck()).toBe(true);
    expect(result.conclusion).toBe("failure");
    expect(result.title).toBe("1 failure");
    expect(result.summary).toMatchSnapshot();
    expect(result.text).toMatchSnapshot();
    expect(result.annotations).toMatchSnapshot();
  });
});
