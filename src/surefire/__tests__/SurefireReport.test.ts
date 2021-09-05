import { mocked } from "ts-jest/utils";
import SurefireReport from "../SurefireReport";
import { findClasspath } from "../../common/files";

jest.mock("../../common/files");
const findClasspathMock = mocked(findClasspath);

describe("SurefireReport", () => {
  describe("passed()", () => {
    it("is calculated correctly", () => {
      const report = new SurefireReport("name", 19, 7, 5, 3);
      expect(report.passed).toBe(4);
    });
  });

  describe("moduleName()", () => {
    const report = new SurefireReport("org.example.ClassName");
    const path = "org/example/ClassName.java";

    it("is blank if the classpath is not found", () => {
      findClasspathMock.mockReturnValue(undefined);
      expect(report.moduleName).toBe("");
      expect(findClasspathMock).toHaveBeenCalledWith(path);
    });

    it("is blank if no module directory is found", () => {
      findClasspathMock.mockReturnValue("src/test/java/org/example/ClassName.java");
      expect(report.moduleName).toBe("");
      expect(findClasspathMock).toHaveBeenCalledWith(path);
    });

    it("is not blank if the module directory is found", () => {
      findClasspathMock.mockReturnValue("module/src/test/java/org/example/ClassName.java");
      expect(report.moduleName).toBe("module");
      expect(findClasspathMock).toHaveBeenCalledWith(path);
    });
  });

  describe("packageName()", () => {
    it("is extracted from the qualified class name", () => {
      const report = new SurefireReport("org.example.package.name.Class");
      expect(report.packageName).toBe("org.example.package.name");
    });

    it("is a placeholder for classes in the unnamed package", () => {
      const report = new SurefireReport("UnnamedPackageClass");
      expect(report.packageName).toBe("<no package>");
    });
  });
});
