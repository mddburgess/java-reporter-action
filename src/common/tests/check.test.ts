import * as core from "@actions/core";
import { mocked } from "ts-jest/utils";
import Check from "../check";
import CheckRun from "../../github/check-run";
import SurefireCheck from "../../surefire/check";

jest.mock("@actions/core");
const coreMock = mocked(core);

jest.mock("../../github/check-run");
const CheckRunMock = mocked(CheckRun);

describe("Check", () => {

  let check: Check<any>;
  let checkRun: CheckRun<any>;

  const init = (checkCondition: string) => {
    coreMock.getInput = jest.fn().mockReturnValue(checkCondition);
    check = new SurefireCheck();
    expect(CheckRunMock).toBeCalled();
    checkRun = CheckRunMock.mock.instances[0];
  }

  describe("when disabled", () => {
    beforeEach(() => {
      init("disabled");
    });

    it("logs warning and returns", async () => {
      await check.run();

      expect(coreMock.warning).toBeCalledWith("surefire check is disabled.");
      expect(checkRun.queue).not.toBeCalled();
      expect(checkRun.begin).not.toBeCalled();
      expect(checkRun.annotate).not.toBeCalled();
      expect(checkRun.conclude).not.toBeCalled();
    });
  });

  describe.skip("when autodetect", () => {
    // beforeEach(() => {
    //   init("autodetect");
    // });
  });

  describe.skip("when expected", () => {
    // beforeEach(() => {
    //   init("expected");
    // });
  });

  describe.skip("when required", () => {
    // beforeEach(() => {
    //   init("required");
    // });
  });
})
