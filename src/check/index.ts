import * as core from "@actions/core";
import * as glob from "@actions/glob";
import CheckRun from "../github/check-run";

export default class Check {
  private readonly type: string;
  private readonly friendlyName: string;
  readonly runCondition: RunCondition;
  private readonly checkRun: CheckRun;

  constructor(type: string, friendlyName: string) {
    this.type = type;
    this.friendlyName = friendlyName;
    this.runCondition = this.resolveRunCondition();
    this.checkRun = new CheckRun(this.type);
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

    const reportPaths = await this.resolveReportPaths();
    if (reportPaths.length === 0) {
      if (this.runCondition >= RunCondition.expected) {
        const conclusion = this.runCondition === RunCondition.required ? "failure" : "neutral";
        await this.checkRun.complete(conclusion);
      }
      return;
    }

    core.info(`${this.friendlyName} check finished.`);
  }

  private async resolveReportPaths(): Promise<string[]> {
    const searchPaths = core.getInput(`${this.type}-report-paths`, { required: true });
    const globber = await glob.create(searchPaths.split(".").join("\n"));
    return globber.glob();
  }
}

export enum RunCondition {
  disabled,
  autodetect,
  expected,
  required,
}
