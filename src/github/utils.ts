import { AnnotationLevel, CheckAnnotation } from "./types";

export const compareAnnotations = (a: CheckAnnotation, b: CheckAnnotation): number => {
  if (a.annotation_level !== b.annotation_level) {
    return levelValue(a.annotation_level) - levelValue(b.annotation_level);
  }
  if (a.path !== b.path) {
    return a.path.localeCompare(b.path);
  }
  if (a.start_line !== b.start_line) {
    return a.start_line - b.start_line;
  }
  return 0;
};

const levelValue = (level: AnnotationLevel) => {
  switch (level) {
    case "failure":
      return 1;
    case "warning":
      return 2;
    case "notice":
      return 3;
    default:
      throw Error("Unknown annotation level");
  }
};
