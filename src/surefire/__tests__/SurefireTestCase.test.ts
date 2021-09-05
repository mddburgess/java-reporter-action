import SurefireTestCase from "../SurefireTestCase";

describe("SurefireTestCase", () => {
  describe("simpleClassName()", () => {
    it("is extracted from the qualified class name", () => {
      const testCase = new SurefireTestCase("org.example.ClassName");
      expect(testCase.simpleClassName).toBe("ClassName");
    });

    it("is equal to className for classes in the unnamed package", () => {
      const testCase = new SurefireTestCase("ClassName");
      expect(testCase.simpleClassName).toBe(testCase.className);
    });
  });

  describe("annotation()", () => {
    describe("start_line and end_line", () => {
      it("is calculated for an ordinary test case", () => {
        const testCase = new SurefireTestCase(
          "org.example.ClassName",
          "testName",
          "failure",
          "",
          "java.lang.RuntimeException: Error message\n" +
            "\tat org.example.ClassUnderTest.methodUnderTest(ClassUnderTest.java:54)\n" +
            "\tat org.example.ClassName.helperMethod(ClassName.java:69)\n" +
            "\tat org.example.ClassName.testName(ClassName.java:42)\n" +
            "\tat org.example.TestFramework.run(TestFramework.java:10)"
        );
        const annotation = testCase.annotation;
        expect(annotation.start_line).toBe(42);
        expect(annotation.end_line).toBe(42);
      });

      it("is calculated for a nested test case", () => {
        const testCase = new SurefireTestCase(
          "org.example.ClassName$NestedClass",
          "testName",
          "failure",
          "",
          "java.lang.RuntimeException: Error message\n" +
            "\tat org.example.ClassName$NestedClass.testName(ClassName.java:42)"
        );
        const annotation = testCase.annotation;
        expect(annotation.start_line).toBe(42);
        expect(annotation.end_line).toBe(42);
      });
    });

    describe("title", () => {
      it("is generated for cases with a test name", () => {
        const testCase = new SurefireTestCase("ClassName", "testName", "failure");
        expect(testCase.annotation.title).toBe("Test failure: ClassName.testName");
      });

      it("is generated for cases without a test name", () => {
        const testCase = new SurefireTestCase("ClassName", "", "failure");
        expect(testCase.annotation.title).toBe("Test failure: ClassName");
      });
    });
  });
});
