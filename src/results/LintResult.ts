import { countBy, Dictionary } from "lodash";
import { RunCondition } from "../check";
import CheckResult from "../check/result";
import { plural } from "../common/utils";
import { CheckAnnotation, CheckConclusion } from "../github/types";
import LintAnnotation, { toCheckAnnotation } from "./LintAnnotation";

export default class LintResult extends CheckResult {
  private readonly countByLevel: Dictionary<number>;

  constructor(
    private readonly runCondition: RunCondition,
    private readonly lintAnnotations: LintAnnotation[]
  ) {
    super();
    this.countByLevel = countBy(this.lintAnnotations, (annotation) => annotation.level);
  }

  shouldCompleteCheck(): boolean {
    return this.runCondition >= RunCondition.expected || this.lintAnnotations.length > 0;
  }

  get conclusion(): CheckConclusion {
    if (this.countByLevel["failure"] > 0) {
      return "failure";
    }
    if (this.countByLevel["warning"] > 0) {
      return "neutral";
    }
    return "success";
  }

  get title(): string {
    if (this.countByLevel["failure"] > 0) {
      return plural(this.countByLevel["failure"], "failure");
    }
    if (this.countByLevel["warning"] > 0) {
      return plural(this.countByLevel["warning"], "warning");
    }
    if (this.countByLevel["notice"] > 0) {
      return plural(this.countByLevel["notice"], "notice");
    }
    return "Passed";
  }

  get summary(): string {
    return this.title;
  }

  get text(): string | undefined {
    return undefined;
  }

  get annotations(): CheckAnnotation[] {
    return this.lintAnnotations.map(toCheckAnnotation);
  }
}
