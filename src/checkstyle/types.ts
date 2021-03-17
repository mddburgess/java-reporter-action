import { AnnotationLevel } from "../github/types";
import LintAnnotation from "../results/LintAnnotation";

export default interface CheckstyleReport {
  violations: CheckstyleViolation[];
}

export interface CheckstyleViolation {
  filePath: string;
  line: number;
  column: number;
  rule: string;
  severity: CheckstyleSeverity;
  message: string;
}

export type CheckstyleSeverity = "error" | "warning" | "info";

export const toLintAnnotation = (violation: CheckstyleViolation): LintAnnotation => ({
  path: violation.filePath,
  line: violation.line,
  level: getLevel(violation.severity),
  category: getCategory(violation.rule),
  type: getType(violation.rule),
  message: violation.message,
});

const getLevel = (severity: CheckstyleSeverity): AnnotationLevel => {
  switch (severity) {
    case "error":
      return "failure";
    case "warning":
      return "warning";
    case "info":
      return "notice";
  }
};

const getCategory = (rule: string): string => {
  return "";
};

const getType = (rule: string): string => {
  return rule.split(".").slice(-1)[0];
};
