import * as core from "@actions/core";
import * as glob from "@actions/glob";
import CheckRun from "../github/check-run";
import ReportParser from "../common/parser";
import NoReportsResult from "../common/no-reports";

export default class Check<T> {
  private readonly type: string;
  private readonly friendlyName: string;
  readonly runCondition: RunCondition;
  private readonly checkRun: CheckRun;
  private readonly reportParser: ReportParser<T>;

  constructor(type: string, friendlyName: string, reportParser: ReportParser<T>) {
    this.type = type;
    this.friendlyName = friendlyName;
    this.runCondition = this.resolveRunCondition();
    this.checkRun = new CheckRun(this.type);
    this.reportParser = reportParser;
  }

  private resolveRunCondition() {
    const condition = core.getInput(this.type);
    switch (condition) {
      case "disabled":
      case "autodetect":
      case "expected":
      case "required":
        return RunCondition[condition];
      default:
        core.warning(`Invalid input: ${this.type} -- defaulting to autodetect`);
        return RunCondition.autodetect;
    }
  }

  async run() {
    if (this.runCondition === RunCondition.disabled) {
      core.warning(`${this.friendlyName} check is disabled.`);
      return;
    }
    if (this.runCondition >= RunCondition.expected) {
      await this.checkRun.queue();
    }
    const result = await this.runCheck();
    if (result !== undefined && result.shouldCompleteCheck()) {
      await this.checkRun.complete(result);
    }
    core.info(`${this.friendlyName} check finished.`);
  }

  async runCheck() {
    const searchPaths = this.resolveSearchPaths();
    const reportPaths = await this.resolveReportPaths(searchPaths);
    if (reportPaths.length === 0) {
      return new NoReportsResult(this.friendlyName, this.runCondition, searchPaths);
    }

    const reports = this.readReports(reportPaths);
  }

  private resolveSearchPaths() {
    return core.getInput(`${this.type}-report-paths`, { required: true }).split(",");
  }

  private async resolveReportPaths(searchPaths: string[]): Promise<string[]> {
    core.startGroup(`Searching for ${this.friendlyName} reports`);
    searchPaths.forEach((searchPath) => core.info(searchPath));
    core.endGroup();

    const globber = await glob.create(searchPaths.join("\n"));
    const reportPaths = await globber.glob();

    core.startGroup(`Found ${reportPaths.length} ${this.friendlyName} reports`);
    reportPaths.forEach((reportPath) => core.info(reportPath));
    core.endGroup();

    return reportPaths;
  }

  private readReports(reportPaths: string[]) {
    return reportPaths.map((reportPath) => this.reportParser.read(reportPath));
  }
}

export enum RunCondition {
  disabled,
  autodetect,
  expected,
  required,
}
