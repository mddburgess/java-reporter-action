import { AnnotationSummary } from "../github/check-run";
import { CheckConclusion } from "../github/types";

const failureOnWarnings = (result: AnnotationSummary): CheckConclusion => {
  if (result.failures + result.warnings > 0) {
    return "failure";
  }
  return "success";
};

const neutralOnWarnings = (result: AnnotationSummary): CheckConclusion => {
  if (result.failures > 0) {
    return "failure";
  }
  if (result.warnings > 0) {
    return "neutral";
  }
  return "success";
}

export {
  failureOnWarnings,
  neutralOnWarnings
};
