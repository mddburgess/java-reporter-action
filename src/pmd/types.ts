export default interface PmdReport {
  violations: PmdViolation[];
}

export interface PmdViolation {
  filePath: string;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
  ruleset: string;
  rule: string;
  priority: string;
  message: string;
}
