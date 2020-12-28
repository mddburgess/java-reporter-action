import SurefireReport from "./types";
import Check from "../check";
import SurefireParser from "./parser";
import CheckResult from "../check/result";
import SurefireResult from "./result";

export default class SurefireCheck extends Check<SurefireReport> {
  constructor() {
    super("surefire", "Surefire", new SurefireParser());
  }

  protected getResult(reports: SurefireReport[]): CheckResult {
    return new SurefireResult(this.runCondition, reports);
  }
}
