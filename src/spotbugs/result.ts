import CheckResult from "../check/result";
import { RunCondition } from "../check/types";
import { AnnotationLevel, CheckAnnotation, CheckConclusion } from "../github/types";
import SpotbugsReport, { SpotbugsBug } from "./types";
import { plural, sum } from "../common/utils";
import wrap from "word-wrap";
import { flatMap } from "lodash";

export default class SpotbugsResult extends CheckResult {
  public constructor(
    private readonly runCondition: RunCondition,
    private readonly reports: SpotbugsReport[],
    private readonly classpath: string[]
  ) {
    super();
  }

  public shouldCompleteCheck(): boolean {
    return this.runCondition >= RunCondition.expected || this.reports.length > 0;
  }

  public get conclusion(): CheckConclusion {
    const bugs = sum(this.reports, (report) => report.bugs.length);
    return bugs > 0 ? "neutral" : "success";
  }

  public get title(): string {
    const bugs = sum(this.reports, (report) => report.bugs.length);
    return `${plural(bugs, "bug")} found`;
  }

  public get summary(): string {
    return this.title;
  }

  public get text(): string | undefined {
    return undefined;
  }

  public get annotations(): CheckAnnotation[] {
    return flatMap(this.reports, (report) => this.annotateReport(report));
  }

  private annotateReport(report: SpotbugsReport): CheckAnnotation[] {
    return report.bugs.map((bug) => this.annotateBug(bug, report.categories));
  }

  private annotateBug(bug: SpotbugsBug, categories: Map<string, string>): CheckAnnotation {
    return {
      path: this.resolvePath(bug.filePath),
      start_line: bug.startLine,
      end_line: bug.startLine,
      annotation_level: this.resolveAnnotationLevel(bug),
      message: wrap(bug.longMessage, { width: 100, indent: "" }),
      title: this.resolveTitle(bug, categories),
    };
  }

  private resolvePath(path: string): string {
    return this.classpath.filter((cp) => cp.endsWith(path))[0];
  }

  private resolveAnnotationLevel(bug: SpotbugsBug): AnnotationLevel {
    switch (bug.priority) {
      case 1:
        return "failure";
      case 2:
        return "warning";
      default:
        return "notice";
    }
  }

  private resolveTitle(bug: SpotbugsBug, categories: Map<string, string>) {
    const category = categories.get(bug.category) ?? bug.category;
    return `${category}: ${bug.shortMessage}`;
  }
}
