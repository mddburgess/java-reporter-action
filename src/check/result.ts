import { CheckAnnotation, CheckConclusion } from "../github/types";

export default abstract class CheckResult {
  abstract shouldCompleteCheck(): boolean;
  abstract get conclusion(): CheckConclusion;
  abstract get title(): string;
  abstract get summary(): string;
  abstract get text(): string | undefined;
  abstract get annotations(): CheckAnnotation[] | undefined;
}
