import SurefireReport from "../SurefireReport";

describe("SurefireReport", () => {
  describe("passed()", () => {
    it("is calculated correctly", () => {
      const report = new SurefireReport("name", 19, 7, 5, 3);
      expect(report.passed).toBe(4);
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
