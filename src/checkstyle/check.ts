import { flatMap } from "lodash";
import Check from "../check";
import CheckResult from "../check/result";
import LintResult from "../results/LintResult";
import CheckstyleParser from "./parser";
import CheckstyleReport, { toLintAnnotation } from "./types";

export default class CheckstyleCheck extends Check<CheckstyleReport> {
  public constructor() {
    super("checkstyle", "Checkstyle");
  }

  protected readReport(reportPath: string): CheckstyleReport | undefined {
    return new CheckstyleParser(reportPath).read();
  }

  protected getResult(reports: CheckstyleReport[]): CheckResult {
    const lintAnnotations = flatMap(reports, (report) => report.violations).map(toLintAnnotation);
    return new LintResult(lintAnnotations);
  }
}
