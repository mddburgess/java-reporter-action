import { AnnotationLevel, CheckAnnotation } from "../github/types";

export default interface LintAnnotation {
  path: string;
  line: number;
  level: AnnotationLevel;
  category: string;
  type: string;
  message: string;
  details?: string;
}

export const toCheckAnnotation = (lint: LintAnnotation): CheckAnnotation => ({
  path: lint.path,
  start_line: lint.line,
  end_line: lint.line,
  annotation_level: lint.level,
  title: `${lint.category}: ${lint.type}`,
  message: lint.message,
  raw_details: lint.details,
});
