import { findClasspath } from "../common/files";
import { CheckAnnotation } from "../github/types";
import SurefireTestCase from "./SurefireTestCase";

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

  public get moduleName(): string {
    const idx = this.name.lastIndexOf("$");
    const topLevelClass = idx === -1 ? this.name : this.name.slice(0, idx);
    const path = findClasspath(`${topLevelClass.split(".").join("/")}.java`);
    if (path) {
      const match = RegExp("(.*)/src/test/java/.*").exec(path);
      return match ? match[1] : "";
    }
    return "";
  }

  public get packageName(): string {
    const idx = this.name.lastIndexOf(".");
    return idx === -1 ? "<no package>" : this.name.slice(0, idx);
  }

  public get annotations(): CheckAnnotation[] {
    return this.testCases.map((testCase) => testCase.annotation);
  }
}
