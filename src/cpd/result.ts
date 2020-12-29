import CheckResult from "../check/result";
import { RunCondition } from "../check";
import CpdReport, { CpdDuplication, CpdFile } from "./types";
import { CheckAnnotation, CheckConclusion } from "../github/types";
import { flatMap, plural, relativePath } from "../common/utils";

export default class CpdResult extends CheckResult {
  constructor(private readonly runCondition: RunCondition, private readonly reports: CpdReport[]) {
    super();
  }

  shouldCompleteCheck(): boolean {
    return this.runCondition >= RunCondition.expected || this.reports.length > 0;
  }

  get conclusion(): CheckConclusion {
    const duplications = this.reports
      .map((report) => report.duplications.length)
      .reduce((a, b) => a + b);
    return duplications > 0 ? "neutral" : "success";
  }

  get title(): string {
    const duplications = this.reports
      .map((report) => report.duplications.length)
      .reduce((a, b) => a + b);
    return `${plural(duplications, "duplication")} found`;
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

  private annotateReport(report: CpdReport): CheckAnnotation[] {
    return flatMap(report.duplications, (duplication) => this.annotateDuplication(duplication));
  }

  private annotateDuplication(duplication: CpdDuplication): CheckAnnotation[] {
    duplication.files.forEach((file) => (file.path = relativePath(file.path)));
    return duplication.files.map((file) => this.annotateFile(duplication, file));
  }

  private annotateFile(duplication: CpdDuplication, file: CpdFile): CheckAnnotation {
    return {
      path: file.path,
      start_line: file.startLine,
      end_line: file.startLine,
      annotation_level: "warning",
      message: this.resolveMessage(duplication),
      title: this.resolveTitle(duplication),
    };
  }

  private resolveMessage(duplication: CpdDuplication) {
    return [
      `Found ${plural(duplication.lines, "line")} duplicated at:`,
      ...duplication.files.map((file) => `\t${file.path} lines ${file.startLine}-${file.endLine}`),
    ].join("\n");
  }

  private resolveTitle(duplication: CpdDuplication) {
    return plural(duplication.lines, "duplicated line");
  }
}
