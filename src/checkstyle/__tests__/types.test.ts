import { CheckstyleViolation, toLintAnnotation } from "../types";

describe("toLintAnnotation()", () => {
  it("maps error severity to failure annotation", () => {
    const violation = mockViolation({ severity: "error" });
    const annotation = toLintAnnotation(violation);
    expect(annotation.level).toBe("failure");
  });

  it("maps warning severity to warning annotation", () => {
    const violation = mockViolation({ severity: "warning" });
    const annotation = toLintAnnotation(violation);
    expect(annotation.level).toBe("warning");
  });

  it("maps info severity to notice annotation", () => {
    const violation = mockViolation({ severity: "info" });
    const annotation = toLintAnnotation(violation);
    expect(annotation.level).toBe("notice");
  });

  it("throws error on invalid severity", () => {
    const violation = mockViolation({ severity: undefined });
    expect(() => toLintAnnotation(violation)).toThrow("Unexpected severity");
  });

  it("parses the Checkstyle rule category", () => {
    const violation = mockViolation({
      rule: "com.puppycrawl.tools.checkstyle.checks.javadoc.MissingJavadocTypeCheck",
    });
    const annotation = toLintAnnotation(violation);
    expect(annotation.category).toBe("com.puppycrawl.tools.checkstyle.checks.javadoc");
  });

  it("parses the Checkstyle rule type", () => {
    const violation = mockViolation({
      rule: "com.puppycrawl.tools.checkstyle.checks.javadoc.MissingJavadocTypeCheck",
    });
    const annotation = toLintAnnotation(violation);
    expect(annotation.type).toBe("MissingJavadocTypeCheck");
  });
});

const mockViolation = (values = {}): CheckstyleViolation => ({
  filePath: "path/to/Class.java",
  line: 1,
  column: 1,
  rule: "",
  severity: "info",
  message: "",
  ...values,
});
