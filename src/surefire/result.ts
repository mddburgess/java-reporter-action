import CheckResult from "../check/result";
import { RunCondition } from "../check/types";
import { configureTable } from "../common/table";
import { AnnotationLevel, CheckAnnotation, CheckConclusion } from "../github/types";
import SurefireReport, { SurefireTestCase } from "./types";
import { plural } from "../common/utils";
import { flatMap } from "lodash";

export default class SurefireResult extends CheckResult {
  private readonly aggregate: SurefireReport;

  public constructor(
    private readonly runCondition: RunCondition,
    private readonly reports: SurefireReport[],
    private readonly classpath: string[]
  ) {
    super();
    this.aggregate = this.reports.reduce(aggregateReport);
  }

  public shouldCompleteCheck(): boolean {
    return this.runCondition >= RunCondition.expected || this.reports.length > 0;
  }

  public get conclusion(): CheckConclusion {
    if (this.aggregate.failures + this.aggregate.errors > 0) {
      return "failure";
    } else if (this.aggregate.skipped > 0) {
      return "neutral";
    } else {
      return "success";
    }
  }

  public get title(): string {
    const failuresAndErrors = this.aggregate.failures + this.aggregate.errors;
    if (failuresAndErrors > 0) {
      return `${plural(failuresAndErrors, "test")} failed`;
    }

    const passed = this.aggregate.tests - this.aggregate.skipped;
    return `${plural(passed, "test")} passed`;
  }

  public get summary(): string {
    return [
      `|Tests run|${this.aggregate.tests}|`,
      "|:-|-:|",
      `|Passed|${this.aggregate.passed}|`,
      `|Failures|${this.aggregate.failures}|`,
      `|Errors|${this.aggregate.errors}|`,
      `|Skipped|${this.aggregate.skipped}|`,
    ].join("\n");
  }

  public get text(): string | undefined {
    const table = configureTable({
      listBy: (report: SurefireReport) => report.packageName,
      reducer: aggregateReport,
      columns: [
        { header: "Package", justify: "left", value: (report) => `\`${report.packageName}\`` },
        { header: "Tests", justify: "right", value: (report) => `${report.tests}` },
        { header: "Passed", justify: "right", value: (report) => `${report.passed}` },
        { header: "Failures", justify: "right", value: (report) => `${report.failures}` },
        { header: "Errors", justify: "right", value: (report) => `${report.errors}` },
        { header: "Skipped", justify: "right", value: (report) => `${report.skipped}` },
      ],
    });
    return table(this.reports);
  }

  public get annotations(): CheckAnnotation[] {
    return flatMap(this.reports, (report) => this.annotateReport(report));
  }

  private annotateReport(report: SurefireReport): CheckAnnotation[] {
    return report.testCases.map((testCase) => this.annotateTestCase(testCase));
  }

  private annotateTestCase(testCase: SurefireTestCase): CheckAnnotation {
    const line = resolveLine(testCase);
    return {
      path: this.resolvePath(testCase.path) ?? testCase.className,
      start_line: line,
      end_line: line,
      annotation_level: resolveAnnotationLevel(testCase),
      message: resolveMessage(testCase),
      title: resolveTitle(testCase),
      raw_details: testCase.stackTrace,
    };
  }

  private resolvePath(path: string): string | undefined {
    return this.classpath.filter((cp) => cp.endsWith(path))[0];
  }
}

const aggregateReport = (acc: SurefireReport, curr: SurefireReport): SurefireReport =>
  new SurefireReport(
    acc.name,
    acc.tests + curr.tests,
    acc.failures + curr.failures,
    acc.errors + curr.errors,
    acc.skipped + curr.skipped,
    []
  );

export const resolveLine = (testCase: SurefireTestCase): number => {
  if (testCase.stackTrace) {
    const trace = testCase.stackTrace
      .split("\n")
      .filter((line) => line.includes(testCase.className))
      .pop();
    if (trace) {
      const match = RegExp(".*:(\\d+)").exec(trace);
      return Number(match ? match[1] : 1);
    }
  }
  return 1;
};

const resolveAnnotationLevel = (testCase: SurefireTestCase): AnnotationLevel => {
  switch (testCase.result) {
    case "failure":
    case "error":
      return "failure";
    case "skipped":
      return "notice";
    default:
      throw Error();
  }
};

const resolveMessage = (testCase: SurefireTestCase): string =>
  testCase.stackTrace ?? testCase.message ?? `Test ${testCase.result}`;

export const resolveTitle = (testCase: SurefireTestCase): string => {
  if (testCase.testName) {
    return `Test ${testCase.result}: ${testCase.simpleClassName}.${testCase.testName}`;
  } else {
    return `Test ${testCase.result}: ${testCase.simpleClassName}`;
  }
};
