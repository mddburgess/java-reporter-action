import { groupBy, keys } from "lodash";
import CheckResult from "../check/result";
import { RunCondition } from "../check/types";
import { configureTable } from "../common/table";
import { flatMap, plural } from "../common/utils";
import { CheckAnnotation, CheckConclusion } from "../github/types";
import SurefireReport from "./SurefireReport";

export default class SurefireResult extends CheckResult {
  private readonly aggregate: SurefireReport;

  public constructor(
    private readonly runCondition: RunCondition,
    private readonly reports: SurefireReport[]
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

    const reportsByModule = groupBy(this.reports, "moduleName");
    const modules = keys(reportsByModule).sort();
    const tables = modules.map((module) => `### ${module}\n${table(reportsByModule[module])}`);

    return tables.join("\n");
  }

  public get annotations(): CheckAnnotation[] {
    return flatMap(this.reports, (report) => report.annotations);
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
