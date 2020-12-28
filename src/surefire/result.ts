import CheckResult from "../check/result";
import { CheckAnnotation, CheckConclusion } from "../github/types";
import { RunCondition } from "../check";
import SurefireReport from "./types";
import { plural } from "../common/utils";

export default class SurefireResult extends CheckResult {
  private readonly aggregate: SurefireReport;

  constructor(
    private readonly runCondition: RunCondition,
    private readonly reports: SurefireReport[]
  ) {
    super();
    this.aggregate = SurefireResult.aggregate(reports);
  }

  private static aggregate(reports: SurefireReport[]) {
    return reports.reduce((summary, report) => ({
      name: "",
      tests: summary.tests + report.tests,
      failures: summary.failures + report.failures,
      errors: summary.errors + report.errors,
      skipped: summary.skipped + report.skipped,
      testCases: [],
    }));
  }

  shouldCompleteCheck(): boolean {
    return this.runCondition >= RunCondition.expected || this.reports.length > 0;
  }

  get conclusion(): CheckConclusion {
    if (this.aggregate.failures + this.aggregate.errors > 0) {
      return "failure";
    } else if (this.aggregate.skipped > 0) {
      return "neutral";
    } else {
      return "success";
    }
  }

  get title(): string {
    const failuresAndErrors = this.aggregate.failures + this.aggregate.errors;
    if (failuresAndErrors > 0) {
      return `${plural(failuresAndErrors, "test")} failed`;
    }

    const passed = this.aggregate.tests - this.aggregate.skipped;
    return `${plural(passed, "test")} passed`;
  }

  get summary(): string {
    const passed =
      this.aggregate.tests -
      this.aggregate.failures -
      this.aggregate.errors -
      this.aggregate.skipped;

    return [
      `|Tests run|${this.aggregate.tests}|`,
      `|:--|--:|`,
      `|:green_square: Passed|${passed}|`,
      `|:orange_square: Failures|${this.aggregate.failures}|`,
      `|:red_square: Errors|${this.aggregate.errors}|`,
      `|:black_large_square: Skipped|${this.aggregate.skipped}|`,
    ].join("\n");
  }

  get text(): string | undefined {
    return [
      `|Test suite|Tests|:green_square:|:orange_square:|:red_square:|:black_large_square:|`,
      `|:--|--:|--:|--:|--:|--:|`,
      ...this.reports.map((report) => this.reportText(report)),
    ].join("\n");
  }

  private reportText(report: SurefireReport): string {
    const passed = report.tests - report.failures - report.errors - report.skipped;
    return `|\`\`${report.name}\`\`|${report.tests}|${passed}|${report.failures}|${report.errors}|${report.skipped}|`;
  }

  get annotations(): CheckAnnotation[] | undefined {
    return undefined;
  }
}
