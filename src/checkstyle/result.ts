import CheckResult from "../check/result";
import { AnnotationLevel, CheckAnnotation, CheckConclusion } from "../github/types";
import { RunCondition } from "../check";
import CheckstyleReport, { CheckstyleViolation } from "./types";
import { flatMap, plural, relativePath, sum } from "../common/utils";
import wrap from "word-wrap";

export default class CheckstyleResult extends CheckResult {
  constructor(
    private readonly runCondition: RunCondition,
    private readonly reports: CheckstyleReport[]
  ) {
    super();
  }

  shouldCompleteCheck(): boolean {
    return this.runCondition >= RunCondition.expected || this.reports.length > 0;
  }

  get conclusion(): CheckConclusion {
    return "neutral";
  }

  get title(): string {
    const violations = sum(this.reports, (report) => report.violations.length);
    return `${plural(violations, "violation")} found`;
  }

  get summary(): string {
    return this.title;
  }

  get text(): string | undefined {
    return undefined;
  }

  get annotations(): CheckAnnotation[] | undefined {
    return flatMap(this.reports, (report) => this.annotateReport(report));
  }

  private annotateReport(report: CheckstyleReport): CheckAnnotation[] {
    return report.violations.map((violation) => this.annotateViolation(violation));
  }

  private annotateViolation(violation: CheckstyleViolation): CheckAnnotation {
    return {
      path: relativePath(violation.filePath),
      start_line: violation.line,
      end_line: violation.line,
      annotation_level: this.resolveAnnotationLevel(violation),
      title: this.resolveTitle(violation),
      message: wrap(violation.message, { width: 100, indent: "" }),
    };
  }

  private resolveAnnotationLevel(violation: CheckstyleViolation): AnnotationLevel {
    switch (violation.severity) {
      case "error":
        return "failure";
      case "warning":
        return "warning";
      case "info":
        return "notice";
    }
  }

  private resolveTitle(violation: CheckstyleViolation) {
    return violation.rule.split(".").slice(-1)[0];
  }
}
