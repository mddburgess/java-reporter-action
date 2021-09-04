import { countBy, Dictionary, groupBy, toPairs } from "lodash";
import CheckResult from "../check/result";
import { plural } from "../common/utils";
import { CheckAnnotation, CheckConclusion } from "../github/types";
import LintAnnotation, { toCheckAnnotation } from "./LintAnnotation";

export default class LintResult extends CheckResult {
  private readonly countByLevel: Dictionary<number>;

  public constructor(private readonly lintAnnotations: LintAnnotation[]) {
    super();
    this.countByLevel = countBy(this.lintAnnotations, (annotation) => annotation.level);
  }

  public shouldCompleteCheck(): boolean {
    return true;
  }

  public get conclusion(): CheckConclusion {
    if (this.countByLevel["failure"] > 0) {
      return "failure";
    }
    if (this.countByLevel["warning"] > 0) {
      return "neutral";
    }
    return "success";
  }

  public get title(): string {
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

  public get summary(): string {
    if (this.lintAnnotations.length === 0) {
      return "Passed";
    }

    const categories = toPairs(groupBy(this.lintAnnotations, (annotation) => annotation.category))
      .map(([category, annotations]) => ({
        category: category,
        failures: annotations.filter((a) => a.level === "failure").length,
        warnings: annotations.filter((a) => a.level === "warning").length,
        notices: annotations.filter((a) => a.level === "notice").length,
      }))
      .sort((a, b) => a.category.localeCompare(b.category))
      .map((o) => `| ${o.category} | ${o.failures} | ${o.warnings} | ${o.notices} |`);

    return [
      "| Category | Failures | Warnings | Notices |",
      "| :-- | --: | --: | --: |",
      ...categories,
    ].join("\n");
  }

  public get text(): string | undefined {
    if (this.lintAnnotations.length === 0) {
      return undefined;
    }

    const paths = toPairs(groupBy(this.lintAnnotations, (annotation) => annotation.path))
      .map(([path, annotations]) => ({
        path: path,
        failures: annotations.filter((a) => a.level === "failure").length,
        warnings: annotations.filter((a) => a.level === "warning").length,
        notices: annotations.filter((a) => a.level === "notice").length,
      }))
      .sort((a, b) => a.path.localeCompare(b.path))
      .map((o) => `| \`${o.path}\` | ${o.failures} | ${o.warnings} | ${o.notices} |`);

    return ["| Path | Failures | Warnings | Notices |", "| :-- | --: | --: | --: |", ...paths].join(
      "\n"
    );
  }

  public get annotations(): CheckAnnotation[] {
    return this.lintAnnotations.map(toCheckAnnotation);
  }
}
