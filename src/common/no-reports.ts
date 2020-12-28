import CheckResult from "../check/result";
import { CheckAnnotation, CheckConclusion } from "../github/types";
import { RunCondition } from "../check";

export default class NoReportsResult extends CheckResult {
  constructor(
    private readonly friendlyName: string,
    private readonly runCondition: RunCondition,
    private readonly searchPaths: string[]
  ) {
    super();
  }

  shouldCompleteCheck(): boolean {
    return this.runCondition >= RunCondition.expected;
  }

  get conclusion(): CheckConclusion {
    return this.runCondition === RunCondition.required ? "failure" : "skipped";
  }

  get title(): string {
    return "No reports found";
  }

  get summary(): string {
    const runConditionName = RunCondition.required ? "required" : "expected";
    return `The ${this.friendlyName} check is ${runConditionName}, but no ${this.friendlyName} reports were found.`;
  }

  get text(): string | undefined {
    return ["### Search paths", "```sh", ...this.searchPaths, "```"].join("\n");
  }

  get annotations(): CheckAnnotation[] | undefined {
    return undefined;
  }
}
