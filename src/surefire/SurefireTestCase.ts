import { findClasspath } from "../common/files";
import { AnnotationLevel, CheckAnnotation } from "../github/types";

export type SurefireTestResult = "success" | "failure" | "error" | "skipped";

export default class SurefireTestCase {
  private line = 0;

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

  public get annotation(): CheckAnnotation {
    return {
      path: findClasspath(this.annotationPath) ?? this.className,
      start_line: this.annotationLine,
      end_line: this.annotationLine,
      annotation_level: this.annotationLevel,
      message: this.annotationMessage,
      title: this.annotationTitle,
      raw_details: this.stackTrace,
    };
  }

  private get annotationPath(): string {
    const idx = this.className.lastIndexOf("$");
    const topLevelClass = idx === -1 ? this.className : this.className.slice(0, idx);
    return `${topLevelClass.split(".").join("/")}.java`;
  }

  private get annotationLine(): number {
    if (this.line === 0) {
      this.line = 1;
      const trace = this.stackTrace
        ?.split("\n")
        .filter((st) => st.includes(this.className))
        .pop();
      if (trace) {
        const match = RegExp(".*:(\\d+)").exec(trace);
        this.line = Number(match ? match[1] : 1);
      }
    }
    return this.line;
  }

  private get annotationLevel(): AnnotationLevel {
    switch (this.result) {
      case "failure":
      case "error":
        return "failure";
      case "skipped":
        return "notice";
      default:
        throw Error();
    }
  }

  private get annotationMessage(): string {
    return this.stackTrace ?? this.message ?? `Test ${this.result}`;
  }

  private get annotationTitle(): string {
    if (this.testName) {
      return `Test ${this.result}: ${this.simpleClassName}.${this.testName}`;
    } else {
      return `Test ${this.result}: ${this.simpleClassName}`;
    }
  }
}
