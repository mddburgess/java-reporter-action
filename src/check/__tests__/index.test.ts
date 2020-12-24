import { mocked } from "ts-jest/utils";
import * as core from "@actions/core";
import Check, { RunCondition } from "../index";

jest.mock("@actions/core");
const coreMock = mocked(core);

describe("Check", () => {
  describe("when run condition is disabled", () => {
    it("logs a warning message and returns", () => {
      coreMock.getInput.mockReturnValue("disabled");

      const check = new Check("type", "Friendly Name");
      expect(check.runCondition).toBe(RunCondition.disabled);

      check.run();
      expect(coreMock.warning).toBeCalledWith("Friendly Name check is disabled.");
    });
  });

  describe("when run condition is invalid", () => {
    it("logs a warning and defaults to autodetect", () => {
      coreMock.getInput.mockReturnValue("invalid");

      const check = new Check("type", "Friendly Name");
      expect(coreMock.warning).toBeCalledWith("Invalid input: type -- defaulting to autodetect");
      expect(check.runCondition).toBe(RunCondition.autodetect);
    });
  });
});
