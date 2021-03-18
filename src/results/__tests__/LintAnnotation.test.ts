import LintAnnotation, { toCheckAnnotation } from "../LintAnnotation";

describe("toCheckAnnotation()", () => {
  it("maps a LintAnnotation without details", () => {
    const lint: LintAnnotation = {
      path: "path/to/Class.java",
      line: 1,
      level: "failure",
      category: "category",
      type: "type",
      message: "message",
    };
    const check = toCheckAnnotation(lint);
    expect(check).toStrictEqual({
      path: "path/to/Class.java",
      start_line: 1,
      end_line: 1,
      annotation_level: "failure",
      title: "category: type",
      message: "message",
      raw_details: undefined,
    });
  });

  it("maps a LintAnnotation with details", () => {
    const lint: LintAnnotation = {
      path: "path/to/Class.java",
      line: 1,
      level: "failure",
      category: "category",
      type: "type",
      message: "message",
      details: "details",
    };
    const check = toCheckAnnotation(lint);
    expect(check).toStrictEqual({
      path: "path/to/Class.java",
      start_line: 1,
      end_line: 1,
      annotation_level: "failure",
      title: "category: type",
      message: "message",
      raw_details: "details",
    });
  });
});
