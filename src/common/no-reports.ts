import CheckResult from "../check/result";
import { RunCondition } from "../check/types";
import { CheckAnnotation, CheckConclusion } from "../github/types";

export default class NoReportsResult extends CheckResult {
  public constructor(
    private readonly friendlyName: string,
    private readonly runCondition: RunCondition,
    private readonly searchPaths: string[]
  ) {
    super();
  }

  public shouldCompleteCheck(): boolean {
    return this.runCondition >= RunCondition.expected;
  }

  public get conclusion(): CheckConclusion {
    return this.runCondition === RunCondition.required ? "failure" : "skipped";
  }

  public get title(): string {
    return "No reports found";
  }

  public get summary(): string {
    const runConditionName = this.runCondition === RunCondition.required ? "required" : "expected";
    return `The ${this.friendlyName} check is ${runConditionName}, but no ${this.friendlyName} reports were found.`;
  }

  public get text(): string | undefined {
    return ["### Search paths", "```sh", ...this.searchPaths, "```"].join("\n");
  }

  public get annotations(): CheckAnnotation[] {
    return [];
  }
}
