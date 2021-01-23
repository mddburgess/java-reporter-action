import Check from "../check";
import CheckstyleReport from "./types";
import CheckstyleParser from "./parser";
import CheckResult from "../check/result";
import CheckstyleResult from "./result";

export default class CheckstyleCheck extends Check<CheckstyleReport> {
  constructor() {
    super("checkstyle", "Checkstyle");
  }

  protected readReport(reportPath: string): CheckstyleReport | undefined {
    return new CheckstyleParser(reportPath).read();
  }

  protected getResult(reports: CheckstyleReport[]): CheckResult {
    return new CheckstyleResult(this.runCondition, reports);
  }
}
