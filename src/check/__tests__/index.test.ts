import { mocked } from "ts-jest/utils";
import * as core from "@actions/core";
import Check from "../index";

jest.mock("@actions/core");
const coreMock = mocked(core);

describe("Check", () => {
  describe("when run condition is disabled", () => {
    it("logs a warning message and returns", () => {
      coreMock.getInput.mockReturnValue("disabled");

      const check = new Check("type", "Friendly Name");
      check.run();

      expect(coreMock.warning).toBeCalledWith("Friendly Name check is disabled.");
    });
  });
});
