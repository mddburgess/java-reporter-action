import * as core from "@actions/core";

class Check {
  private readonly type: string;
  private readonly friendlyName: string;
  private readonly runCondition: RunCondition;

  constructor(type: string, friendlyName: string) {
    this.type = type;
    this.friendlyName = friendlyName;
    this.runCondition = this.resolveRunCondition();
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

  run() {
    if (this.runCondition === RunCondition.disabled) {
      core.warning(`${this.friendlyName} check is disabled.`);
      return;
    }

    core.info(`${this.friendlyName} check finished.`);
  }
}

enum RunCondition {
  disabled,
  autodetect,
  expected,
  required,
}

export default Check;
