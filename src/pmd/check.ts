import Check from "../check";
import PmdReport from "./types";
import CheckResult from "../check/result";
import PmdParser from "./parser";
import PmdResult from "./result";

export default class PmdCheck extends Check<PmdReport> {
  constructor() {
    super("pmd", "PMD");
  }

  protected readReport(reportPath: string): PmdReport | undefined {
    return new PmdParser(reportPath).read();
  }

  protected getResult(reports: PmdReport[]): CheckResult {
    return new PmdResult(this.runCondition, reports);
  }
}
