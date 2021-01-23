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
