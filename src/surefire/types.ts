export default class SurefireReport {
  public constructor(
    public name = "",
    public tests = 0,
    public failures = 0,
    public errors = 0,
    public skipped = 0,
    public testCases: SurefireTestCase[] = []
  ) {}

  public get passed(): number {
    return this.tests - this.failures - this.errors - this.skipped;
  }

  public get packageName(): string {
    const idx = this.name.lastIndexOf(".");
    return idx === -1 ? "<no package>" : this.name.slice(0, idx);
  }
}

export interface SurefireTestCase {
  className: string;
  testName: string;
  result?: SurefireTestResult;
  message?: string;
  stackTrace?: string;
}

export type SurefireTestResult = "success" | "failure" | "error" | "skipped";
