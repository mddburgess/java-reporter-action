import CheckResult from "../check/result";
import { CheckAnnotation, CheckConclusion } from "../github/types";
import { RunCondition } from "../check";
import PmdReport, { PmdViolation } from "./types";
import { flatMap, plural } from "../common/utils";
import path from "path";

export default class PmdResult extends CheckResult {
  constructor(private readonly runCondition: RunCondition, private readonly reports: PmdReport[]) {
    super();
  }

  shouldCompleteCheck(): boolean {
    return this.runCondition >= RunCondition.expected || this.reports.length > 0;
  }

  get conclusion(): CheckConclusion {
    return "neutral";
  }

  get title(): string {
    const violations = this.reports
      .map((report) => report.violations.length)
      .reduce((a, b) => a + b);
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

  private annotateReport(report: PmdReport): CheckAnnotation[] {
    return report.violations.map((violation) => this.annotateViolation(violation));
  }

  private annotateViolation(violation: PmdViolation): CheckAnnotation {
    return {
      path: this.resolvePath(violation),
      start_line: violation.startLine,
      end_line: violation.startLine,
      annotation_level: this.resolveAnnotationLevel(violation),
      message: violation.message,
      title: this.resolveTitle(violation),
    };
  }

  private resolvePath(violation: PmdViolation) {
    return process.env.GITHUB_WORKSPACE
      ? path.relative(process.env.GITHUB_WORKSPACE, violation.filePath)
      : violation.filePath;
  }

  private resolveAnnotationLevel(violation: PmdViolation) {
    return Number(violation.priority) <= 2 ? "failure" : "warning";
  }

  private resolveTitle(violation: PmdViolation) {
    return `${violation.ruleset}: ${violation.rule}`;
  }
}
