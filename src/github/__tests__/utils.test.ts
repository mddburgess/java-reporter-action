import { AnnotationLevel, CheckAnnotation } from "../types";
import { compareAnnotations } from "../utils";

describe("compareAnnotations()", () => {
  it("sorts annotations by level", () => {
    const annotations: CheckAnnotation[] = [
      annotation("notice"),
      annotation("warning"),
      annotation("failure"),
    ];

    annotations.sort(compareAnnotations);
    expect(annotations).toMatchSnapshot();
  });

  it("sorts annotations with same level by path", () => {
    const annotations: CheckAnnotation[] = [
      annotation("warning", "path/to/package/Second.java"),
      annotation("warning", "path/to/package/nested/Third.java"),
      annotation("warning", "path/to/package/First.java"),
    ];

    annotations.sort(compareAnnotations);
    expect(annotations).toMatchSnapshot();
  });

  it("sorts annotations with same path by start line", () => {
    const annotations: CheckAnnotation[] = [
      annotation("warning", "path/to/Class.java", 2),
      annotation("warning", "path/to/Class.java", 3),
      annotation("warning", "path/to/Class.java", 1),
    ];

    annotations.sort(compareAnnotations);
    expect(annotations).toMatchSnapshot();
  });

  it("handles identical annotations", () => {
    const annotations: CheckAnnotation[] = [
      annotation("warning", "path/to/Same.java", 1),
      annotation("warning", "path/to/Different.java", 2),
      annotation("warning", "path/to/Same.java", 1),
    ];

    annotations.sort(compareAnnotations);
    expect(annotations).toMatchSnapshot();
  });

  it("handles an array of length 1", () => {
    const annotations: CheckAnnotation[] = [annotation("notice")];
    annotations.sort(compareAnnotations);
    expect(annotations).toMatchSnapshot();
  });

  it("handles an empty array", () => {
    const annotations: CheckAnnotation[] = [];
    annotations.sort(compareAnnotations);
    expect(annotations).toMatchSnapshot();
  });
});

const annotation = (level: AnnotationLevel, path = "", line = 0): CheckAnnotation => ({
  path: path,
  start_line: line,
  end_line: line,
  annotation_level: level,
  message: "",
});
