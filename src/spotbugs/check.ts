import Check from "../check";
import SpotbugsReport from "./types";
import CheckResult from "../check/result";
import SpotbugsParser from "./parser";
import SpotbugsResult from "./result";

export default class SpotbugsCheck extends Check<SpotbugsReport> {
  constructor() {
    super("spotbugs", "SpotBugs");
  }

  protected readReport(reportPath: string): SpotbugsReport | undefined {
    return new SpotbugsParser(reportPath).read();
  }

  protected getResult(reports: SpotbugsReport[]): CheckResult {
    return new SpotbugsResult(this.runCondition, reports);
  }
}
