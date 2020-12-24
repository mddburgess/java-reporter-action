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

    const searchPaths = this.resolveSearchPaths();
    const reportPaths = await this.resolveReportPaths(searchPaths);
    if (reportPaths.length === 0) {
      if (this.runCondition >= RunCondition.expected) {
        const conclusion = this.runCondition === RunCondition.required ? "failure" : "skipped";
        await this.checkRun.saveCheck({
          status: "completed",
          conclusion,
          output: {
            title: "No reports found",
            summary: `${this.friendlyName} reports are ${
              this.runCondition === RunCondition.required ? "required" : "expected"
            }, but no reports were found.`,
            text: ["#### Search paths", "```sh", ...searchPaths, "```"].join("\n"),
          },
        });
      }
      return;
    }

    core.info(`${this.friendlyName} check finished.`);
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
}

export enum RunCondition {
  disabled,
  autodetect,
  expected,
  required,
}
