import SurefireReport from "./types";
import Check from "../check";
import SurefireParser from "./parser";
import CheckResult from "../check/result";
import SurefireResult from "./result";

export default class SurefireCheck extends Check<SurefireReport> {
  public constructor(private readonly classpath: string[]) {
    super("surefire", "Surefire");
  }

  protected readReport(reportPath: string): SurefireReport | undefined {
    return new SurefireParser(reportPath).read();
  }

  protected getResult(reports: SurefireReport[]): CheckResult {
    return new SurefireResult(this.runCondition, reports, this.classpath);
  }
}
