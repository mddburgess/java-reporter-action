import CheckResult from "../check/result";
import { RunCondition } from "../check/types";
import { CheckAnnotation, CheckConclusion } from "../github/types";
import PmdReport, { PmdViolation } from "./types";
import { plural, relativePath, sum } from "../common/utils";
import { flatMap } from "lodash";

export default class PmdResult extends CheckResult {
  public constructor(
    private readonly runCondition: RunCondition,
    private readonly reports: PmdReport[]
  ) {
    super();
  }

  public shouldCompleteCheck(): boolean {
    return this.runCondition >= RunCondition.expected || this.reports.length > 0;
  }

  public get conclusion(): CheckConclusion {
    const violations = sum(this.reports, (report) => report.violations.length);
    return violations > 0 ? "neutral" : "success";
  }

  public get title(): string {
    const violations = sum(this.reports, (report) => report.violations.length);
    return `${plural(violations, "violation")} found`;
  }

  public get summary(): string {
    return this.title;
  }

  public get text(): string | undefined {
    return undefined;
  }

  public get annotations(): CheckAnnotation[] {
    return flatMap(this.reports, (report) => annotateReport(report));
  }
}

const annotateReport = (report: PmdReport): CheckAnnotation[] =>
  report.violations.map(annotateViolation);

export const annotateViolation = (violation: PmdViolation): CheckAnnotation => ({
  path: relativePath(violation.filePath),
  start_line: violation.startLine,
  end_line: violation.startLine,
  annotation_level: resolveAnnotationLevel(violation),
  message: violation.message,
  title: resolveTitle(violation),
});

const resolveAnnotationLevel = (violation: PmdViolation) =>
  Number(violation.priority) <= 2 ? "failure" : "warning";

const resolveTitle = (violation: PmdViolation) => `${violation.ruleset}: ${violation.rule}`;
