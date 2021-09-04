import { decode } from "html-entities";
import { parseAttrs } from "saxophone-ts";
import {
  CDATANode,
  TagCloseNode,
  TagOpenNode,
  TextNode,
} from "saxophone-ts/dist/types/src/static/nodes";
import ReportParser from "../common/parser";
import SurefireReport, { SurefireTestCase, SurefireTestResult } from "./types";

export default class SurefireParser extends ReportParser<SurefireReport> {
  private testCase: SurefireTestCase = {
    className: "",
    testName: "",
    result: "success",
  };

  public constructor(reportPath: string) {
    super(
      {
        name: "",
        tests: 0,
        failures: 0,
        errors: 0,
        skipped: 0,
        testCases: [],
      },
      reportPath
    );
  }

  protected onTagOpen(tag: TagOpenNode): void {
    switch (tag.name) {
      case "testsuite":
        this.onTestSuiteOpen(parseAttrs(tag.attrs) as TestSuiteAttrs);
        break;
      case "testcase":
        this.onTestCaseOpen(parseAttrs(tag.attrs) as TestCaseAttrs);
        break;
      case "failure":
      case "error":
      case "skipped":
        this.onTestResultOpen(tag.name, parseAttrs(tag.attrs) as TestResultAttrs);
        break;
      default:
        break;
    }
  }

  private onTestSuiteOpen(attrs: TestSuiteAttrs) {
    this.report.name = attrs.name;
    this.report.tests = Number(attrs.tests);
    this.report.failures = Number(attrs.failures);
    this.report.errors = Number(attrs.errors);
    this.report.skipped = Number(attrs.skipped);
  }

  private onTestCaseOpen(attrs: TestCaseAttrs) {
    this.testCase.className = decode(attrs.classname, { level: "xml" });
    this.testCase.testName = decode(attrs.name, { level: "xml" });
  }

  private onTestResultOpen(result: SurefireTestResult, attrs: TestResultAttrs) {
    this.testCase.result = result;
    this.testCase.message = decode(attrs.message, { level: "xml" });
  }

  protected onTagClose(tag: TagCloseNode): void {
    if (tag.name !== "testcase" || this.testCase.result === "success") {
      return;
    }

    this.testCase.stackTrace = this.testCase.stackTrace?.trim();
    this.report.testCases.push(this.testCase);
    this.testCase = {
      className: "",
      testName: "",
      result: "success",
    };
  }

  protected onText(tag: TextNode | CDATANode): void {
    const context = this.getContext();
    if (context === "failure" || context === "error" || context === "skipped") {
      this.testCase.stackTrace = (this.testCase.stackTrace || "").concat(
        decode(tag.contents, { level: "xml" })
      );
    }
  }
}

interface TestSuiteAttrs {
  name: string;
  tests: string;
  failures: string;
  errors: string;
  skipped: string;
}

interface TestCaseAttrs {
  classname: string;
  name: string;
}

interface TestResultAttrs {
  message: string;
}
