import { mocked } from "ts-jest/utils";
import * as core from "@actions/core";
import Check, { RunCondition } from "../index";
import CheckRun from "../../github/check-run";

jest.mock("../../github/check-run");
const CheckRunMock = mocked(CheckRun);

describe("Check", () => {
  const warning = jest.spyOn(core, "warning");

  describe("when run condition is disabled", () => {
    it("logs a warning message and returns", async () => {
      process.env["INPUT_TYPE"] = "disabled";

      const check = new Check("type", "Friendly Name");
      expect(check.runCondition).toBe(RunCondition.disabled);
      expect(CheckRunMock).toBeCalled();

      await check.run();
      expect(warning).toBeCalledWith("Friendly Name check is disabled.");
    });
  });

  describe("when run condition is autodetect", () => {
    it("finishes silently when no reports are found", async () => {
      process.env["INPUT_TYPE"] = "autodetect";
      process.env["INPUT_TYPE-REPORT-PATHS"] = "reportPaths";

      const check = new Check("type", "Friendly Name");
      expect(check.runCondition).toBe(RunCondition.autodetect);
      expect(CheckRunMock).toBeCalled();

      await check.run();
      expect(warning).not.toBeCalled();

      const checkRunMock = CheckRunMock.mock.instances[0];
      expect(checkRunMock.queue).not.toBeCalled();
      expect(checkRunMock.complete).not.toBeCalled();
    });
  });

  describe("when run condition is expected", () => {
    it("finishes as skipped when no reports are found", async () => {
      process.env["INPUT_TYPE"] = "expected";
      process.env["INPUT_TYPE-REPORT_PATHS"] = "reportPaths";

      const check = new Check("type", "Friendly Name");
      expect(check.runCondition).toBe(RunCondition.expected);
      expect(CheckRunMock).toBeCalled();

      await check.run();
      expect(warning).not.toBeCalled();

      const checkRunMock = CheckRunMock.mock.instances[0];
      expect(checkRunMock.queue).toBeCalled();
      expect(checkRunMock.complete).toBeCalledWith("skipped");
    });
  });

  describe("when run condition is required", () => {
    it("finishes as failure when no reports are found", async () => {
      process.env["INPUT_TYPE"] = "required";
      process.env["INPUT_TYPE-REPORT_PATHS"] = "reportPaths";

      const check = new Check("type", "Friendly Name");
      expect(check.runCondition).toBe(RunCondition.required);
      expect(CheckRunMock).toBeCalled();

      await check.run();
      expect(warning).not.toBeCalled();

      const checkRunMock = CheckRunMock.mock.instances[0];
      expect(checkRunMock.queue).toBeCalled();
      expect(checkRunMock.complete).toBeCalledWith("failure");
    });
  });

  describe("when run condition is invalid", () => {
    it("logs a warning and defaults to autodetect", () => {
      process.env["INPUT_TYPE"] = "invalid";

      const check = new Check("type", "Friendly Name");
      expect(warning).toBeCalledWith("Invalid input: type -- defaulting to autodetect");
      expect(check.runCondition).toBe(RunCondition.autodetect);
    });
  });
});
