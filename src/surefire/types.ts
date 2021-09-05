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

export class SurefireTestCase {
  public constructor(
    public className = "",
    public testName = "",
    public result: SurefireTestResult = "success",
    public message?: string,
    public stackTrace?: string
  ) {}

  public get simpleClassName(): string {
    const idx = this.className.lastIndexOf(".") + 1;
    return this.className.slice(idx);
  }

  public get path(): string {
    const idx = this.className.lastIndexOf("$");
    const topLevelClass = idx === -1 ? this.className : this.className.slice(0, idx);
    return `${topLevelClass.split(".").join("/")}.java`;
  }
}

export type SurefireTestResult = "success" | "failure" | "error" | "skipped";
