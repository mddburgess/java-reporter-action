export default interface SurefireReport {
  name: string;
  tests: number;
  passed: number;
  failures: number;
  errors: number;
  skipped: number;
  testCases: SurefireTestCase[];
}

export interface SurefireTestCase {
  className: string;
  testName: string;
  result?: SurefireTestResult;
  message?: string;
  stackTrace?: string;
}

export type SurefireTestResult = "success" | "failure" | "error" | "skipped";
