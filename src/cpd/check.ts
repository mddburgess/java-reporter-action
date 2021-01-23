import Check from "../check";
import CpdReport from "./types";
import CheckResult from "../check/result";
import CpdResult from "./result";
import CpdParser from "./parser";

export default class CpdCheck extends Check<CpdReport> {
  constructor() {
    super("cpd", "CPD");
  }

  protected readReport(reportPath: string): CpdReport | undefined {
    return new CpdParser(reportPath).read();
  }

  protected getResult(reports: CpdReport[]): CheckResult {
    return new CpdResult(this.runCondition, reports);
  }
}
