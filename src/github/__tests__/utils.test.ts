import { CheckAnnotation } from "../types";
import { compareAnnotations } from "../utils";

describe("compareAnnotations()", () => {
  it("sorts annotations by level", () => {
    const annotations: CheckAnnotation[] = [
      {
        path: "",
        start_line: 0,
        end_line: 0,
        annotation_level: "notice",
        message: "",
      },
      {
        path: "",
        start_line: 0,
        end_line: 0,
        annotation_level: "warning",
        message: "",
      },
      {
        path: "",
        start_line: 0,
        end_line: 0,
        annotation_level: "failure",
        message: "",
      },
    ];

    annotations.sort(compareAnnotations);
    expect(annotations).toMatchSnapshot();
  });

  it("sorts annotations with same level by path", () => {
    const annotations: CheckAnnotation[] = [
      {
        path: "path/to/package/Second.java",
        start_line: 0,
        end_line: 0,
        annotation_level: "warning",
        message: "",
      },
      {
        path: "path/to/package/nested/Third.java",
        start_line: 0,
        end_line: 0,
        annotation_level: "warning",
        message: "",
      },
      {
        path: "path/to/package/First.java",
        start_line: 0,
        end_line: 0,
        annotation_level: "warning",
        message: "",
      },
    ];

    annotations.sort(compareAnnotations);
    expect(annotations).toMatchSnapshot();
  });

  it("sorts annotations with same path by start line", () => {
    const annotations: CheckAnnotation[] = [
      {
        path: "path/to/Class.java",
        start_line: 2,
        end_line: 2,
        annotation_level: "warning",
        message: "",
      },
      {
        path: "path/to/Class.java",
        start_line: 3,
        end_line: 3,
        annotation_level: "warning",
        message: "",
      },
      {
        path: "path/to/Class.java",
        start_line: 1,
        end_line: 1,
        annotation_level: "warning",
        message: "",
      },
    ];

    annotations.sort(compareAnnotations);
    expect(annotations).toMatchSnapshot();
  });

  it("handles identical annotations", () => {
    const annotations: CheckAnnotation[] = [
      {
        path: "path/to/Same.java",
        start_line: 1,
        end_line: 1,
        annotation_level: "warning",
        message: "",
      },
      {
        path: "path/to/Different.java",
        start_line: 2,
        end_line: 2,
        annotation_level: "warning",
        message: "",
      },
      {
        path: "path/to/Same.java",
        start_line: 1,
        end_line: 1,
        annotation_level: "warning",
        message: "",
      },
    ];

    annotations.sort(compareAnnotations);
    expect(annotations).toMatchSnapshot();
  });

  it("handles an array of length 1", () => {
    const annotations: CheckAnnotation[] = [
      {
        path: "",
        start_line: 0,
        end_line: 0,
        annotation_level: "notice",
        message: "",
      },
    ];

    annotations.sort(compareAnnotations);
    expect(annotations).toMatchSnapshot();
  });

  it("handles an empty array", () => {
    const annotations: CheckAnnotation[] = [];
    annotations.sort(compareAnnotations);
    expect(annotations).toMatchSnapshot();
  });
});
