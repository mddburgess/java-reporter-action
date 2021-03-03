import CheckResult from "../check/result";
import { CheckAnnotation, CheckConclusion } from "../github/types";
import { RunCondition } from "../check";
import PmdReport, { PmdViolation } from "./types";
import { flatMap, plural, relativePath, sum } from "../common/utils";

export default class PmdResult extends CheckResult {
  constructor(private readonly runCondition: RunCondition, private readonly reports: PmdReport[]) {
    super();
  }

  shouldCompleteCheck(): boolean {
    return this.runCondition >= RunCondition.expected || this.reports.length > 0;
  }

  get conclusion(): CheckConclusion {
    const violations = sum(this.reports, (report) => report.violations.length);
    return violations > 0 ? "neutral" : "success";
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

  get annotations(): CheckAnnotation[] {
    return flatMap(this.reports, (report) => this.annotateReport(report));
  }

  private annotateReport(report: PmdReport): CheckAnnotation[] {
    return report.violations.map((violation) => this.annotateViolation(violation));
  }

  private annotateViolation(violation: PmdViolation): CheckAnnotation {
    return {
      path: relativePath(violation.filePath),
      start_line: violation.startLine,
      end_line: violation.startLine,
      annotation_level: this.resolveAnnotationLevel(violation),
      message: violation.message,
      title: this.resolveTitle(violation),
    };
  }

  private resolveAnnotationLevel(violation: PmdViolation) {
    return Number(violation.priority) <= 2 ? "failure" : "warning";
  }

  private resolveTitle(violation: PmdViolation) {
    return `${violation.ruleset}: ${violation.rule}`;
  }
}
